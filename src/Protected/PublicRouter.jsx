import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

export default function PublicRouter() {
    const token=localStorage.getItem('ptoken');
    if(token){
        return <Navigate to={"/dashboard"} replace/>;
    }
    return <Outlet/>
}
