import Notification from '../models/Notification';
import Message from '../models/Messages';

class NotificationRepositary{
    async pushNotification(data){
        return Notification.create(data)
    }
    async clearAll(id:any){
        return Notification.updateMany({owner:id},{$set:{deleted:true}})
    }
    async getNotifications(userID:string){
        return Notification.find({owner:userID, deleted:false}).sort({createdAt:-1}).populate({path:'from'})
    }
    async markRead(id){
        await Notification.findOneAndUpdate({notification_id:id},{$set:{read:true}})
    }
    async markAllRead(id){
        await Notification.findOneAndUpdate({owner:id},{$set:{read:true}})
    }
    async addMessage(data){
        return Message.create(data)
    }
    async loadMessages(user1:string, user2:string){
        return Message.find({ $and: [{ from: { $in: [user1, user2] } },{ to: { $in: [user1, user2] } }]})      
    }
    async getLatestMessage(user1:string, user2:string){
        return Message.find({ $and: [{ from: { $in: [user1, user2] } },{ to: { $in: [user1, user2] } }]}).sort({createdAt:-1}).limit(1)     
    }

    async graph(owner:string, endDate:any, startDate:any, type:string){
        return Notification.aggregate([  
            { $match: {createdAt: { $gte: startDate,$lt: endDate}, types:type}},
            { $group: {_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }},   count: { $sum: 1 } }},
            { $sort: { _id: 1 }}
          ]);
    }
}

export default new NotificationRepositary()