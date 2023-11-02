import userService from '../../services/userService';
import { Request, Response } from 'express';
import { otpEmail } from '../../utility/mail';
import UserRepository from '../../repositories/UserRepository';

export const register = async (req: Request, res:Response) => {
    try {
      const { fullname , email, password, banner} = req.body;
      const {token, user} = await userService.register(fullname, email, password, banner);
      res.status(200).json({ token,  user });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }
  
  export const login = async (req: Request, res:Response) => {
    try {
      const { email, password, remember} = req.body;
      let expires = 1
      if(remember){
        expires = 14
      }
      const {token, user} = await userService.userLogin(email, password, expires);
      res.json({ token, user });
    } catch (error:any) {
      console.log(error.message)
      res.status(400).json({ error: error.message });
    }
  }

  export const otp = async (req,res)=>{
    try{
      const {email}= req.body
      const verify = await UserRepository.findByEmail(email)
      if(verify){
        res.status(400).json({msg:"User already exists"})
      }else{

        const otp= Math.floor(100000 + Math.random() * 900000).toString();
        const send = await otpEmail(otp, email)
        if(send){
          res.status(200).json({otp:otp,msg:"send"})
        }else[
          res.status(500).json({msg:"error"})
        ]
      }
    }catch(err:any){
      res.status(500).json({error:err.message})
    }
  }

  export const google = async(req,res)=>{
    try{
      const google = req.body
      const data = {
        email:google.email,
        fullname:google.name,
        isSocial:true
      }
      const {token, user} = await userService.googleAuth(google.id,data)
      res.json({ token, user });
    }catch(err:any){
      res.status(500).json({error:err.message})
    }
  }