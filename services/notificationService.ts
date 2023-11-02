import UserRepository from '../repositories/UserRepository';
import NotificationRepository from '../repositories/NotificationRepository';
import { userSockets } from '../app';

class NotificationSerivice {
    async follow(follower: any, userIdToFollow: string) {
        const owner = await UserRepository.followUser(follower._id, userIdToFollow)
        const user = follower
        const userSocket = userSockets[userIdToFollow];

        const data = {
            owner: owner?._id,
            from: follower?._id,
            types: 'follow',
        }

        await NotificationRepository.pushNotification(data)
        console.log('hey')
        if (userSocket) {
            userSocket.emit('notification', { type: 'follow', user });
        }

        return { user: owner, msg: 'Followed Succesfully' }
    }

    async getAll(id) {
        const user = await UserRepository.findById(id)
        return NotificationRepository.getNotifications(user?._id as string)
    }

    async book(author: any, book: any) {
        const users = author.followers
        users.forEach((user) => {
            const userSocket = userSockets[user];
        })
        users.forEach(async (follower) => {
            const userSocket = userSockets[follower.user_id];
            if (userSocket) {
                userSocket.emit('notification', { type: 'book', author: author, book: book });
            }
            const data = {
                owner:follower._id,
                from:author._id,
                types: 'book',
                item:JSON.stringify(book)
            }
    
            await NotificationRepository.pushNotification(data)
        });

        return true
    }

    async chapter(author: any, chapter: any) {
        const users = author.followers
        users.forEach((user) => {
            const userSocket = userSockets[user];
        })
        users.forEach(async (follower) => {
            const userSocket = userSockets[follower.user_id];
            if (userSocket) {
                userSocket.emit('notification', { type: 'book', author: author, chapter:chapter });
            }
            const data = {
                owner:follower._id,
                from:author._id,
                types: 'book',
                item:JSON.stringify(chapter)
            }
    
            await NotificationRepository.pushNotification(data)
        });

        return true
    }

    async artwork(artwork:any, artist:any){
        const users = artist.followers
        users.forEach(async (follower) => {
            const userSocket = userSockets[follower.user_id];
            if (userSocket) {
                userSocket.emit('notification', { type: 'artwork', aritist:artist, artwork: artwork });
            }
            const data = {
                owner:follower._id,
                from:artist._id,
                types: 'artwork',
                item:JSON.stringify(artwork)
            }
    
            await NotificationRepository.pushNotification(data)
        });

        return true
    }

    async comment(item:any, comment:any, owner:any){
        const user = owner
        const userSocket = userSockets[user];
        if (userSocket) {
            userSocket.emit('notification', { type: 'comment', sender: comment.user._id });
        }
        const data = {
            owner:owner,
            from:comment.user._id,
            types: 'comment',
            item:JSON.stringify(comment,item)
        }

        await NotificationRepository.pushNotification(data)
        

        return true
    }

    async vote(user:string, owner:any, item:any){
        const userSocket = userSockets[user];
        if (userSocket) {
            userSocket.emit('notification', { type: 'vote', sender: user });
        }
        const data = {
            owner:owner,
            from:user ,
            types: 'vote',
            item:JSON.stringify(item)
        }
        console.log("hey")

        await NotificationRepository.pushNotification(data)
        

        return true
    }

}

export default new NotificationSerivice()