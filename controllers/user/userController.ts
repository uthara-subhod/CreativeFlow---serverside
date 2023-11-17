import ArtworkRepository from "../../repositories/ArtworkRepository";
import BookRepository from "../../repositories/BookRepository";
import NotificationRepository from "../../repositories/NotificationRepository";
import ReportRepository from "../../repositories/ReportRepository";
import ServiceRepository from "../../repositories/ServiceRepository";
import TransactionRepository from "../../repositories/TransactionRepository";
import UserRepository from "../../repositories/UserRepository";
import notificationService from "../../services/notificationService";
import userService from "../../services/userService";
const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
    key_id: "rzp_test_lBhHdo9vOqWbPn",
    key_secret: "Y8eVWHfxOhAD2X6lau3YXtBj",
});

export const follow = async (req, res) => {

    try {
        const follower = req.user;
        const userIdToFollow = req.params.id;
        const data = await notificationService.follow(follower, userIdToFollow)
        res.status(200).json({ user: data.user, msg: data.msg });
    } catch (error) {
        res.status(500).json({ msg: 'Error following user' });
    }
}

export const unFollow = async (req, res) => {

    try {
        console.log(req.user)
        const follower = req.user._id;
        const userIdToFollow = req.params.id;
        const user = await UserRepository.unFollow(follower, userIdToFollow)
        res.status(200).json({ user: user, msg: "Unfollowed" });
    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }


}

export const isFollow = async (req, res) => {
    try {
        const userId = req.user._id
        const id = req.params.id
        const status = await userService.isFollow(userId, id)
        res.status(200).json({ status })
    } catch (err: any) {
        res.status(500).json({ msg: 'Error' });
    }
}

export const getProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserRepository.findById(id);
        if (user) {
            res.status(200).json({ user: user })
        } else {
            res.status(404).json({ msg: "user not found" })
        }



    } catch (error) {
        res.status(404).send('Error');
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await UserRepository.getUsers()
        if (users) {
            res.status(200).json({ users: users })
        } else {
            res.status(404).json({ msg: "users not found" })
        }



    } catch (error) {
        res.status(404).send('Error');
    }
}

export const user = async (req, res) => {
    try {
        const user = req.user

        if (user) {
            res.json({ user: user })
        } else {
            res.status(401).json({ error: "Authorization error" })
        }
    } catch (err) {
        res.status(401).json({ error: "Authorization error" })
    }
}

export const notifications = async (req, res) => {
    try {
        const id = req.params.id
        const notifications = await notificationService.getAll(id)
        res.status(200).json({ notifications })
    } catch (err: any) {
        res.status(404).json({ msg: err.message })
    }
}

export const clear = async (req, res) => {
    try {
        const id = req.user._id
        const notifications = await NotificationRepository.clearAll(id)
        res.status(200).json({ msg: 'success' })
    } catch (err: any) {
        res.status(404).json({ msg: err.message })
    }
}

export const edit = async (req, res) => {
    try {
        const { fullname, profile, country, bio, banner } = req.body
        console.log(country)
        const id = req.user._id
        await UserRepository.updateUser(id, { fullname, profile, country, bio, banner })
        res.status(200).json({ msg: "Edited" })

    } catch (err: any) {
        res.status(404).json({ msg: err.message })
    }
}

export const plan = async (req, res) => {
    try {
        const { plan } = req.body
        let user: any
        if (plan == 'free') {
            user = await UserRepository.updateUser(req.user._id, { plan: plan })
        } else {
            const date = new Date()
            date.setFullYear(date.getFullYear() + 1)
            user = await UserRepository.updateUser(req.user._id, { plan: plan, premium: date })
        }
        if (user) {

            if (plan == 'free') {
                res.status(200).json({ plan: true })
            } else {
                const options = {
                    plan_id: "plan_MqQL94BnLvq4bb",
                    customer_notify: 1,
                    quantity: 1,
                    total_count: 12,
                }

                razorpayInstance.subscriptions.create({
                    plan_id: "plan_MqQL94BnLvq4bb",
                    customer_notify: 1,
                    quantity: 1,
                    total_count: 12,

                }, async (err, razorpayOrder) => {
                    if (!err) {
                        res.status(200).json({
                            plan: true,
                            id: razorpayOrder.id,
                            subscription: razorpayOrder.plan_id,
                            key_id: "rzp_test_lBhHdo9vOqWbPn",
                        });
                    } else {
                        res.status(500).json({ err: err });
                    }
                })
            }
        } else {
            res.status(500).json({ msg: "Some error" })
        }
    } catch (err: any) {
        res.status(404).json({ msg: err.message })
    }
}

export const roles = async (req, res) => {
    try {
        const { artist, author, pro } = req.body
        const user = await UserRepository.updateUser(req.user._id, { artist, author, pro })
        if (user) {
            res.status(200).json({ msg: 'success!' })
        } else {
            res.status(500).json({ msg: "Some error" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const report = async (req, res) => {
    try {
        const data: any = req.body
        data.reporter = req.user._id
        const exist = await ReportRepository.findReport(data)
        if (exist) {
            res.status(409).json({ msg: "You have already submitted a report on this!" })
            return
        } 
        console.log(data)
            const report = await ReportRepository.create(data)
            if (report) {
                res.status(200).json({ msg: 'success!' })
            } else {
                res.status(500).json({ msg: "Some error" })
            }
        
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const subscription = async (req, res) => {
    try {
        const userId = req.user._id
        const tr: any = await TransactionRepository.subscription(userId)

        if (tr) {
            const payment = await razorpayInstance.payments.fetch(tr[0].paymentID)
            const invoice = await razorpayInstance.invoices.fetch(payment.invoice_id)
            razorpayInstance.subscriptions.cancel(invoice.subscription_id).then(async (sub)=>{
                await UserRepository.updateUser(req.user.user_id,{plan:'free'})
                res.status(200).json({msg:"Subscription cancelled successfully!"})
            }).catch((err:any)=>{
                res.status(400).json({msg:err})
            })
        } else {
            res.status(500).json({ msg: "Some error" })
        }
    } catch (err: any) {
        res.status(404).json({ msg: err.message })
    }
}

export const dashboard = async (req,res)=>{
    try{
        const user = req.user.user_id
        const acc = await UserRepository.findById(user)
        const artworks = await ArtworkRepository.artistPArtWorks(user)
        const books = await BookRepository.authorPBooks(user)
        const labels:any[]=[]
        const datas:any[]=[]
        for(let a of artworks){
            labels.push(a.title)
            datas.push(a.votes.length)
        }
        for(let a of books){
            labels.push(a.title)
            const vote = a.chapters.reduce((accumulator, chapter) => accumulator + chapter.votes.length, 0)
            datas.push(vote)
        }
        res.status(200).json({books:books.length,artworks:artworks.length,labels,datas, user:acc})
        
    }catch(err:any){
        res.status(500).json({ msg: err.message })
    }
}







