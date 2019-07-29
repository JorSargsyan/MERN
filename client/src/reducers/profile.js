import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE ,GET_GITREPOS,GET_PROFILES } from "../actions/types"

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
}

export default function (state = initialState, { type, payload }) {
    switch (type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        case GET_PROFILES:
            return {
                ...state,
                profiles:payload,
                loading:false
            }
        case GET_GITREPOS:
            return {
                ...state,
                repos : payload,
                loading:false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: true
            }
        default:
            return state;
    }
}