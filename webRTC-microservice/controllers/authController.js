const otpService = require('../services/otpService');
const hashService = require('../services/hashService');
const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const UserDto = require('../dtos/userDto');



class AuthController {

    
    // Login or Signup using Phone
    async sendOtp(req, res) {

        const { phone, email } = req.body;

        if (!phone && !email) {
            res.status(400).json({ message: 'Field is required!' });
        }

        const otp = await otpService.generateOtp();

        //time to leave
        const ttl = 1000 * 60 * 3; // 3 min
        const expires = Date.now() + ttl;
        
        const data = phone ? `${phone}.${otp}.${expires}`: `${email}.${otp}.${expires}`;
        const hash = hashService.hashOtp(data);

        // send OTP
        try {
            // await otpService.sendBySms(phone, otp);
            phone ?
            await otpService.sendBySms(phone, otp):
            await otpService.sendByEmail(email, otp)

            phone?
            res.json({
                hash: `${hash}.${expires}`,
                phone,
                otp,
            }) :
            res.json({
                hash: `${hash}.${expires}`,
                email,
                otp,
            })

        } 
        catch (err) {
            console.log(err);
            res.status(500).json({ message: 'message sending failed' });
        }
    }


    async verifyOtp(req, res) {
        const { otp, hash, phone, email } = req.body;
        console.log("verify body", req.body);
        // if (!otp || !hash || !phone ) {
        //     res.status(400).json({ message: 'All fields are required!' });
        // }

        const [hashedOtp, expires] = hash.split('.');
        if (Date.now() > +expires) {
            res.status(400).json({ message: 'OTP expired!' });
        }

        const data = phone? `${phone}.${otp}.${expires}`: `${email}.${otp}.${expires}`

        const isValid = otpService.verifyOtp(hashedOtp, data);
        if (!isValid) {
            res.status(400).json({ message: 'Invalid OTP' });
        }

        let user;
        try {
            if(phone){
                user = await userService.findUser({ phone });
                if (!user) {
                    user = await userService.createUser({ phone });
                }
            }
            user = await userService.findUser({ email });
            if (!user) {
                user = await userService.createUser({ email });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Db error' });
        }

        const { accessToken, refreshToken } = await tokenService.generateTokens({
            _id: user?._id,
            activated: false,
        });

        await tokenService.storeRefreshToken(refreshToken, user?._id);

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });
    }



    // refresh token
    async refresh(req, res) {
        //1. get refresh token from cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        
        //2. check if token is valid
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(
                refreshTokenFromCookie
            );
        } catch (err) {
            return res.status(401).json({ message: 'Invalid Token' });
        }

        //3. Check if token is in db
        try {
            const token = await tokenService.findRefreshToken(
                userData._id,
                refreshTokenFromCookie
            );
            if (!token) {
                return res.status(401).json({ message: 'Invalid token' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Internal error' });
        }

        //4. check if user is valid
        const user = await userService.findUser({ _id: userData._id });
        if (!user) {
            return res.status(404).json({ message: 'No user' });
        }
        
        //5. Generate new tokens
        const { refreshToken, accessToken } = await tokenService.generateTokens({
            _id: userData._id,
        });

        //6. Update refresh token in db
        try {
            await tokenService.updateRefreshToken(userData._id, refreshToken);
        } catch (err) {
            return res.status(500).json({ message: 'Internal error' });
        }
        
        //7. put in cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        //8. put in cookie
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        
        //9. send response to user
        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });
    }


    async logout(req, res) {
        const { refreshToken } = req.cookies;
        // delete refresh token from db
        await tokenService.removeToken(refreshToken);
        // delete cookies
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.json({ user: null, auth: false });
    }



}

module.exports = new AuthController(); //singleton pattern 