import Commission from "../models/Commission";
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

    async createRequest(data:any){
        return Commission.create(data)
    }

    async findCommission(commission_id:string,user:string){
        return Commission.findOne({ commission_id:commission_id,$or: [{ customer:  user }, { vendor:  user }]}).populate({path:'vendor'}).populate({path:'customer'}).populate({path:'provider'})
    }

    async clientRequests(user:string){
        return Commission.find({customer:user})
    }

    async vendorRequests(user:string){
        return Commission.find({vendor:user})
    }

    async vendorStatus(status:string, commission_id:string){
        return Commission.findOneAndUpdate({commission_id:commission_id},{$set:{status:status}})
    }

    async editRequest(data:any, commission_id:string){
        return Commission.findOneAndUpdate({commission_id:commission_id},{$set:data})
    }

    async clientAgree(commission_id:string){
        return Commission.findOneAndUpdate({commission_id:commission_id},{$set:{agree2:true,agreeDate:Date.now()}})
    }

    async createPaymentLink(commission_id:string, paymentOrder:string){
        return Commission.findOneAndUpdate({commission_id:commission_id},{$set:{paymentOrder:paymentOrder}})
    }

    async payRequest(commission_id:string, paymentId:string){
        return Commission.findOneAndUpdate({commission_id:commission_id},{$set:{paymentId:paymentId, paid:true}})
    }

    async hasPaid(customer:string){
        return Commission.findOne({customer:customer, paid:false})
    }

}

export default new ServiceRepository()