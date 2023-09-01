    import axios from 'axios';
    import {useState, useContext, useEffect} from 'react'
    import {toast} from 'react-toastify';
    import {SyncOutlined} from '@ant-design/icons';
    import Link from 'next/link';
    import {Context} from '../context';
    import {useRouter} from 'next/router';

    const Login=()=>{
        const [email,setEmail]=useState('')
        const [password,setPassword]=useState('')
        const [loading,setLoading]=useState(false)
        
        const{state:{user},dispatch,}=useContext(Context);
        
        //console.log("STATE",state);
        const router=useRouter();
        useEffect(()=>
        {
            if(user!==null)
            {
                router.push("/");
            }
        },[user]);
        //console.log("TESTING ENV",process.env.NEXT_PUBLIC_API)
        const handleSubmit=async(e)=>
        {
            e.preventDefault();
            try
            {
                setLoading(true);
                const {data}=await axios.post(`/api/login`,{
                    email,
                    password,
                });
            dispatch({
                type:"LOGIN",
                payload:data,
            });
            window.localStorage.setItem("user",JSON.stringify(data));
            //console.log("Login Response",data);
                //setLoading(false);
            router.push("/user");
            
        }

        catch(err)
        {
            toast(err.response.data);
            setLoading(false);
        }
        
        //console.log("Register Response",data);
            //console.table({name,email,password});
        };
        return(
            <>
                <h1 className="jumbotron text-center bg-primary square" style={{height: '200px', lineHeight: '200px' }}>Login</h1>

                <div className="container col-md-4 offset-md-4 pb-5">
                    <form onSubmit={handleSubmit}>
            
                        <input
                        type="email"
                        className="form-control mb-4 p-4" 
                        value={email} 
                        onChange={e=>setEmail(e.target.value)} 
                        placeholder="Enter email" required
                        />
                        <input
                        type="password"
                        className="form-control mb-4 p-4" 
                        value={password} 
                        onChange={e=>setPassword(e.target.value)} 
                        placeholder="Enter Password" required
                        />
                        
                            <button type="submit" className="btn btn-block btn-primary" disabled={!password || !email || loading}>
                                {loading ? <SyncOutlined spin/> : "Submit"}
                            </button>
                    </form>
                    <p className="text-center pt-3"> Not registered?{" " }
                        <Link legacyBehavior href="/register"><a>Register</a></Link>
                    </p>

                    <p className="text-center">
                        <Link legacyBehavior href="/forgot-password">
                            <a className='text-danger'>Forgot Password</a></Link>
                    </p>
                    
                    
                </div>
            </>
        );
    }
    export default Login;