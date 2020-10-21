const { AuthenticationError } = require('apollo-server')

const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')

// query and mutation resolvers
module.exports = {
    Query: {
        //* function to get every post in descending order
        async getPosts(){
            try{
                const posts = await Post.find().sort({ createdAt: -1 }); 
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        }, 
        //* get one post by id 
        async getPost(_, { postId }){
            try{
                const post = await Post.findById(postId);
                if(post){
                    return post;
                } else {
                    throw new Error('Post not found')
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    }, 
    Mutation: {
        //* create post object in database
        async createPost(_, { body }, context){  // body param, imported context param (in index.js)
            // verify auth token
            const user = checkAuth(context);

            // check for body not empty
            if (body.trim() === ''){
                throw new Error('Post body must not be empty');
            }

            // create post with user credentials
            const newPost = new Post({
                body, 
                user: user.id, 
                username: user.username, 
                createdAt: new Date().toISOString()
            });
            // async function
            const post = await newPost.save();

            context.pubsub.publish('NEW_POST', {
                newPost: post
            });

            return post;
        },
        //* delete one post object in database by id
        async deletePost(_, { postId }, context){
            //
            const user = checkAuth(context);

            // users can delete only their post
            try{
                // find the post by id 
                const post = await Post.findById(postId);
                if(user.username  === post.username)
                {
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError("Action not allowed");
                }
            } catch(err) {
                throw new Error(err);
            }
        }
    }, 
    Subscription: { // for polling, chat app -> user wants to know when another user posts
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST') //event type to recieve
        }
    }  
};