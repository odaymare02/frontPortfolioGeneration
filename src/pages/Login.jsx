import { useRef, } from "react";
import AuthCard from "../reusable/AuthCard";
import useAuth from "../hooks/useAuth";
export default function Login() {
    // const [username,setusername]=useState("");
    const usernameRef=useRef();
    const passwordRef=useRef();
    // const[password,setPassword]=useState("");
    const{authRequest,loading,error}=useAuth();
    const handleLogin=async(e)=>{
        
        e.preventDefault();
        const username=usernameRef.current.value;
        const password=passwordRef.current.value;
        await authRequest({
            url:'/auth/login',
            body:{username,password},
            redirectTo:'/dashboard'
        });
        localStorage.setItem('pun',username);
    };
  return (
    <AuthCard
      title="Sign in"
      buttonText={loading?"Signing in...":"Sign in"}
      linkLabel="Don't have an account?"
      linkText="Register"
      linkTo="/register"
      onSubmit={handleLogin}
    >
      <input
        type="text"
        placeholder="username"
        className="w-full rounded-lg bg-slate-800/70 px-3 py-2 text-white"
        // value={username}
        // onChange={e=>setusername(e.target.value)}
        ref={usernameRef}
        />

      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-lg bg-slate-800/70 px-3 py-2 text-white"
        // value={password}
        // onChange={e=>setPassword(e.target.value)}
        ref={passwordRef}
      />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

    </AuthCard>
  );
}
