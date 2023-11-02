import ModeratorRepository from '../../../repositories/ModeratorRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req,res)=>{
    try {
        const {username, password}= req.body
        const mod = await ModeratorRepository.isMod(username)
        if(mod){
            const passwordMatch = await bcrypt.compare(password, mod.password as string);
            if(passwordMatch){

                const token= jwt.sign({ mod:mod.mod_id, role: mod.role}, process.env.MOD_SECRET as string, { expiresIn: `1d` });
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