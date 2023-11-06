import CommentRepository from "../../repositories/CommentRepository";
import notificationService from "../../services/notificationService";

export const createComment = async (req, res) => {
    try {
        const{ reply_id,item,...data}  = req.body
        const comment:any = await CommentRepository.createComment(data)
        if(data.reply){
            const id = comment?._id
            await CommentRepository.replyComment(reply_id,id)
        }
        if(data.location.place=='chapter'){
            await notificationService.comment(item,comment,item.book.author)
        }else{
            await notificationService.comment(item,comment,item.artist._id)
        }
        const comments = await CommentRepository.getComments(data.location.id)
        if(comment){
            res.status(200).json({comment:comment, comments:comments})
        }else{
            res.status(500).json({msg:"Some error"})
        }
    } catch (err: any) {
        res.status(500).json({msg:err.message})
    }
}

export const editComment = async (req, res) => {
    try {
        const id = req.params.comment_id
        const {message}=req.body
        const comment:any = await CommentRepository.editComment(message,id)
        const comments = await CommentRepository.getComments(comment.location.id)
        if(comment){
            res.status(200).json({comment:comment, comments:comments})
        }else{
            res.status(500).json({msg:"Didnt Edit!"})
        }
    } catch (err: any) {
        res.status(500).json({msg:err.message})
    }
}

export const deleteComment = async (req, res) => {
    try {
        const id =req.params.comment_id
        const comment = await CommentRepository.deleteComment(id)
        if(comment){
            const comments = await CommentRepository.getComments(comment.location.id)
            res.status(200).json({comment:comment, comments:comments})
        }else{
            res.status(500).json({msg:"Some error"})
        }
    } catch (err: any) {
        res.status(500).json({msg:err.message})
    }
}

export const getComments = async (req, res) => {
    try {
        const id = req.params.id
        const comments = await CommentRepository.getComments(id)
        if(comments){
            res.status(200).json({comments:comments})
        }else{
            res.status(500).json({msg:"Some error"})
        }
    } catch (err: any) {
        res.status(500).json({msg:err.message})
    }
}