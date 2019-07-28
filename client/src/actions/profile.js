import axios from "axios"
import {setAlert} from "./alert"
import {GET_PROFILE,PROFILE_ERROR} from "./types"


//get current user's profiles 

export const getCurrentProfile = ()=>{
    return async (dispatch)=>{
        try {
            const res = await axios.get("api/profile/me");
            dispatch({
                type :GET_PROFILE,
                payload : res.data
            })
        } catch (error) {
            dispatch({
                type:PROFILE_ERROR,
                payload : {msg : error.response.statusText,
                    status:  error.response.status
                }
            })
        }
    }
}



//create or update a profile

export const createUpdateProfile = (formData,history,edit = false)=>{
    return async(dispatch)=>{
        try {
            const config = {
                headers: {
                    "Content-Type":"application/json"
                }
            };

            const res = await axios.post("/api/profile",formData,config);


            dispatch({
                type:GET_PROFILE,
                payload:res.data
            })
            
            dispatch(setAlert(edit? "Profile Updated!" : "Profile Created","success")) ;
            if(!edit){
                history.push("/dashboard");
            }
            
        } catch (error) {

            const errors = error.response.data.errors;
            if (errors) {
                errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
            }

            dispatch({
                type:PROFILE_ERROR,
                payload : {msg : error.response.statusText,
                    status:  error.response.status
                }
            })
        }
    }
}

