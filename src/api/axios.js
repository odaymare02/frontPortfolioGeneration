import axios from "axios";

// baseURL:'http://localhost:5000/api',
    // baseURL:'https://portfolio-generator-yxj3.onrender.com/api',

const api=axios.create({
    baseURL:'https://portfolio-generator-yxj3.onrender.com/api',
    headers:{
        "Content-Type":"application/json"
    }
});

api.interceptors.request.use((config)=>{
    const token=localStorage.getItem('ptoken');
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    };
    return config;
})

export default api;