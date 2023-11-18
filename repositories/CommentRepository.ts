import Comment from "../models/Comment";

class CommentRepository {
    async getComments(id: string) {
        return Comment.find({ 'location.id': id }).populate({ path: 'user' }).populate({  path: 'replies',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: 'user' }})
    }
    async createComment(data: any) {
        return Comment.create(data)
    }
    async editComment(msg: string, id: string) {
        return Comment.findOneAndUpdate({ comment_id: id }, { $set: { message: msg, edited: true } })
    }
    async replyComment(main: string, reply: string) {
        return Comment.findOneAndUpdate({ comment_id: main }, { $push: { replies:  reply  } })
    }
    async deleteComment(id: string) {
        const c: any = await Comment.findOne({ comment_id: id })
        if(c.reply==true){
            await Comment.findOneAndUpdate({}, { $pull: { replies:  c._id  } })
            return Comment.findOneAndDelete({ comment_id: id })
        }
        if (c.replies.length == 0) {
            return Comment.findOneAndDelete({ comment_id: id })
        } else {
            const replyIds = c.replies.map((reply) => reply._id);
            await Comment.deleteMany({ _id: { $in: replyIds } });
            return Comment.findOneAndDelete({ comment_id: id });
        }

    }
}

export default new CommentRepository()