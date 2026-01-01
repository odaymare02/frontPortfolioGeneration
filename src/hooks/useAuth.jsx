import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function useAuth() {
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState(null);
    const [response,setResponse]=useState(null);
    const navigate=useNavigate();
  const authRequest=async({url,body,redirectTo,saveToken=true})=>{
    setLoading(true);
    setError(null);
    setResponse(null);
    try{
        const res=await api.post(url,body);
        if(saveToken&&res.data?.token){
            localStorage.setItem('ptoken',res.data.token);
        }
        setResponse(res.data);
        if(redirectTo) navigate(redirectTo);
        return res.data;
    }catch(err){
         const message =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";

      setError(message);
      throw err;
    }finally{
        setLoading(false);
    }
  }
  return{
    authRequest,
    loading,
    error,
    response
  };
}
