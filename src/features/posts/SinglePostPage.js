import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { useGetPostQuery } from '../api/apiSlice'

import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
// import { selectPostById } from './postsSlice'


export const SinglePostPage = ({match}) => {
    const {postId} = match.params

    const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)

    // if (!post) {
    //     return (
    //         <section>
    //             <h2>Post not found!</h2>
    //         </section>
    //     )
    // }

    
    let content
    if (isFetching) {
        content = <Spinner text="Loading..." />
    } else if (isSuccess) {
        console.log(post);
        content = (
            <article className="post">
                <h2>{post.title}</h2>
                <div>
                    <PostAuthor userId={post.user} />
                    <TimeAgo timestamp={post.date} />
                </div>
                <p className="post-content">{post.content}</p>
                <ReactionButtons post={post} />
                <Link to={`/editPost/${post.id}`} className="button">
                    Edit Post
                </Link>
            </article>
        )
    }

    return (
        <section>{content}</section>
    )
}