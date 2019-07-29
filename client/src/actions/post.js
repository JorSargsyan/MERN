import axios from "axios"
import {setAlert} from "./alert"
import {GET_POSTS,POST_ERROR,UPDATE_LIKE} from "./types"

//GET posts
export const getPosts = ()=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("/api/posts");

            dispatch({
                type:GET_POSTS,
                payload:res.data
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
export const addLike = (post_id)=>{
    return async (dispatch)=>{
        try {
            const res = await axios.put(`/api/posts/like/${post_id}`);

            dispatch({
                type:UPDATE_LIKE,
                payload:{post_id,likes:res.data}
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
export const removeLike = (post_id)=>{
    return async (dispatch)=>{
        try {
            const res = await axios.put(`/api/posts/unlike/${post_id}`);

            dispatch({
                type:UPDATE_LIKE,
                payload:{post_id,likes:res.data}
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