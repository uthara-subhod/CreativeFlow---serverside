import Transaction from '../models/Transaction';

class TransactionRepostory {
    async create(data){
        return Transaction.create(data);
    }

    async getTrasactions(){
        return Transaction.find().sort({createdAt:-1}).populate({path:"buyer"})
    }

    async getUser(buyer:any){
        return Transaction.find({buyer:buyer})
    }

    async getSeller(seller:any){
        return Transaction.find({seller:seller}).sort({createdAt:-1}).populate({path:"buyer"})
    }

    async getBuyer(buyer:string){
        return Transaction.find({buyer:buyer}).sort({createdAt:-1}).populate({path:"buyer"})
    }

    async checkBought(item_id:string, user:string){
        return Transaction.findOne({buyer:user, detail:{$regex:item_id}})
    }

    async pay(id:string){
        return Transaction.findOneAndUpdate({transaction_id:id},{$set:{paid:true, status:"paid"}})
    }
    async confirm(id:string){
        return Transaction.findOneAndUpdate({transaction_id:id},{$set:{status:"completed"}})
    }
    async reject(id:string){
        return Transaction.findOneAndUpdate({transaction_id:id},{$set:{paid:false, status:"error"}})
    }

    async subscription(user:string){
        return Transaction.find({buyer:user, seller:"CreativeFlow"}).sort({createdAt:-1}).limit(1)
    }

}

export default new TransactionRepostory()