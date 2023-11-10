
import {forgot, google, login,otp,register} from "../controllers/user/authController"
import { follow, getProfile, getUsers, notifications, user, isFollow, unFollow, edit, clear, plan, roles, report, subscription, dashboard} from '../controllers/user/userController';
import { Router } from "express"
import { verifyUser } from "../utility/jwt";
import { buyerTransactions, create, pay, sellerTransactions, status} from "../controllers/user/transactionController";
import { genres } from "../controllers/admin/genreController";
import { addChapter, addToPaidList, authorBooks, authorChapter, authorPbooks, book, chapter, createBook, deleteBook, deleteChapter, getBooks, getLibrary, isPaid, paidChapter, publish, publishChapter, save, saveChapter, unPublishChapter, unpublish, voteBook } from "../controllers/user/bookController";
import { createComment, deleteComment, editComment, getComments } from "../controllers/user/commentController";
import { addMessage, chatList, loadMessages } from "../controllers/user/messageController";
import { artFields } from "../controllers/admin/artFieldController";
import { Artwork, artistArtWorks, artistPartworks, createArtwork, deleteArtwork, getArtworks, publishArtwork, saveArtwork, unpublishArtwork, vote } from "../controllers/user/artworkController";
import { services } from "../controllers/admin/serviceController";
import { clientAgree, clientRequests, createRequest, editRequest, getRequest, hasPaid, payRequest, provider, providers, registerProvider, requestStatus, vendorRequests } from "../controllers/user/serviceController";
const router = Router()

router.post('/register',register);
router.post('/login',login)
router.post('/google',google)
router.post('/otp',otp)
router.post('/password',forgot)


router.get('/user',verifyUser,user)
router.get('/user/:id',getProfile)
router.post('/user/edit',verifyUser,edit)
router.get('/user/:id/follow',verifyUser,follow)
router.get('/user/:id/unfollow',verifyUser,unFollow)
router.get('/user/:id/isfollow',verifyUser,isFollow)
router.post('/user/plan',verifyUser, plan)
router.post('/user/roles',verifyUser,roles)
router.get('/user/:id/notifications',verifyUser,notifications)
router.get('/user/:id/notifications/clear',verifyUser,clear)
router.get('/user/:id/artworks',verifyUser,artistPartworks)
router.get('/user/:id/books',verifyUser,authorPbooks)
router.post('/user/subscription',verifyUser,subscription)
router.get('/user/profile/transactions',verifyUser,buyerTransactions)
router.post('/pay',verifyUser,create)
router.post('/report',verifyUser,report)

router.get('/people',getUsers)
router.get('/genres',genres)
router.get('/artfields',artFields)
router.get('/services',services)

router.get('/create/books',verifyUser, authorBooks)
router.get('/create/book',verifyUser,createBook)
router.get('/create/book/:book_id',book)
router.get('/create/:book_id/chapter',verifyUser,addChapter)
router.get('/create/:book_id/chapter/:chapter_id',verifyUser,authorChapter)
router.post('/create/book/save',verifyUser,save)
router.post('/create/book/publish',verifyUser,publish)
router.post('/create/book/unpublish',verifyUser,unpublish)
router.post('/create/book/delete',verifyUser,deleteBook)

router.post('/create/chapter/save', verifyUser, saveChapter)
router.post('/create/chapter/publish', verifyUser, publishChapter)
router.post('/create/chapter/unpublish', verifyUser, unPublishChapter)
router.post('/create/chapter/delete', verifyUser, deleteChapter)

router.get('/create',verifyUser,dashboard)
router.get('/create/artworks',verifyUser, artistArtWorks)
router.get('/create/artwork',verifyUser,createArtwork)
router.post('/create/artwork/save',verifyUser,saveArtwork)
router.post('/create/artwork/publish',verifyUser,publishArtwork)
router.post('/create/artwork/unpublish',verifyUser,unpublishArtwork)
router.post('/create/artwork/delete',verifyUser,deleteArtwork)

router.get('/create/transactions', verifyUser, sellerTransactions)
router.post('/create/transactions/:id', verifyUser, status)

router.get('/create/commissions',verifyUser,vendorRequests)
router.post('/create/commissions/:commission_id/status',verifyUser,requestStatus)
router.post('/create/commissions/:commission_id',verifyUser,editRequest)

router.get('/library',verifyUser,getLibrary)
router.get('/library/:book_id/:chapter_id',verifyUser,paidChapter)
router.get('/book/:book_id',book)
router.get('/book/:book_id/buy',verifyUser, addToPaidList)
router.get('/book/paid/:book_id',verifyUser, isPaid)
router.get('/chapter/:id',chapter)
router.post('/chapter/:id/vote', verifyUser, voteBook)
router.get('/books',getBooks)


router.get('/artwork/:artwork_id',Artwork)
router.post('/artwork/:artwork_id/vote',verifyUser,vote)
router.get('/artworks',getArtworks)


router.post('/provider', verifyUser, registerProvider)
router.get('/providers', providers)
router.get('/providers/:id', verifyUser, provider)

router.get('/commissions',verifyUser,clientRequests)
router.post('/commissions',verifyUser,createRequest)
router.get('/commisions/pending',verifyUser, hasPaid)
router.get('/commissions/:commission_id',verifyUser,getRequest)
router.get('/commissions/:commission_id/agree',verifyUser,clientAgree)
router.post('/commission/:commission_id/pay',verifyUser,payRequest)


router.post('/buy', verifyUser, pay)


router.get('/comments/:id',getComments)
router.post('/comment/create',verifyUser, createComment)
router.post ('/comment/:comment_id',verifyUser, editComment)
router.delete('/comment/:comment_id', verifyUser, deleteComment)

router.get('/chat/list',verifyUser,chatList)
router.get('/chat/:user1/:user2', verifyUser, loadMessages)
router.post('/chat/:user1/:user2', verifyUser, addMessage)

export default router 

