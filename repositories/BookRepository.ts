import Book from "../models/Book";
import Booklist from "../models/Booklist";
import chapter from "../models/Chapter";
import Genre from "../models/Genre";
import UserRepository from "./UserRepository";

class BookRepository {
    async createBook(data: any) {
        return Book.create(data);
    }

    async createChapter(id: any) {
        return chapter.create({ book: id });
    }

    async checkLimit(user:string,date:any){
        return Book.findOne({author:user,publishedAt:{ $gte: date}})
    }

    async getBook(id: string) {
        return Book.findOne({ book_id: id }).populate({ path: 'chapters' }).populate({ path: 'author' }).populate({ path: 'category' })
    }

    async getBooks() {
        return Book.find({ published: true }).populate({ path: 'author' })
    }

    async getChapters(id) {
        return chapter.find({ book: id, published: true })
    }

    async getChapter(id: string) {
        const ch = await chapter.findOne({ chapter_id: id }).populate({ path: 'book' })
        const book = await Book.findOne({book_id:ch?.book.book_id,premium:false})
        if(book){
            return ch
        }else{
            return null
        }
    }

    async authorBooks(author: string) {
        return Book.find({ author: author })
    }

    async authorPBooks(author: string) {
        const user = await UserRepository.findById(author)
        return Book.find({ author: user?._id, published: true }).populate({ path: 'author' })
    }

    async updateDetails(data: any, id: string) {
        const oldBook = await Book.findOne({ book_id: id });
        if (data.category) {
            const updatePromises = [
                Genre.findByIdAndUpdate(oldBook?.category, { $pull: { items: oldBook?._id } }),
                Genre.findByIdAndUpdate(data.category, { $addToSet: { items: oldBook?._id } }),
            ];
            await Promise.all(updatePromises);
        }

        return Book.findOneAndUpdate({ book_id: id }, { $set: data }, { new: true })
    }

    async addChapter(ch: any, id: string) {
        return Book.findByIdAndUpdate(id, { $push: { chapters: ch } })
    }

    async editChapter(id: string, data: any) {
        return chapter.findOneAndUpdate({ chapter_id: id }, { $set: data }, { new: true })
    }

    async publishChapter(id: string, data: any) {
        if (data.book.published == false) {
            await Book.findByIdAndUpdate(data.book._id, { $set: { published: true, publishedAt: new Date(), updatedAt: new Date() } }, { new: true })
        } else {
            await Book.findByIdAndUpdate(data.book._id, { $set: { updatedAt: new Date() } }, { new: true })
        }
        return chapter.findOneAndUpdate({ chapter_id: id }, { $set: data }, { new: true })
    }

    async unPublishChapter(id: string, book: any) {
        if (book.chapters.length == 1) {
            await Book.findByIdAndUpdate(book._id, { $set: { published: false, publishedAt: new Date() } }, { new: true })
        }
        return chapter.findOneAndUpdate({ chapter_id: id }, { $set: { published: false, publishedAt: new Date() } }, { new: true })
    }

    async unChapter(id: string) {
        const ch: any = await chapter.findByIdAndUpdate(id, { $set: { published: false, publishedAt: new Date() } }, { new: true }).populate({ path: 'book' })
        if (ch.book.chapters.length == 1) {
            await Book.findByIdAndUpdate(ch.book._id, { $set: { published: false, publishedAt: new Date() } }, { new: true })
        }
        return ch

    }

    async deleteChapter(ch: any, id: string) {
        await chapter.findByIdAndDelete(ch)
        return Book.findOneAndUpdate({ book_id: id }, { $pull: { chapters: ch } }, { $new: true })
    }

    async unpublishBook(id: any, _id: any) {
        const book = await Book.findOneAndUpdate({ book_id: id }, { $set: { published: false } }, { new: true })
        await chapter.updateMany({ book: _id }, { $set: { published: false } })
        return book
    }

    async publishBook(id: any, _id: any) {
        const book = await Book.findOneAndUpdate({ book_id: id }, { $set: { published: true } }, { new: true })
        await chapter.updateMany({ book: _id }, { $set: { published: true } })
        return book
    }

    async deleteBook(id: string) {
        await chapter.deleteMany({ book: id })
        return Book.findByIdAndDelete(id)
    }

    async vote(chapter_id: string, user: string) {
        return chapter.findOneAndUpdate({ chapter_id: chapter_id }, { $addToSet: { votes: user } }, { new: true }).populate({ path: 'book' })
    }

    async removeVote(chapter_id: string, user: string) {
        return chapter.findOneAndUpdate({ chapter_id: chapter_id }, { $pull: { votes: user } }, { new: true }).populate({ path: 'book' })
    }

    async newLibrary(user: string) {
        return Booklist.create({ owner: user, access: 'private', name: 'library' })
    }

    async addBookToLibrary(book: string, list_id: string) {
        return Booklist.findOneAndUpdate({ list_id: list_id }, { $push: { books: book } })
    }

    async removeBookToLibrary(book: string, list_id: string) {
        return Booklist.findOneAndUpdate({ list_id: list_id }, { $pull: { books: book } })
    }

    async removeList(list_id: string) {
        return Booklist.findOneAndDelete({ list_id: list_id, access: 'public' })
    }

    async addWarning(actionType: 'book' | 'chapter', id: string) {
        let book_id = ''
        if (actionType == 'chapter') {
            const ch = await chapter.findById(id).populate({ path: 'book' })
            book_id = ch?.book._id

        } else {
            book_id = id
        }
        let book = await Book.findByIdAndUpdate(book_id, { $inc: { warning: 1 } }, { new: true });
        if (book?.warning > 3) {
            book = await Book.findByIdAndUpdate(book_id, { deleted: true }, { new: true });
        }
        return book
    }

    async removeWarning(book_id: string) {
        let book = await Book.findByIdAndUpdate(book_id, { $inc: { warning: -1 } }, { new: true });

        if (book?.warning <= 3) {
            book = await Book.findByIdAndUpdate(book_id, { deleted: false }, { new: true });
        }
        return book
    }

    async findWarning(book_id: string) {
        return Book.find({ book_id: book_id }, { warning: 1 })
    }

    async getGenreBooks() {
        return Genre.aggregate([{ $unwind: { path: "$items" } }, { $lookup: { from: "books", localField: "items", foreignField: "_id", as: "books" } }, { $match: { "books.published": true } }, { $group: { _id: "$_id", cat_id: { $first: "$cat_id" }, name: { $first: "$name" }, cover: { $first: "$cover" }, items: { $push: "$items" } } }, { $project: { _id: 0, cat_id: 1, name: 1, cover: 1, items: 1 } }, { $lookup: { from: "books", localField: "items", foreignField: "_id", as: "item" } }])

    }

    async addPaidList (book:string, user:string){
        return Booklist.findOneAndUpdate({owner:user, access:"paid"}, {$push:{books:book}}, {upsert:true})
    }


}

export default new BookRepository()