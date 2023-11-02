import ServiceRepository from "../../repositories/ServiceRepository";

export const registerProvider = async (req,res)=>{
    try{
        const user = req.user._id
        const data:any = req.body
        data.user = user
        const provider = await ServiceRepository.createProvider(data)
        if(provider){
            res.status(200).json({msg:"Registered successfully"})
        }else{
            res.statsu(400).json({msg:"some error"})
        }
    }catch(err:any){

        res.status(500).json({ msg: err.message })    }
}

export const providers = async (req,res)=>{
    try{
        const providers = await ServiceRepository.getProviders()
        res.status(200).json({providers:providers})
    }catch(err:any){
        res.status(500).json({ msg: err.message })
    }
}

export const provider = async (req,res)=>{
    try{
        const id = req.params.id
        const provider = await ServiceRepository.findProvider(id)
        if(provider){

            res.status(200).json({provider:provider})
        }else{
            res.status(404).json({msg:"provider not found!"})
        }
    }catch(err:any){
        res.status(500).json({ msg: err.message })
    }
}
