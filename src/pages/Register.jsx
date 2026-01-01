import { useState } from "react";
import AuthCard from "../reusable/AuthCard";
import useAuth from "../hooks/useAuth";

export default function Register() {
    const[username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const{authRequest,error,loading}=useAuth();
    const handleRegister=async(e)=>{
        e.preventDefault();
        await authRequest({
            url:'/auth/register',
            body:{username,password},
            redirectTo:'/',
            saveToken:false
        });
    }
  return (
    <AuthCard
      title="Create account"
      buttonText={loading?"Creating...":"Register"}
      linkLabel="Already have an account?"
      linkText="Login"
      linkTo="/"
      onSubmit={handleRegister}
    >
      <input
        type="text"
        placeholder="Username"
        className="w-full rounded-lg bg-slate-800/70 px-3 py-2 text-white"
        value={username}
        onChange={e=>setUsername(e.target.value)}
        />

      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-lg bg-slate-800/70 px-3 py-2 text-white"
        value={password}
        onChange={e=>setPassword(e.target.value)}
      />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

    </AuthCard>
  );
}
