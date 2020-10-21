const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')

//*comment mutation resolvers
module.exports = {
    Mutation: {
        //* function to create like object, update post
        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context);
            // find instance of post
            const post = await Post.findById(postId);
            if(post){
                // check if user already liked post 
                if(post.likes.find(likes => likes.username === username)){
                    //remove the like (unlike) 
                    post.likes = post.likes.filter((like) => like.username !== username);
                    //await post.save()
                } else {
                    //like the post 
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString() 
                    })
                }
                // save post regardless of action
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        }
    }
};