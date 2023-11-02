import ArtField from "../models/ArtField";
import Genre from "../models/Genre";

class CategoryRepository{
    async addGenre(data:any){
        return Genre.create(data)
    }
    async addBook(name:string, book:string){
        return Genre.findOneAndUpdate({name:name},{$push:{items:book}}, {new:true})
    }
    async findGenreByName(name:string){
        return Genre.findOne({name: { $regex: new RegExp(`^${name}$`, "i") }})
    }
    async findGenreById(id:string){
        return Genre.findOne({cat_id:id})
    }
    async genres(){
        return Genre.find()
    }
    async updateGenre(id:string, name:string, cover:string){
        return Genre.findOneAndUpdate({cat_id:id},{$set:{name:name, cover:cover}}, {new:true})
    }
    async deleteGenre(id:string){
        return Genre.findOneAndDelete({cat_id:id})
    }
    async  addArtField(data:any){
        return ArtField.create(data)
    }
    async addArt(name:string, book:string){
        return ArtField.findOneAndUpdate({name:name},{$push:{book:book}}, {new:true})
    }
    async findArtFieldByName(name:string){
        return ArtField.findOne({name: { $regex: new RegExp(`^${name}$`, "i") }})
    }
    async findArtFieldById(id:string){
        return ArtField.findOne({cat_id:id})
    }
    async artfields(){
        return ArtField.find()
    }
    async updateArtField(id:string, name:string, cover:string){
        return ArtField.findOneAndUpdate({cat_id:id},{$set:{name:name, cover:cover}}, {new:true})
    }
    async deleteArtField(id:string){
        return ArtField.findOneAndDelete({cat_id:id})
    }


}

export default new CategoryRepository()