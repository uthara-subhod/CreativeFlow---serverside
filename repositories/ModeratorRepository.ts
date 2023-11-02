import Mod from "../models/Moderator"
import Logs from "../models/Logs"


class ModeratorRepository{
    async isMod(username:string){
        return Mod.findOne({username:username})
    }

    async createMod(data:any){
        return Mod.create(data)
    }
    async findMod(mod_id:string){
        return Mod.findOne({mod_id:mod_id})
    }

    async getMods(){
        return Mod.find()
    }

    async editAccess(access:boolean, mod_id:string){
        return Mod.findOneAndUpdate({mod_id:mod_id},{$set:{access:access}})
    }

    async deleteMod(mod_id:string){
        return Mod.findOneAndDelete({mod_id:mod_id})
    }

    async addLog(data:any){
        return Logs.create(data)
    }

    async removeLog(log_id:string){
        return Logs.findOneAndDelete({log_id:log_id})
    }

    async getLogs(){
        return Logs.find().populate({path:'moderator'}).populate({path:'book_id'}).populate({path:'chapter_id'})
        .populate({path:'artwork_id'}).populate({path:'provider_id'}).populate({path:'user_id'})
    }


}

export default new ModeratorRepository()    