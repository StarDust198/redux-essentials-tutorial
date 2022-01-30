import { useState } from 'react'
import { useSelector } from 'react-redux'

import { useAddNewPostMutation } from '../api/apiSlice'
import { selectAllUsers } from '../users/usersSlice'

import { Spinner } from '../../components/Spinner'

export const AddPostForm = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    
    const [ addNewPost, { isLoading }] = useAddNewPostMutation()
    const users = useSelector(selectAllUsers)

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)

    const canSave = [title, content, userId].every(Boolean) && !isLoading

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                // Redux Toolkit adds a .unwrap() function to the returned Promise, which will return 
                // a new Promise that either has the actual action.payload value from a fulfilled action, 
                // or throws an error if it's the rejected action(helps handle request at the component
                // level)
                await addNewPost({ title, content, user: userId} ).unwrap()
                setTitle('')
                setContent('')
                setUserId('')
            } catch (err) {
                console.error('Failed to save the post: ', err)
            }
        }
    }    

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button type="button" onClick={onSavePostClicked} disabled={!canSave}>Save Post</button>
                {isLoading ? <Spinner /> : null}
            </form>
        </section>
    )
}