import AdminRepository from "../../repositories/AdminRepository";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ModeratorRepository from "../../repositories/ModeratorRepository";

export const login = async (req,res)=>{
    try {
        const {username, password}= req.body
        const admin = await AdminRepository.isAdmin(username)
        const mod = await ModeratorRepository.isMod(username)
        if(admin){
            const passwordMatch = await bcrypt.compare(password, admin.password as string);
            console.log(passwordMatch)
            if(passwordMatch){

                const token= jwt.sign({ admin:admin.username}, process.env.ADMIN_SECRET as string, { expiresIn: `1d` });
                res.status(200).json({token,admin:username})
            }else{
                res.status(400).json({msg:"Access Denied"})
            }
        }else if(mod){
            const passwordMatch = await bcrypt.compare(password, mod.password as string);
            if(passwordMatch){
                const token= jwt.sign({ mod:mod.mod_id}, process.env.MOD_SECRET as string, { expiresIn: `1d` });
                res.status(200).json({token,mod:username})
            }else{
                res.status(400).json({msg:"Access Denied"})
            }   
        }else{
            res.status(404).json({msg:"Access Denied"})
        }
    
           
        
    } catch (error) {
      res.status(404).send('Error');
    }
}