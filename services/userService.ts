import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository';
import { IUser } from '../models/User';

class UserService {
  async register(fullname:string, email: string, password: string , banner:string): Promise<any> {
    // Check if the email already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    if(fullname==''||!fullname){
      fullname= email.split('@')[0]
    }
    // Create a new user
    const newUser = await UserRepository.createUser({
      fullname:fullname,
      email,
      banner:banner,
      password: hashedPassword,
    });

    const token = this.generateToken(newUser, 1)

    return {token:token, user:newUser};
  }

  async userLogin(email: string, password: string, expires): Promise<any> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const passwordMatch = await bcrypt.compare(password, user.password as string);

    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    const username= user.fullname!=''? user.fullname:email.split('@')[0];
    if(user.plan=='paid'){

      const premium = new Date(user.premium as Date)
      const currentDate = new Date();
      if(premium<currentDate){
        await UserRepository.updateUser(user._id as string,{plan:'free'})
      }
    }

    const token= this.generateToken(user,expires);
    return {token:token, user:user};
  }

  async googleAuth (id:string,data:any){
    const user = await UserRepository.googlUser(id,data)
    if (!user) {
      throw new Error('User not found');
    }
    if(user.plan=='paid'){

      const premium = new Date(user.premium as Date)
      const currentDate = new Date();
      if(premium<currentDate){
        await UserRepository.updateUser(user._id as string,{plan:'free'})
      }
    }
    const token= this.generateToken(user,1);
    return {token:token, user:user};
    
  }

  private generateToken(user: IUser, expires): string {
    return jwt.sign({ user:user, access:user.access}, process.env.USER_SECRET as string, { expiresIn: `${expires}d` });
  }  

  async isFollow(userId:string,id:string){
    const follow = await UserRepository.findById(id)
    const user=await UserRepository.isFollow(userId,follow?._id)
    if(user){
      return true
    }else{
      return false
    }
  }

  

  
}

export default new UserService();
