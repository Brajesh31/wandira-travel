import React, { createContext, useContext } from 'react'
import { useState } from 'react';

const userContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setuser] = useState(null);
    const [token, settoken] = useState("");
    const [authoed, setauthoed] = useState(false);

    const login = (data) => {
        setuser(data);
        settoken(data.token);
        setauthoed(true);
    }
    const logout = () => {
        setuser(null);
        settoken("");
        setauthoed(false);
    }

    return (
        <userContext.Provider value={{ user, setuser, login, logout, token, settoken, authoed, setauthoed }}>
            {children}
        </userContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(userContext);
    if (!context) {
        throw new Error("there is no auth context");
    }
    return context;
};