import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import Home from './pages/home/Home';
import Navigation from './components/shared/navigation/Navigation';
import GuestRoutes from './ProtectedRoutes/GuestRoutes';
import Authenticate from './pages/authenticate/Authenticate';
import ProtectedRoutes from './ProtectedRoutes/ProtectedRoutes';
import Rooms from './pages/rooms/Rooms';
import Activate from './pages/activate/Activate';
import SemiProtectRoutes from './ProtectedRoutes/SemiProtectRoutes';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/loader/Loader';
import Room from './pages/room/Room';
import React from 'react';

import { Toaster } from 'react-hot-toast';



function App() {

  const {loading} = useLoadingWithRefresh ();

  return (
  <>
    <div>
      <Toaster
          position="top-right"
          toastOptions={{
              success: {
                  theme: {
                      primary: '#4aed88',
                  },
              },
          }}
      ></Toaster>
      </div>
  
    {loading ? (
      <Loader message="Loading, please wait.." />
      ) : (
      <Routes>

        <Route path='/' element={<GuestRoutes/>}>
          <Route path="/" element={
              <>
                <Navigation />
                <Home/>
              </>
            }/>


          <Route path="authenticate" element={
            <>
              <Navigation />
              <Authenticate />
            </>
          }/>

        </Route>

        <Route path='/' element={<SemiProtectRoutes/>}>
          <Route path="activate" element={
            <>
              <Navigation />
              <Activate />
            </>
          }/>
        </Route>

        <Route path='/' element={<ProtectedRoutes/>}>
          <Route path="/rooms" element={
            <>
              <Navigation />
              <Rooms />
              {/* <EditorPage/> */}
            </>
          }/>


          <Route path="/room/:id" element={
            <>
              <Navigation />
              <Room />
              {/* <EditorPage/> */}
            </>
          }/>
          
        </Route>

      </Routes>
      )
    }

  </>


  )
}

export default App;
