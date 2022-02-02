// Import the RTK query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const apiSlice = createApi({
    // The cache reducer expects to be added at `state.api` (already default - this is optional)
    reducerPath: 'api',
    // All of our requests will have URLs starting with '/fakeApi'
    baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
    // Declaring an array of string tag names for data types
    tagTypes: ['Post'],
    // The "endpoints" represent operations and requests for this server
    endpoints: builder => ({
        // The `getPosts` endpoint is a "query" operation that returns data
        getPosts: builder.query({
            // The URL for the request is '/fakeApi/posts'
            query: () => '/posts',
            // provides a general 'Post' tag for the while list, as well as
            // a specific {type:'Post', id} tag for each received post object
            providesTags: (result = [], error, arg) => [
                'Post',
                ...result.map(({ id }) => ({ type: 'Post', id }))
            ]
        }),
        getPost: builder.query({            
            query: postId => `/posts/${postId}`,
            // provides a specific { type: 'Post', id } object for ind. post obj.
            providesTags: (result, error, arg) => [{ type: 'Post', id: arg }]
        }), 
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                // Include the entire post object as the body of the request
                body: initialPost
            }),
            // Listing a set of tags that are invalidates every time that mutation runs
            invalidatesTags: ['Post']
        }),
        editPost: builder.mutation({
            query: post => ({
                url: `/posts/${post.id}`,
                method: 'PATCH',
                body: post
            }),
            // invalidates the specific { type: 'Post', id } tag. This will force
            // a refetch of both the ind. post from getPost, as well as the entire
            // list of posts from getPosts, because they both provide a tag that
            // matches that { type, id } value
            invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }]
        }),
        addReaction: builder.mutation({
            query: ({ postId, reaction }) => ({
                url: `posts/${postId}/reactions`,
                method: 'POST',
                // In a real app, we'd probably need to base this on user ID somehow 
                // so that a user can't do the same reaction more than once
                body: { reaction }
            }),
            async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
                // `updateQueryData` requires the endpoint name and cache key arguments,
                // so it know which piece of cache state to update
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getPosts', undefined, draft => {
                        // The `draft` is Immer-wrapper and can be "mutated" like in createSlice
                        const post = draft.find(post => post.id === postId)
                        if (post) {
                            post.reactions[reaction]++
                        }
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()  // dispatches reverse action if promise fails
                }
            }
        })
    })
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const { 
    useGetPostsQuery,
    useGetPostQuery,
    useAddNewPostMutation,
    useEditPostMutation,
    useAddReactionMutation
} = apiSlice
