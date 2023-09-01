import User from '../models/user.js';
import { hashPassword, comparePassword } from '../utils/auth.js';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

export const register= async(req,res)=>
{
    try
    {
        //console.log(req.body);
        const {name,email,password}=req.body;
        //validation
        if(!name) return res.status(400).send('Name is required');
        if(!password || password.length<6) return res.status(400).send('Password is required and should be min 6 characters long');
        let userExist=await User.findOne({email}).exec(); 
        if(userExist) return res.status(400).send('Email is taken');
    
    //hash password
    const hashedPassword=await hashPassword(password);
    //register
    const user=new User({
        name,
        email,
        password:hashedPassword,
    })
    await user.save();
    console.log('saved user',user);
    return res.json({ok:true});

}
catch(err)
    {
     return res.status(400).send('Error. Try again.');   
    }    
};
export const login= async(req,res)=>
{
    try
    {
        //console.log(req.body);
        const {email,password}=req.body;
        //check if our db has user with that email
        const user=await User.findOne({email}).exec();
        if(!user) return res.status(400).send('No user found');
        const match=await comparePassword(password,user.password);
        if(!match) return res.status(400).send('Wrong password')

        const token= jwt.sign({_id:user._id},process.env.JWT_SECRET,
            {expiresIn:'7d', 
        });
        user.password=undefined;
        res.cookie('token',token,{
            httpOnly:true,
            //secure:true, //only works on https
        });
        res.json(user);
        
    } catch(err)
    {
        console.log(err);
        return res.status(400).send('Error. Try again.');
    }

}
export const logout= async(req,res)=>
{
    try
    {
        res.clearCookie('token');
        return res.json({message:"Signout success"});
    }
    catch(err)
    {
        console.log(err);
    }
}
export const currentUser= async(req,res)=>
{
    try
    {
        const user=await User.findById(req.user._id).select('-password').exec();
        console.log('CURRENT_USER',user);
        return res.json({ok:true});
    }
    catch(err)
    {
        console.log(err);
    }
};
export const forgotPassword= async(req,res)=>
{
    try
    {
        const {email}=req.body;
        const shortCode=nanoid(6).toUpperCase();
        const user= await User.findOneAndUpdate({email},{passwordResetCode:shortCode});
        //console.log(email);



    
        if(!user) return res.status(400).send('User not found');
        const params={
            Source:process.env.EMAIL_FROM,
            Destination:{
                ToAddresses:[email],
            },
            ReplyToAddresses:[process.env.EMAIL_FROM],
            Message:{
                Body:{
                    Html:{
                        Charset:'UTF-8',
                        Data:`<html><body><h1>Reset Password</h1><p>Use this code to reset your password</p><h2 style="color:red;">${shortCode}</h2><i>tuition-management.com</i></body></html>`,
                    },
                },
                Subject:{
                    Charset:'UTF-8',
                    Data:'Reset Password',

                },
            },
        };

        
    }
    catch(err)
    {
        console.log(err);
    }
}
export const resetPassword= async(req,res)=>
{
    try
    {   
       const{email,newPassword}=req.body;
       const hashedPassword=await hashPassword(newPassword);
        const user=User.findOneAndUpdate({email},{password:hashedPassword}).exec();
        res.json({ok:true});


    } catch(err)
    {
        console.log(err);
        return res.status(400).send('Error. Try again.');
    }   
};

