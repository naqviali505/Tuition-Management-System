import { useState,useContext,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const ForgotPassword = () => {
    //state
    const [email,setEmail]=useState("");
    const [success,setSuccess]=useState(false);
    
    const [newPassword,setNewPassword]=useState("");
    const [loading,setLoading]=useState(false);

    // context
    const {
        state:{user},
    }=useContext(Context);
    // router
    const router=useRouter();
    // redirect if user is logged in
    useEffect(()=>
    {
        if(user!==null)
        {
            router.push("/");
        }
    },[user]);
    const handleSubmit=async(e)=>
    {
        e.preventDefault();
        try
        {
            setLoading(true);
            const {data}=await axios.post(`/api/forgot-password`,{
                email,
            });
            setSuccess(true);
            
            setLoading(false);
        }
        catch(err)
        {
            toast(err.response.data);
            setLoading(false);
        }
    };
    const handleResetPassword=async(e)=>
    {
        e.preventDefault();
        try
        {
            setLoading(true);
            const {data}=await axios.post(`/api/reset-password`,{
                email,
                newPassword,
            });
            setEmail("");
            setCode("");
            setNewPassword("");
            setLoading(false);
            toast("Great! Now you can login with your new password");
        
        }
        catch(err)
        {
            toast(err.response.data);
            setLoading(false);
        }
    }
    return (
        <>
            <h1 className="jumbotron text-center bg-primary square" style={{height: '200px', lineHeight: '200px' }}>Forgot Password</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={ success ? handleResetPassword: handleSubmit}>
                    
                    <>
                        
                    <input
                        type="password"
                        className="form-cont rol mb-4 p-4"
                        value={newPassword}
                        onChange={(e)=>setNewPassword(e.target.value)}
                        placeholder="New password"
                        required
                    />
                    </>
                        <br/>
                    <button
                        type="submit"
                        className="btn btn-block btn-primary"
                        disabled={!newPassword}
                    >
                        {loading ? <SyncOutlined spin /> : "Submit"}
                    </button>
                </form>
            </div>


        </>
        
        )
};
export default ForgotPassword;
