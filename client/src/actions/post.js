import axios from "axios"
import { setAlert } from "./alert"
import { GET_POSTS, POST_ERROR, UPDATE_LIKE, DELETE_POST, ADD_POST,GET_POST,ADD_COMMENT,REMOVE_COMMENT } from "./types"

//GET posts
export const getPosts = () => {
    return async (dispatch) => {
        try {
            const res = await axios.get("/api/posts");

            dispatch({
                type: GET_POSTS,
                payload: res.data
            })
        } catch (error) {

            dispatch({
                type: POST_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}


//add like
export const addLike = (post_id) => {
    return async (dispatch) => {
        try {
            const res = await axios.put(`/api/posts/like/${post_id}`);

            dispatch({
                type: UPDATE_LIKE,
                payload: { post_id, likes: res.data }
            })
        } catch (error) {

            dispatch({
                type: POST_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}


//remove Like
export const removeLike = (post_id) => {
    return async (dispatch) => {
        try {
            const res = await axios.put(`/api/posts/unlike/${post_id}`);

            dispatch({
                type: UPDATE_LIKE,
                payload: { post_id, likes: res.data }
            })
        } catch (error) {

            dispatch({
                type: POST_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}


//delete post
export const deletePost = (post_id) => {
    return async (dispatch) => {
        try {
            const res = await axios.delete(`/api/posts/${post_id}`);

            dispatch({
                type: DELETE_POST,
                payload: post_id
            })


            dispatch(setAlert("Post is deleted", "success"));


        } catch (error) {

            dispatch({
                type: POST_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}


//add post
export const addPost = (formData) => {
    return async (dispatch) => {

        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
        try {
            const res = await axios.post(`/api/posts`,formData,config);

            dispatch({
                type: ADD_POST,
                payload: res.data
            })


            dispatch(setAlert("Post created", "success"));


        } catch (error) {

            dispatch({
                type: POST_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}



//get post
export const getPost = (id) => {
    return async (dispatch) => {

        try {
            const res = await axios.get(`/api/posts/${id}`);

            dispatch({
                type: GET_POST,
                payload: res.data
            })

        } catch (error) {

            dispatch({
                type: POST_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}



//add comment
export const addComment = (postId,formData) => {
    return async (dispatch) => {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const res = await axios.post(`/api/posts/comment/${postId}`,formData,config);

            dispatch({
                type: ADD_COMMENT,
                payload: res.data
            })


            dispatch(setAlert("Comment added", "success"));


        } catch (error) {

            dispatch({
                type: POST_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}



//delete comment
export const deleteComment = (postId,comment_id) => {
    return async (dispatch) => {
        try {
            await axios.delete(`/api/posts/comment/${postId}/${comment_id}`);

            dispatch({
                type: REMOVE_COMMENT,
                payload: comment_id
            })


            dispatch(setAlert("Comment is deleted", "success"));
        } catch (error) {

            dispatch({
                type: POST_ERROR,
                payload: {
                    status: error.response.status
                }
            })
        }
    }
}