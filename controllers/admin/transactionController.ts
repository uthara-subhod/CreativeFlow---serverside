import TransactionRepository from "../../repositories/TransactionRepository";
import UserRepository from "../../repositories/UserRepository";


export const transactions = async (req, res) => {
    try {
        const trs : any = await TransactionRepository.getTrasactions()
        for(let i=0;i<trs.length;i++){
            if(trs[i].seller!="CreativeFlow"){
                const seller = await UserRepository.findById(trs[i].seller)
                trs[i].detail = trs[i].detail.split(',')[0]
                trs[i].seller = seller?.fullname
            }
        }
        if (trs) {
            res.status(200).json({ data: trs })
        } else {
            res.status(500).json({ msg: "Error fetching data" })
        }

    } catch (err) {
        res.status(500).json({ msg: "Error fetching data" })
    }
}

export const pay = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const tr = await TransactionRepository.pay(id)
        if (tr) {
            res.status(200).json({ data: tr })
        } else {
            res.status(500).json({ msg: "Error fetching data" })
        }

    } catch (err:any) {
        console.log(err.message)
        res.status(500).json({ msg: "Error fetching data" })
    }
}


export const seller = async (req,res)=>{
    try {
        const id = req.params.id
        const seller = await UserRepository.findUser(id)
        if(seller){
            res.status(200).json({seller:seller})
        }else{
            res.status(404).json({msg:"Error fetching"})
        }
    } catch (err:any) {
       
      res.status(500).json({msg:err.message})
    }
  }
  