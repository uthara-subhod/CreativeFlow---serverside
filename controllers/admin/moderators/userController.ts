import UserRepository from "../../../repositories/UserRepository";

export const users = async (req,res)=>{
    try {
        const users = await UserRepository.getUsers()
        if(users){
            res.status(200).json({data:users})
        }else{
            res.status(404).json({msg:"users not found"})
        }
    
           
        
    } catch (error) {
      res.status(404).send('Error');
    }       
}

export const edit = async (req,res)=>{
    try{
        const id = req.params.id
        console.log(id)
        const user = await UserRepository.changeAccess(id)
        console.log(user)
        if(user){
            res.status(200).json({msg:"Edited"})
        }else{
            res.status(404).json({msg:"Errror"})
        }
    }catch(err:any){
        res.status(404).json({msg:err.message})
    }
}
