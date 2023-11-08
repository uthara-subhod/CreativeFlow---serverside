import Collection from "../models/Collection";
import ArtField from "../models/ArtField";
import Artwork from "../models/Artwork";
import UserRepository from "./UserRepository";


class ArtWorkRepository{
    async createArtWork(data:any){
        return Artwork.create(data);
    }

    async getArtWork(id:string){
        return Artwork.findOne({artwork_id:id}).populate({path:'artist'}).populate({path:'category'})
    }

    async checkLimit(user:string,date:any){
        return Artwork.find({artist:user,publishedAt:{ $gte: date}})
    }

    async getArtWorks(){
        return Artwork.find({published:true}).populate({path:'artist'})
    }

    async artistArtWorks(artist:string){
        return Artwork.find({artist:artist})
    }

    async artistPArtWorks(artist:string){
        const user = await UserRepository.findById(artist)
        return Artwork.find({artist:user?._id, published:true}).populate({path:'artist'})
    }

    async updateDetails(data:any, id:string){
        const oldArtwork = await Artwork.findOne({artwork_id:id});
        if(data.category){
            const updatePromises = [
                ArtField.findByIdAndUpdate(oldArtwork?.category, { $pull: { items: oldArtwork?._id } }),
                ArtField.findByIdAndUpdate(data.category, { $addToSet: { items: oldArtwork?._id } }),
            ];
            await Promise.all(updatePromises);
        }
        
        return  Artwork.findOneAndUpdate({artwork_id:id},{$set:data}, {new:true})
    }

    async unpublishArtWork( _id:any){
        return  Artwork.findByIdAndUpdate(_id,{$set:{published:false}}, {new:true})
    }

    async publishArtWork(id:any, _id:any){
        return  Artwork.findOneAndUpdate({artwork_id:id},{$set:{published:true}}, {new:true})

    }

    async deleteArtWork(id:string){
        return Artwork.findByIdAndDelete(id)
    }

    async vote(artwork_id:string, user:string){
        return Artwork.findOneAndUpdate({artwork_id:artwork_id},{$addToSet:{votes:user}},{new:true}).populate({path:'artist'}).populate({path:'category'})
    }

    async removeVote(artwork_id:string, user:string){
        return Artwork.findOneAndUpdate({artwork_id:artwork_id},{$pull:{votes:user}},{new:true}).populate({path:'artist'}).populate({path:'category'})
    }

    async newFavorites(user:string){
        return Collection.create({owner:user, access:'public', name:'favorites'})
    }

    async addList(collection:any){
        return Collection.create(collection)
    }

    async addArtToList(artwork:string, collection_id:string){
        return Collection.findOneAndUpdate({collection_id:collection_id},{$push:{artworks:artwork}})
    }

    async removeArtToList(artwork:string, collection_id:string){
        return Collection.findOneAndUpdate({collection_id:collection_id},{$pull:{artworks:artwork}})
    }


    async removeList(collection_id:string){
        return Collection.findOneAndDelete({collection_id:collection_id})
    }

    async addWarning(artwork_id:string){
        let artwork = await Artwork.findByIdAndUpdate(artwork_id, { $inc: { warning: 1 } }, { new: true });

        if (artwork?.warning > 3) {
            artwork =await Artwork.findByIdAndUpdate(artwork_id, { deleted: true }, { new: true });
        }
        return artwork
    }

    async removeWarning(artwork_id:string){
        let artwork = await Artwork.findByIdAndUpdate(artwork_id, { $inc: { warning: -1 } }, { new: true });

        if (artwork?.warning <= 3) {
            artwork =await Artwork.findByIdAndUpdate(artwork_id, { deleted: false }, { new: true });
        }
        return artwork
    }

    async findWarning(artwork_id:string){
        return Artwork.find({artwork_id:artwork_id},{warning:1})
    }

}

export default new ArtWorkRepository()