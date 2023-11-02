import Admin from "../models/Admin";


class AdminRepository{
    async isAdmin(username:string){
        return Admin.findOne({username:username})
    }
}

export default new AdminRepository()