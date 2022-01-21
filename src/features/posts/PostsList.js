import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
// import { 
//     fetchPosts,
//     selectPostIds,
//     selectPostById
// } from './postsSlice'
import { useGetPostsQuery } from '../api/apiSlice'

let PostExcerpt = ({ post }) => {
    // const post = useSelector(state => selectPostById(state, postId))

    return (
        <article className="post-excerpt" key={post.id}>
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />                
            </div>
            <p className="post-content">{post.content.substring(0, 100)}</p>

            <ReactionButtons post={post} />
            <Link to={`/posts/${post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    )
}

export const PostsList = () => {
    const {
        data: posts,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery()

    // const dispatch = useDispatch()
    // const orderedPostIds = useSelector(selectPostIds)

    // const postStatus = useSelector(state => state.posts.status)
    // const error = useSelector(state => state.posts.error)

    // useEffect(() => {
    //     if (postStatus === 'idle') {
    //         dispatch(fetchPosts())
    //     }
    // }, [postStatus, dispatch])

    let content

    if (isLoading) {
        content = <Spinner text="Loading..." />
    } else if (isSuccess) {
        content = posts.map(post => <PostExcerpt key={post.id} post={post} />)
    } else if (isError) {
        content = <div>{error.toString}</div>
    }    

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    )
}