import Razorpay from "razorpay";
import ServiceRepository from "../../repositories/ServiceRepository";
import TransactionRepository from "../../repositories/TransactionRepository";

const razorpayInstance = new Razorpay({
    key_id: "rzp_test_lBhHdo9vOqWbPn",
    key_secret: "Y8eVWHfxOhAD2X6lau3YXtBj"
});

export const registerProvider = async (req, res) => {
    try {
        const user = req.user._id
        const data: any = req.body
        data.user = user
        const provider = await ServiceRepository.createProvider(data)
        if (provider) {
            res.status(200).json({ msg: "Registered successfully" })
        } else {
            res.statsu(400).json({ msg: "some error" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const providers = async (req, res) => {
    try {
        const providers = await ServiceRepository.getProviders()
        res.status(200).json({ providers: providers })
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const provider = async (req, res) => {
    try {
        const id = req.params.id
        const provider = await ServiceRepository.findProvider(id)
        if (provider) {
            res.status(200).json({ provider: provider })
        } else {
            res.status(404).json({ msg: "provider not found!" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const vendorRequests = async (req, res) => {
    try {
        const user = req.user._id
        const requests = await ServiceRepository.vendorRequests(user)
        res.status(200).json({ data: requests })
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const clientRequests = async (req, res) => {
    try {
        const user = req.user._id
        const requests = await ServiceRepository.clientRequests(user)
        res.status(200).json({ data: requests })
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const createRequest = async (req, res) => {
    try {
        const data:any = req.body
        data.customer = req.user._id
        const request = await ServiceRepository.createRequest(data)
        if (request) {
            res.status(200).json({ msg: "Your request has been send" })
        } else {
            res.statsu(400).json({ msg: "Error" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const getRequest = async (req,res)=>{
    try{
        const commission = req.params.commission_id
        const user = req.user._id
        const request = await ServiceRepository.findCommission(commission,user)
        if (request) {
            res.status(200).json({ commission:request })
        } else {
            res.status(404).json({ msg:"Commission does not exist" })
        }
    }catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const requestStatus = async (req, res) => {
    try {
        const commission = req.params.commission_id
        const { status } = req.body
        const request = await ServiceRepository.vendorStatus(status, commission)
        if (request) {
            res.status(200).json({ msg: "Edited" })
        } else {
            res.statsu(400).json({ msg: "Error" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const editRequest = async (req, res) => {
    try {
        const commission = req.params.commission_id
        const data = req.body
        const request = await ServiceRepository.editRequest(commission, data)
        if (request) {
            res.status(200).json({ msg: "Edited" })
        } else {
            res.statsu(400).json({ msg: "Error" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const clientAgree = async (req, res) => {
    try {
        const commission = req.params.commission_id
        const request: any = await ServiceRepository.clientAgree(commission)
        const options = {
            amount: request.amount * 100,
            currency: "INR",
            receipt: request._id,
            payment_capture: 1,
        };

        razorpayInstance.orders.create(options, async (err, razorpayOrder) => {
            if (!err) {
                const createPayment = await ServiceRepository.createPaymentLink(commission, razorpayOrder.id)
                if (createPayment) {
                    res.json({
                        status: true,
                        id: request.commission_id,
                        order_id: razorpayOrder.id,
                        amount: request.amount,
                        key_id: "rzp_test_lBhHdo9vOqWbPn",
                        msg: "Order Created",
                    });
                } else {
                    res.status(500).json({ status: false });
                }
            } else {
                res.status(500).json({ status: false });
            }
        });
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const payRequest = async (req,res)=>{
    try {
        const commission = req.params.commission_id
        const {paymentId}=req.body
        const request: any = await ServiceRepository.payRequest(commission,paymentId)
        if(request){
            const data = {
                buyer:request.customer._id,
                seller:request.vendor.user_id,
                paymentId:paymentId,
                amount:request.amount,
                detail:"Service"
            }
            const tr = await TransactionRepository.create(data)
            if(tr){
              res.status(200).json({ msg: "Payment successful!" })
            } else {
                res.statsu(500).json({ msg: "Error" })
            }
        }else{
          res.statsu(500).json({ msg: "Error" })
        }
        
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const hasPaid = async (req, res) => {
    try {
        const userId = req.user._id
        const hasPaid = await ServiceRepository.hasPaid(userId)
        if (hasPaid) {
            res.json({ commission: hasPaid.commission_id })
        } else {
            res.json({ status: true })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}
