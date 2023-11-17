import Razorpay from "razorpay";
import TransactionRepository from "../../repositories/TransactionRepository"
import UserRepository from "../../repositories/UserRepository";

const razorpayInstance = new Razorpay({
    key_id: "rzp_test_lBhHdo9vOqWbPn",
    key_secret: "Y8eVWHfxOhAD2X6lau3YXtBj"
});

export const create = async (req,res)=>{
    try{
        const {paymentID, amount, detail} =req.body
        const buyer = req.user._id
        let seller:any
        if(req.body.seller){
            seller= req.body.seller
        }else{
            seller =  "CreativeFlow"
            const date = new Date()
            date.setFullYear(date.getFullYear() + 1)
            await UserRepository.updateUser(buyer,{plan:'paid', premium:date})
        }
        const data = {
            buyer,
            seller,
            paymentID,
            amount,
            detail
        }
        const tr = await TransactionRepository.create(data)
        if(tr){
            res.status(200).json({tr:tr.transaction_id, success:true})
        }else{
            res.status(500).json({msg:"Error"})
        }
    }catch(err:any){
        res.status(500).json({msg:err.message})
    }
}

export const pay = async (req,res)=>{
    try {
        const item = req.body
        if (item) {
          const options = {
            amount: item.price * 100,
            currency: "INR",
            receipt: item._id, 
            payment_capture: 1, 
          };
    
          razorpayInstance.orders.create(options, async (err, razorpayOrder) => {
            if (!err) {
              res.json({
                status: true,
                id: item.item_id,
                order_id: razorpayOrder.id,
                amount: item.price,
                key_id: "rzp_test_lBhHdo9vOqWbPn",
                msg: "Order Created",
              });
            } else {
              res.status(500).json({ err:err});
            }
          });
        }
      } catch (err:any) {
        res.status(500).json({msg:err.message})
      }
   
}

export const sellerTransactions = async (req,res)=>{
  try{
    const userId= req.user.user_id
    const trs : any = await TransactionRepository.getSeller(userId)
      res.status(200).json({ data: trs })

  }catch(err:any){
    res.status(500).json({msg:err.message})
  }
}

export const buyerTransactions = async (req,res)=>{
  try{
    console.log('sjsjsjsj')
    const userId= req.user._id
    console.log(userId)
    const trs : any = await TransactionRepository.getBuyer(userId)
    console.log(trs)
    for(let i=0;i<trs.length;i++){
      if(trs[i].seller!="CreativeFlow"){
          const seller = await UserRepository.findById(trs[i].seller)
          trs[i].detail = trs[i].detail.split(',')[0]
          trs[i].seller = seller?.fullname
      }
  }
      res.status(200).json({ data: trs })

  }catch(err:any){
    res.status(500).json({msg:err.message})
  }
}

export const status = async (req,res)=>{
  try{
    const id = req.params.id
    const {status}= req.body
    let tr:any
    if(status=='confirm'){
      tr = await TransactionRepository.confirm(id)
    }else{
      tr = await TransactionRepository.reject(id)
    }
    if(tr){
      res.status(200).json({ status: true });
    }else{
      res.status(500).json({ status: false });
    }
  }catch(err:any){
    res.status(500).json({msg:err.message})
  }
}

