import Provider from "../models/Provider";
import Service from "../models/Service";

class ServiceRepository{
    async addService(data:any){
        return Service.create(data)
    }
    async findServiceByName(name:string){
        return Service.findOne({name: { $regex: new RegExp(`^${name}$`, "i") }})
    }
    async findServiceById(id:string){
        return Service.findOne({cat_id:id})
    }
    async services(){
        return Service.find()
    }
    async updateService(id:string, name:string, cover:string){
        return Service.findOneAndUpdate({cat_id:id},{$set:{name:name, cover:cover}}, {new:true})
    }
    async deleteService(id:string){
        return Service.findOneAndDelete({cat_id:id})
    }
    async createProvider(data){
        return Provider.create(data)
    }
    async  editProvider(provider_id:string, approved:boolean){
        return Provider.findOneAndUpdate({provider_id:provider_id},{$set:{approved:approved}})
    }
    async deleteProvider(provider_id:string){
        return Provider.findOneAndDelete({provider_id:provider_id})
    }

    async getProviders(){
        return  Provider.find({approved:true}).populate('user').populate('service')
  
    }
    async providers(){
        return Provider.find().populate('user').populate('service')
    }

    async findProvider(id:string){
        return Provider.findOne({provider_id:id}).populate('user').populate('service')
    }

    async getServices(){
        return Service.find()
    }

}

export default new ServiceRepository()