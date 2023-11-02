import BookRepository from "../../repositories/BookRepository";
import TransactionRepository from "../../repositories/TransactionRepository";
import UserRepository from "../../repositories/UserRepository";
import notificationService from "../../services/notificationService";
import { user } from "./userController";


export const authorBooks = async (req, res) => {
    try {
        const id = req.user._id
        const books = await BookRepository.authorBooks(id)
        if (books) {
            res.status(200).json({ books: books })
        } else {
            res.status(404).json({ msg: "Error getting books" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const authorPbooks = async (req, res) => {
    try {
        const id = req.params.id
        const books = await BookRepository.authorPBooks(id)
        if (books) {
            res.status(200).json({ books: books })
        } else {
            res.status(404).json({ msg: "Error getting books" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const getBooks = async (req, res) => {
    try {

        const books = await BookRepository.getBooks()
        if (books) {
            res.status(200).json({ books: books })
        } else {
            res.status(404).json({ msg: "Error getting books" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const getBook = async (req,res)=>{
    try {
        const id = req.params.book_id
        const book = await BookRepository.getBook(id)
        if(req.user){

            var userID= req.user?.user_id
            if (book&&book?.author.user_id==userID) {
                res.status(200).json({ book: book })
            } else {
                res.status(404).json({ msg: "Error getting book" })
            }
        }else{
            if (book) {
                res.status(200).json({ book: book })
            } else {
                res.status(404).json({ msg: "Error getting book" })
            }
        }
        
      
        
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const book = async (req, res) => {
    try {
        const id = req.params.book_id
        const book = await BookRepository.getBook(id)
        
            if (book) {
                res.status(200).json({ book: book })
            } else {
                res.status(404).json({ msg: "Error getting book" })
            }
        
        
      
        
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }

}

export const createBook = async (req, res) => {
    try {
        const data = { author: req.user._id, title: "Untitled" }

        const book = await BookRepository.createBook(data)
        if (book) {

            res.status(200).json({ book: book })
        } else {
            res.status(400).json({ msg: "Error creating book" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}
export const save = async (req, res) => {
    try {
        const { _id, book_id, ...data } = req.body;
        const book = await BookRepository.updateDetails(data, book_id)
        if (book) {
            res.status(200).json({ book: book })
        } else {
            res.status(404).json({ msg: "Error getting book" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}
export const publish = async (req, res) => {
    try {
        const { _id, book_id } = req.body;
        const book = await BookRepository.publishBook(book_id, _id)
        if (book) {
            const author = await UserRepository.findByEmail(req.user.email)
            const notif = await notificationService.book(author, book)
            res.status(200).json({ book: book })
        } else {
            res.status(404).json({ msg: "Error getting book" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const unpublish = async (req, res) => {
    try {
        const { _id, book_id } = req.body;
        const book = await BookRepository.unpublishBook(book_id, _id)
        if (book) {
            res.status(200).json({ book: book })
        } else {
            res.status(404).json({ msg: "Error getting book" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const deleteBook = async (req, res) => {
    try {
        const { _id } = req.body;
        const book = await BookRepository.deleteBook(_id)
        if (book) {
            res.status(200).json({ book: book })
        } else {
            res.status(404).json({ msg: "Error getting book" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}


export const chapter = async (req, res) => {
    try {
        const id = req.params.id
        const chapter = await BookRepository.getChapter(id)
        if (chapter) {
            res.status(200).json({ chapter: chapter })
        } else {
            res.status(404).json({ msg: "Error getting book" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }

}
export const addChapter = async (req, res) => {
    try {
        const id = req.params.book_id
        const chapter = await BookRepository.createChapter(id)
        if (chapter) {
            await BookRepository.addChapter(chapter._id, id)
            res.status(200).json({ chapter: chapter })
        } else {
            res.status(400).json({ msg: "Error creating chapter" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const saveChapter = async (req, res) => {
    try {
        const { _id, chapter_id, ...data } = req.body
        data.publishedAt = new Date()
        const chapter = await BookRepository.editChapter(chapter_id, data)
        if (chapter) {
            res.status(200).json({ chapter: chapter })
        } else {
            res.status(400).json({ msg: "Error saving chapter" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const publishChapter = async (req, res) => {
    try {
        const { _id, chapter_id, ...data } = req.body
        data.publishedAt = new Date()
        data.published = true
        const chapter = await BookRepository.publishChapter(chapter_id, data)
        if (chapter) {
            res.status(200).json({ chapter: chapter })
        } else {
            res.status(400).json({ msg: "Error saving chapter" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const unPublishChapter = async (req, res) => {
    try {
        const { _id, chapter_id, book } = req.body
        const chapter = await BookRepository.unPublishChapter(chapter_id, book)
        if (chapter) {
            res.status(200).json({ chapter: chapter })
        } else {
            res.status(400).json({ msg: "Error saving chapter" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const deleteChapter = async (req, res) => {
    try {
        const { _id, chapter_id, book } = req.body
        const chapter = await BookRepository.deleteChapter(_id, book.book_id)
        if (chapter) {
            res.status(200).json({ msg: "Sucess" })
        } else {
            res.status(400).json({ msg: "Error saving chapter" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const voteBook = async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.user._id
        const { isVote } = req.body
        if (isVote) {
            var vote = await BookRepository.vote(id, userId)
            if(userId!=vote?.book.author){
                console.log(userId!=vote?.book.author)

                let notif = await notificationService.vote(userId,vote?.book.author,vote)
            }
        } else {
            var vote = await BookRepository.removeVote(id, userId)
        }
        if (vote) {
            res.status(200).json({ chapter: vote })
        } else {
            res.status(404).json({ msg: "Error getting chapter" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}


export const addToPaidList = async (req, res) => {
    try {
        const id = req.params.book_id
        const userId = req.user._id
        const t = await TransactionRepository.checkBought(id, userId)

        if (t) {
            const book: any = await BookRepository.getBook(id)
            const list = await BookRepository.addPaidList(book._id, userId)
            if (list) {
                res.status(200).json({ msg: "Book successfully purchased" })
            } else {
                res.status(404).json({ msg: "Error buying book" })
            }

        } else {
            res.status(404).json({ msg: "Error buying book" })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}

export const isPaid = async (req, res) => {
    try {
        const id = req.params.book_id
        const userId = req.user._id
        const t = await TransactionRepository.checkBought(id, userId)
        if (t) {
            res.status(200).json({ status: true })
        } else {
            res.status(404).json({ status: false })
        }
    } catch (err: any) {
        res.status(500).json({ msg: err.message })
    }
}
