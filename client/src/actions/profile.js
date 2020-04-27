import axios from "axios"
import { setAlert } from "./alert"
import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    DELETE_ACCOUNT,
    CLEAR_PROFILE,
    GET_PROFILES,
    GET_GITREPOS,
    UPLOAD_PROF_PIC_SUCCESS,
    UPLOAD_PDF,
    DELETE_PDF,
} from "./types"


//get current user's profiles 

export const getCurrentProfile = () => {
    return async (dispatch) => {
        try {
            const res = await axios.get("api/profile/me");
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}


//get all profiles

export const getProfiles = () => {
    return async (dispatch) => {
        try {
            const res = await axios.get("api/profile");

            dispatch({
                type: CLEAR_PROFILE
            })

            dispatch({
                type: GET_PROFILES,
                payload: res.data
            })

            return res.data;


        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}


//getProfile by id

export const getProfileById = (userId) => {
    return async (dispatch) => {
        try {
            const res = await axios.get(`/api/profile/user/${userId}`);
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })

        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}


//get Github repos

export const getGithubRepos = (username) => {
    return async (dispatch) => {
        try {
            const res = await axios.get(`/api/profile/github/${username}`);
            dispatch({
                type: GET_GITREPOS,
                payload: res.data
            })

        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}


//create or update a profile

export const createUpdateProfile = (formData, history, edit = false) => {
    return async (dispatch) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };

            const res = await axios.post("/api/profile", formData, config);


            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })

            dispatch(setAlert(edit ? "Profile Updated!" : "Profile Created", "success"));
            if (!edit) {
                history.push("/dashboard");
            }

        } catch (error) {

            const errors = error.response.data.errors;
            if (errors) {
                errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}

export const uploadProfPic = (data) => {
    return async dispatch => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };
            const body = {
                imageBase64: data
            }

            const res = await axios.put("/api/users/uploadAvatar", JSON.stringify(body), config);


            dispatch({
                type: UPLOAD_PROF_PIC_SUCCESS,
                payload: res.data
            })

            dispatch(setAlert("Profile picture Added!", "success"));
        }
        catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
};

export const uploadPDF = (data) => {
    return async dispatch => {
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };

            const res = await axios.put("/api/profile/uploadPDF", data, config);


            dispatch({
                type: UPLOAD_PDF,
                payload: res.data
            })

            dispatch(setAlert("YOUR CV added!", "success"));
        }
        catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}

export const deletePDF = () => {
    return async (dispatch) => {
        try {
            const res = await axios.delete(`/api/profile/deletePDF`);

            dispatch({
                type: DELETE_PDF,
                payload: res.data,
            })


            dispatch(setAlert("Your CV is deleted", "success"));


        } catch (error) {

            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}


//add experience

export const addExperience = (formData, history) => {
    return async dispatch => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };

            const res = await axios.put("/api/profile/experience", formData, config);


            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            })

            dispatch(setAlert("Experience Added!", "success"));
            history.push("/dashboard");

        } catch (error) {

            const errors = error.response.data.errors;
            if (errors) {
                errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}


//add education

export const addEducation = function (formData, history) {
    return async dispatch => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };

            const res = await axios.put("/api/profile/education", formData, config);


            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            })

            dispatch(setAlert("Education Added!", "success"));
            history.push("/dashboard");

        } catch (error) {

            const errors = error.response.data.errors;
            if (errors) {
                errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}


//delete experience
export const deleteExperience = (id) => {
    return async (dispatch) => {
        try {
            const res = await axios.delete(`/api/profile/experience/${id}`);

            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            })

            dispatch(setAlert("Experience removed!", "success"));
        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}



//delete education
export const deleteEducation = (id) => {
    return async (dispatch) => {
        try {
            const res = await axios.delete(`/api/profile/education/${id}`);

            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            })

            dispatch(setAlert("Education removed!", "success"));
        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            })
        }
    }
}


//delete account & profile


export const deleteAccount = () => {
    return async (dispatch) => {

        if (window.confirm("Are you sure ? This can NOT be undone!")) {
            try {
                await axios.delete(`/api/profile`);

                dispatch({
                    type: CLEAR_PROFILE,
                })

                dispatch({
                    type: DELETE_ACCOUNT,
                })

                dispatch(setAlert("Account deleted!"));
            } catch (error) {
                dispatch({
                    type: PROFILE_ERROR,
                    payload: {
                        msg: error.response.statusText,
                        status: error.response.status
                    }
                })
            }
        }

    }
}
