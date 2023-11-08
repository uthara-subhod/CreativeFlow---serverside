import ArtworkRepository from "../../repositories/ArtworkRepository";
import UserRepository from "../../repositories/UserRepository";
import notificationService from "../../services/notificationService";


export const artistArtWorks = async (req,res)=>{
    try {
        const id = req.user._id
        const artworks = await ArtworkRepository.artistArtWorks(id)
        if (artworks) {
            res.status(200).json({ artworks: artworks })
        } else {
            res.status(404).json({ msg: "Error getting Artworks" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const artistPartworks= async (req,res)=>{
    try {
        const id = req.params.id
        const artworks = await ArtworkRepository.artistPArtWorks(id)
        if (artworks) {
            res.status(200).json({ artworks: artworks })
        } else {
            res.status(404).json({ msg: "Error getting Artworks" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const getArtworks = async(req,res)=>{
    try {

        const artworks = await ArtworkRepository.getArtWorks()
        if (artworks) {
            res.status(200).json({ artworks: artworks })
        } else {
            res.status(404).json({ msg: "Error getting Artworks" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}   

export const Artwork = async (req, res) => {
    try {
        const id = req.params.artwork_id
        const artwork = await ArtworkRepository.getArtWork(id)
        if (artwork) {
            res.status(200).json({ artwork: artwork })
        } else {
            res.status(404).json({ msg: "Error getting Artwork" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }

}

export const createArtwork = async (req, res) => {
    try {
        const user:any = await UserRepository.findById(req.user.user_id)
        const data = {artist:req.user._id,title:"Untitled"}
        if(user.plan=="free"){
            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
            const exist = await ArtworkRepository.checkLimit(req.user._id,twentyFourHoursAgo)
            if(exist.length>=5){
                res.status(401).json({ msg: "You have reached the maximum limit today!" })
                return
            }
        }
        const artwork = await ArtworkRepository.createArtWork(data)
        if (artwork) {
            
            res.status(200).json({ artwork: artwork })
        } else {
            res.status(400).json({ msg: "Error creating Artwork" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const saveArtwork = async (req,res)=>{
    try {
        const { _id, artwork_id, ...data } = req.body;
        const artwork = await ArtworkRepository.updateDetails(data,artwork_id)
        if (artwork) {
            res.status(200).json({ artwork: artwork })
        } else {
            res.status(404).json({ msg: "Error getting Artwork" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const publishArtwork = async (req,res)=>{
    try {
        const {_id, artwork_id} = req.body;
        const artwork = await ArtworkRepository.publishArtWork(artwork_id, _id)
        if (artwork) {
            const author = await UserRepository.findByEmail(req.user.email)
            const notif = await notificationService.artwork(artwork,author)
            res.status(200).json({ artwork: artwork })
        } else {
            res.status(404).json({ msg: "Error getting Artwork" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const unpublishArtwork = async (req,res)=>{
    try {
        const {_id} = req.body;
        const artwork = await ArtworkRepository.unpublishArtWork(_id)
        if (artwork) {
            res.status(200).json({ artwork: artwork })
        } else { 
            res.status(404).json({ msg: "Error getting Artwork" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const deleteArtwork = async (req,res)=>{
    try {
        const {_id} = req.body;
        const artwork = await ArtworkRepository.deleteArtWork(_id)
        if (artwork) {
            res.status(200).json({ artwork: artwork })
        } else {
            res.status(404).json({ msg: "Error getting Artwork" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}


export const vote = async (req,res)=>{
    try {
        const id = req.params.artwork_id
        const userId:any = req.user._id
        const {isVote} = req.body
        if(isVote){
            var vote:any = await ArtworkRepository.vote(id,userId)
            if(userId!==vote.artist._id){
                await notificationService.vote(userId,vote.artist,vote)
            }
        }else{
            var vote:any = await ArtworkRepository.removeVote(id,userId)
        }
        if (vote) {
            console.log(vote)
            res.status(200).json({ artwork:vote })
        } else {
            console.log("oopss")
            res.status(404).json({ msg: "Error getting Artwork" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}


