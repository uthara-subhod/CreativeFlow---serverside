import Token from "../models/Token";

class TokenRepository{
    async createToken(token){
        return Token.create(token)
    }

    async verifyUser(token){
        const refresh:any = await Token.findOne({token:token}).populate({path:'user'})
        const current = new Date();
        if(refresh){
            if(refresh.expires<current){
                await Token.findOneAndDelete({token:token})
                return null
            }else{
                return refresh
            }
        }else{
            return null
        }
    }

    async invalidate(token){
        Token.findOneAndDelete({token:token})
    }
      
}

export default new TokenRepository()