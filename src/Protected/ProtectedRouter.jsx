import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRouter() {
 const token=localStorage.getItem('ptoken');
 if(!token){
    return <Navigate to={'/'}/>;
 }
 return <Outlet/>
}
