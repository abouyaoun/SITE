import React from 'react';
import SessionManager from '../Session/Session';

function Logout() {

    if(SessionManager.getUser()){
        localStorage.removeItem('user')
        window.location = '/login'
    }

}

export default Logout;

