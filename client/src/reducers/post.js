import { GET_POSTS, POST_ERROR, UPDATE_LIKE, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT } from "../actions/types"

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
        case GET_POST:
            return {
                ...state,
                post: payload,
                loading: false
            }
        case UPDATE_LIKE:
            let resState = {
                ...state,
                posts: state.posts.map(post => post._id === payload.post_id ? { ...post, likes: payload.likes } : post),
                loading: false
            }
            return resState;
        case ADD_POST:
            return {
                ...state,
                posts: [payload, ...state.posts],
                loading: false
            }
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter((i) => i._id !== payload),
                loading: false,
            }
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case ADD_COMMENT:
            return {
                ...state,
                post: { ...state.post, comments: payload },
                loading: false
            }
        case REMOVE_COMMENT:
            return {
                ...state,
                post: { ...state.post, comments: state.post.comments.filter(i=>i._id !== payload) },
                loading: false
            }
        default:
            return state;
    }
}