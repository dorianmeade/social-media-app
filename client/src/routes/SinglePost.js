import React, { useContext, useState, useRef } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Grid, Image, Card, Button, Icon, Label, Form } from 'semantic-ui-react';
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'
import MyPopup from '../util/MyPopup'


function SinglePost(props){
    // get id from url 
    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext); // get context access

    const commentInputRef = useRef(null);

    const [comment, setComment] = useState('');

    // query the posts to find one given id 
    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    });

    // array destructure mutation 
    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update(){
            // set comment back to empty string after addeing
            setComment('')
            // blur submit button after it is pressed
            commentInputRef.current.blur()
        },
        // pass variables for this mutation
        variables: {
            postId, 
            body: comment
        }
    })

    // route to home page after delete post
    function deletePostCallback() {
        props.history.push('/');
        }

    let postMarkup; 
    if(!data){
        postMarkup = <p>Loading post..</p> //TODO: change to loading spinner 
    }else {
        const { id, body, createdAt, username, comments, likes, commentCount, likeCount} = data.getPost

        // define card ui 
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                            size="small"
                            float="right" />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>
                                    {moment(createdAt).fromNow(true)}
                                </Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id, likeCount, likes}}/>
                                <MyPopup 
                                    content="Comment on post" 
                                >
                                    <Button
                                        as="div"
                                        labelPosition="right"
                                        onClick={() => console.log('Comment on post')}
                                        >
                                        <Button basic color="teal">
                                            <Icon name="comment"/>
                                        </Button>
                                        <Label basic color="teal" pointing="left">
                                            {commentCount}
                                        </Label>
                                    </Button>
                                    </MyPopup>
                                    {user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback}/>}
                            </Card.Content>
                        </Card>
                        {/* display comment input option */}
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        {/* equiv of form.input in css */}
                                        <div className="ui action input fluid">
                                            <input 
                                                type="text"
                                                placeholder="Leave a nice comment..."
                                                name="comment"
                                                value={comment}
                                                onChange={event => setComment(event.target.value)}
                                                ref={commentInputRef}
                                            />
                                            {/* disable submit button if comment is empty */}
                                            <button 
                                                type = "submit"
                                                className="ui button purple"
                                                disabled={comment.trim() === ''}
                                                onClick={createComment}
                                                >Submit</button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {/* display comments after post body*/}
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && <DeleteButton postId={id} commentId={comment.id}/>}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return(
        postMarkup
    )
}

const CREATE_COMMENT_MUTATION = gql`
    mutation($postId: String!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id
            comments {
                id 
                body
                createdAt
                username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId: ID!) {
        getPost(postId: $postId) {
        id
        body
        createdAt
        username
        likeCount
        likes {
            username
        }
        commentCount
        comments {
            id
            username
            createdAt
            body
        }
        }
    }
`; 

export default SinglePost;
