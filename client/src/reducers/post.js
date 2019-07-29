import { GET_POSTS, POST_ERROR, UPDATE_LIKE } from "../actions/types"

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {}
}


export default function (state = initialState, { type, payload }) {
    switch (type) {
        case GET_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false
            }
        case UPDATE_LIKE:
            let resState = {
                ...state,
                posts:  state.posts.map(post => post._id === payload.post_id ? {...post,likes: payload.likes} : post ),
                loading: false
            }
            return resState;
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }
}