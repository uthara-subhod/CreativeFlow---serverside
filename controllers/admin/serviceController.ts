import ServiceRepository from "../../repositories/ServiceRepository";


export const addService = async (req, res) => {
    try {
        const data = req.body;
        const exist = await ServiceRepository.findServiceByName(data.name)
        if (exist) {
            res.status(409).json({ msg: "Genre already exists!" })
        } else {
            const genre = await ServiceRepository.addService(data)
            if (genre) {
                res.status(200).json({ msg: "Added" })
            } else {
                res.status(500).json({ msg: "Error creating genre" })
            }

        }
    } catch (err) {
        res.status(500).json({ msg: "Error creating genre" })
    }
}

export const service = async (req, res) => {
    try {
        const id = req.params.service
        const genre = await ServiceRepository.findServiceById(id)
        if (genre) {
            res.status(200).json({ item: genre })
        } else {
            res.status(404).json({ msg: "No such Genre" })
        }
    } catch (err) {
        res.status(500).json({ msg: "Internal server error" })
    }
}

export const services = async (req, res) => {
    try {
        const services = await ServiceRepository.services()
        if (services) {
            res.status(200).json({ data: services })
        } else {
            res.status(500).json({ msg: "Error fetching data" })
        }

    } catch (err) {
        res.status(500).json({ msg: "Error fetching data" })
    }
}

export const editService = async (req, res) => {
    try {
        const { name, cover } = req.body;
        const id = req.params.service
        const exist = await ServiceRepository.findServiceByName(name)
        if(exist?.cat_id!=id){
            res.status(500).json({ msg: "genre already exist" })
        }
        const genre = await ServiceRepository.updateService(id, name, cover)
        if (genre) {
            res.status(200).json({ msg: "Edited" })
        } else {
            res.status(500).json({ msg: "Error updating genre" })
        }



    } catch (err) {
        res.status(500).json({ msg: "Error updating genre" })
    }
}

export const deleteService = async (req, res) => {
    try {
        const id = req.params.service
        const genre = await ServiceRepository.findServiceById(id)
        if (genre) {
            if (genre.items.length == 0) {
                const deleted = await ServiceRepository.deleteService(id)
                if (deleted) {
                    res.json(200).json({ msg: "Deleted" })
                } else[
                    res.status(500).json({ msg: "Error deleting genre" })
                ]
            } else {
                res.status(409).json({ msg: "Genre is not Empty!" })
            }
        } else {
            res.status(404).json({ msg: "No such Genre" })
        }
    } catch (err) {
        res.status(500).json({ msg: "Internal server error" })
    }
}

export const providers = async (req,res)=>{
    try {
        const providers = await ServiceRepository.providers()
        if (providers) {
            res.status(200).json({ data: providers })
        } else {
            res.status(500).json({ msg: "Error fetching data" })
        }

    } catch (err) {
        res.status(500).json({ msg: "Error fetching data" })
    }
}

export const provider = async (req,res)=>{
    try{
        const {approved}=req.body
        const id = req.params.id
        const provider = await ServiceRepository.editProvider(id, approved)
        if(provider){
            res.status(200).json({ msg:"success!" })
        }else{
            res.status(500).json({ msg: "Error editing" })
        }
    }catch(err:any){
        res.status(500).json({ msg: err.message })
    }
}

