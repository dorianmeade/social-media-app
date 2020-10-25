import React, { useState } from 'react';
import { Button, Confirm, Icon } from 'semantic-ui-react';
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import {FETCH_POSTS_QUERY } from '../util/graphql'
import MyPopup from '../util/MyPopup'

function DeleteButton({postId, commentId, callback}){
    const [confirmOpen, setConfirmOpen] = useState(false);

    //* mutation dynamic to delete post or delete comment
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy){
            // if reached-> user has confirmed 
            setConfirmOpen(false);
            // remove post from cache
            if(!commentId)
            {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                data.getPosts = data.getPosts.filter(p => p.id !== postId)   //TODO: deletion from cache is not removing it from ui
                proxy.writeQuery({query: FETCH_POSTS_QUERY, data})    
            }
            // call function to redirect to home, if post deleted
            if (callback) callback()
        }, 
        variables: {
            postId, 
            commentId
        }
    })

    return (
        <> 
        <MyPopup content={commentId ? 'Delete comment' : 'Delete post'}>
            <Button
            as="div"
            color="red"
            floated="right"
            onClick={() => setConfirmOpen(true)}
            >
                <Icon name="trash" style={{ margin: 0 }} />
            </Button>
        </MyPopup>
        <Confirm  //delete confirmation modal 
            open={confirmOpen}
            onCancel={() => setConfirmOpen(false)} //user does not want to delete post
            onConfirm={deletePostOrComment} //user continues to delete post, call mutation callback
        />
        </>
    )
}
export default DeleteButton;

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id 
            comments {
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`