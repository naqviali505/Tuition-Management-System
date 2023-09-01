    import axios from 'axios';
    import {useState,useEffect,useContext} from 'react'
    import {toast} from 'react-toastify';
    import {SyncOutlined} from '@ant-design/icons';
    import {Context} from '../context';
    import {useRouter} from 'next/router';
    import Link from 'next/link';
    import user from '../../backend/models/user'
    const Register=()=>{
        const [name,setName]=useState('')
        const [email,setEmail]=useState('')
        const [password,setPassword]=useState('')
        const [loading,setLoading]=useState(false)
        const{state:{user},}=useContext(Context);

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
                const {data}=await axios.post(`/api/register`,{
                    name,
                    email,
                    password,
                });
            toast("Register Success. Please Login");
            setLoading(false);
            setName('');
            setEmail('');
            setPassword('');
            
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
                <h1 className="jumbotron text-center bg-primary square" style={{height: '200px', lineHeight: '200px' }}>Register</h1>

                <div className="container col-md-4 offset-md-4 pb-5">
                    <form onSubmit={handleSubmit}>
                    <input
                        type="name"
                        className="form-control mb-4 p-4" 
                        value={name} 
                        onChange={e=>setName(e.target.value)} 
                        placeholder="Enter name" required
                        />
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
                        
                            <button type="submit" className="btn btn-block btn-primary" disabled={!name || !password || !email || loading}>
                                {loading ? <SyncOutlined spin/> : "Submit"}
                                </button>
                    </form>
                    <p className="text-center p-3"> Already registered?{" " }
                        <Link legacyBehavior href="/login"><a>Login</a></Link>
                    </p>
                    
                </div>
            </>
        );
    }
    export default Register;