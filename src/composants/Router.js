import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Trading from './User/Trading';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Logout from './Auth/Logout'
import SessionManager from "./Session/Session";

function RequireAuth({ children, redirectTo }) {
    let isAuthenticated = SessionManager.getAuth();
    console.log(isAuthenticated)
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

export const Router = (props) => (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />}/>


        <Route path="/trading" element={<RequireAuth redirectTo="/login"><Trading /></RequireAuth>}/>
        <Route path="/logout" element={<RequireAuth redirectTo="/login"><Logout /></RequireAuth>}/>
    </Routes>
)
