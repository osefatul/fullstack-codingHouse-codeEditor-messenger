import React, { useState } from 'react'
import { useEffect } from 'react'
import { compileCode } from '../../../http'

import "./codeEditor.css"



function JSCompiler({js, srcDoc}) {

    const [compiledCode, setCompiledCode] = useState()
    const [error, setError] = useState("")

    console.log(srcDoc)

    useEffect(()=>{
        const callCompiler = async ()=>{
            const res = await compileCode({code:js})
            // console.log(res)
            if(res.status === 200) {
                setCompiledCode(res.data.output)
            }
            else{
                setError("Code is not printing or returning anything.")
            }
        }
        callCompiler()
    },[])


    useEffect(()=>{
        setCompiledCode(compiledCode)
    },[compiledCode])

    useEffect(()=>{
        setError("Code is not printing or returning anything.")
    },[error])



    return (
        <div className="compiler">
            <div className='codes'>
                {compiledCode ?
                <p>{compiledCode}</p>:
                <p>{error}</p>
                }
            </div>
        </div>
    )
}


export default JSCompiler