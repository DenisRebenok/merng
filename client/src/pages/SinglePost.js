import React, { useState, useEffect, useContext } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { Grid, Image, Card, Button, Icon, Label } from 'semantic-ui-react'
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'

export default props => {
  const [post, setPost] = useState(null)
  const { user } = useContext(AuthContext)

  const postId = props.match.params.postId

  const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId }
  })
  useEffect(() => {
    if (data) setPost(data.getPost)
  }, [data])
  if (loading) return <h1>Loading post..</h1>
  if (error) return <p>{error.message}</p>
  if (!post) return <p>Loading post..</p>

  const {
    id,
    body,
    createdAt,
    username,
    comments,
    likes,
    likeCount,
    commentCount
  } = post

  function deletePostCallback() {
    props.history.push('/')
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={2}>
          <Image
            floated="right"
            size="small"
            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
          />
        </Grid.Column>
        <Grid.Column width={10}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
              <Card.Description>{body}</Card.Description>
            </Card.Content>
            <hr />
            <Card.Content extra>
              <LikeButton user={user} post={{ id, likeCount, likes }} />
              <Button
                as="div"
                labelPosition="right"
                onClick={() => console.log('Comment on post')}
              >
                <Button basic color="blue">
                  <Icon name="comments" />
                </Button>
                <Label basic color="blue" pointing="left">
                  {commentCount}
                </Label>
              </Button>
              {user && user.username === username && (
                <DeleteButton postId={id} callback={deletePostCallback} />
              )}
            </Card.Content>
          </Card>
          {comments.map(comment => (
            <Card fluid key={comment.id}>
              <Card.Content>
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
`
