import { 
    createEntityAdapter,
    createSelector
} from '@reduxjs/toolkit'

import { apiSlice } from '../api/apiSlice'

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            // We can integrate createEntityAdapter into extendedApiSlice and use adapter
            // to transform data before it's cached. It will return the standard { ids:[], 
            // entities: {} } normalized data structure
            transformResponse: responseData => {
                return usersAdapter.setAll(initialState, responseData)
            }
        })
    })
})

export const { useGetUsersQuery } = extendedApiSlice


// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)
// In this case, the users query has no params, so we don't pass anything to select()
export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()

export const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data
)

export const { selectAll: selectAllUsers, selectById: selectUserById } =
 usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)