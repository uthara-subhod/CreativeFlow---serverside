import ModeratorRepository from "../../repositories/ModeratorRepository";
import bcrypt from 'bcrypt';

export const createMod = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const mod = await ModeratorRepository.createMod({username:username, password:hashedPassword, role:role});
        res.status(200).json({ mod:mod});
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}



export const editAccess = async (req,res)=>{
    try{
        const {access}= req.body
        const mod_id=req.params.mod_id
        const mod = await ModeratorRepository.editAccess(access,mod_id)
        if(mod){
            res.status(200).json({ mod:mod});
        }else{
            res.json(404).json({msg:"No such mod"})
        }

    }catch(err:any){
        res.status(500).json({ error: err.message });
    }
}

export const deleteMod = async (req,res)=>{
    try{
        const mod_id=req.params.mod_id
        const mod = await ModeratorRepository.deleteMod(mod_id)
        if(mod){
            res.status(200).json({ msg:"deleted!"});
        }else{
            res.json(404).json({msg:"No such mod"})
        }
    }catch(err:any){
        res.status(500).json({ error: err.message });
    }
}

export const undoAction = async (req,res)=>{
    try{

    }catch(err:any){
        res.status(500).json({ error: err.message });
    }
}

export const getMods = async (req,res)=>{
    try{
        const mods = await ModeratorRepository.getMods()
        if(mods){
            res.status(200).json({ mods:mods});
        }else{
            res.json(404).json({msg:"No such mod"})
        }
    }catch(err:any){
        res.status(500).json({ error: err.message });
    }
}

export const getMod = async (req,res)=>{
    try{
        const mod_id=req.params.mod_id
        const mod = await ModeratorRepository.findMod(mod_id)
        if(mod){
            res.status(200).json({ mod:mod});
        }else{
            res.json(404).json({msg:"No such mod"})
        }
    }catch(err:any){
        res.status(500).json({ error: err.message });
    }
}

