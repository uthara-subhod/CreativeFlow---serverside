const jwttoken = require('jsonwebtoken')
import UserRepository from "../repositories/UserRepository";


export const verifyUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')

        const secret = process.env.USER_SECRET;
        if (token) {
            const decoded = jwttoken.verify(token,secret)
            const user = await UserRepository.findById(decoded.user.user_id)
            if(user?.access){
                req.user = user
                next()
            }else{
                res.status(401).json({ error: 'Unauthorized' });
            }
        } else {
            res.status(401).json({ error: 'Unauthorized' }); 
        }
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

export const verifyAdmin = async (req,res,next)=>{
    try {
        const token = req.header('Authorization')
        const secret = process.env.ADMIN_SECRET as string;
        if(req.url!='/login'){

            if (token) {
                const decoded = jwttoken.verify(token,secret)
                req.admin = decoded.admin
    
    
                    next()
               
            } else {
                res.status(401).json({ error: 'Unauthorized' }); 
            }
        }else{
            next()
        }
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

export const verifyModerator = async (req,res,next)=>{
    try {
        const token = req.header('Authorization')
        const secret = process.env.MOD_SECRET as string;
        const asecret = process.env.ADMIN_SECRET as string;
        if(req.url!='/login'){

            if (token) {
                const decoded = jwttoken.verify(token,secret)
                req.mod = decoded.mod
    
    
                    next()
               
            } else {
                res.status(401).json({ error: 'Unauthorized' }); 
            }
        }else{
            next()
        }
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
}


