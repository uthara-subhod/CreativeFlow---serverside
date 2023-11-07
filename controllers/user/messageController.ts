import { userSockets } from '../../app';
import User from '../../models/User';
import NotificationRepository from '../../repositories/NotificationRepository';
import UserRepository from '../../repositories/UserRepository';

export const loadMessages = async (req,res)=>{
    try{
        
        const user1 = req.params.user1
        const user2 = req.params.user2
        const messages = await NotificationRepository.loadMessages(user1,user2)
        res.status(200).json({messages:messages})
    }catch(err:any){
        console.log(err.message)
        res.status(500).json({error:err})
    }
}

export const addMessage = async (req,res)=>{
    try{
        const user1 = req.params.user1
        const user2 = req.params.user2
        const {message}= req.body
        const us2 :any = await UserRepository.addChat(user1,user2)
        const chat = await NotificationRepository.addMessage({from:user1, to:user2, message:message, createdAt:Date.now()})
        const messages = await NotificationRepository.loadMessages(user1,user2)
        if(chat){
            const userSocket = userSockets[us2?.user_id];
            if (userSocket) {
                console.log("exist")
                userSocket.emit('message', {msg:`new message from ${user1}`});
            }

            res.status(200).json({chat,messages:messages})
        }else{
            res.status(500).json({error:"error"})
        }
    }catch(err:any){
        res.status(500).json({error:err})
    }
}

export const chatList = async (req,res)=>{
    try{
        const userId= req.user.user_id
        const user:any = await UserRepository.findById(userId)
        const list:any = JSON.parse(JSON.stringify(user.chat));
        for(let user of list){
            const message = await NotificationRepository.getLatestMessage(req.user._id,user._id)
            if(message){
                user['msg'] = message
            }
        }
        res.status(200).json({list:list})
    }catch(err:any){
        res.status(500).json({error:err})
    }
}