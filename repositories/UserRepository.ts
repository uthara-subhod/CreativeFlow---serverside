import User, { IUser } from '../models/User';

class UserRepository {
  async findByEmail(email: string) {
    const user = await  User.findOne({ email, isSocial:false }).populate({path:'followers'}).populate({path:'following'})
    return user
  }

  async createUser(user: IUser): Promise<IUser> {
    return User.create(user);
  }

  async followUser(userid:string, toFollowId:string){
    const user = await User.findOneAndUpdate({user_id:toFollowId}, { $addToSet: { followers: userid } },{new:true});
    await User.findByIdAndUpdate(userid, {$addToSet:{following:user?._id}})
    return user
  }

  async findById(id:string){
    return User.findOne({user_id:id},{password:0}).populate({path:'followers'}).populate({path:'following'}).populate({path:'chat'})
    
  }

  async addChat(user1:string, user2:string){
  
    await User.findByIdAndUpdate(user1, {$addToSet:{chat:user2}})
    return User.findByIdAndUpdate(user2, {$addToSet:{chat:user1}})
  }


  async blockUser(owner:string, user:string){
    return User.findOneAndUpdate({user_id:owner},{$addToSet:{blocked:user}})
  }

  async unBlockUser(owner:string, user:string){
    return User.findOneAndUpdate({user_id:owner},{$pull:{blocked:user}})
  }

  async getUsers():Promise<any>{
    return User.find({},{password:0})
  }

  async isFollow(userId:string,id:any){
   return User.findOne({_id:userId, following: { $in: [id] }})
  }

  async unFollow(userid:string, toFollowId:string){
    const user = await User.findOneAndUpdate({user_id:toFollowId}, { $pull: { followers: userid } },{new:true});
    await User.findByIdAndUpdate(userid, {$pull:{following:user?._id}})
    return user
  }

  async updateUser(id:string,data:any){
    return User.findByIdAndUpdate(id, { $set:data },{new:true});

  }

  async googlUser(id:string,data:any){
    return User.findOneAndUpdate({user_id:id},{$set:data},{upsert:true})
  }


  async changeAccess(id:string){
    const user = await User.findOne({user_id:id})
    if(user){
      user.access=!user.access
      user.save()
      return user
    }else{
      return null
    }
  }

  async findUser(id:string){
    return User.findById(id)
  }

  async forgotPassword(email:string, password:string){
    return User.findOneAndDelete({email:email},{$set:{password:password}})
  }

}
                                           
export default new UserRepository();
