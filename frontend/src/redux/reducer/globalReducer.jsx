import ActionType from "./globalActionType";

const globalState = {
    user: '',
    token: '',
    expired: '',
    picture: '',
    role: '',
    tahun_ajar: ''
}

const rootReducer = (state = globalState, action) => {
    switch (action.type) {
        case ActionType.SET_NAME_USER:
            return {
                ...state,
                user: action.index
            }
        case ActionType.SET_TOKEN_USER:
            return {
                ...state,
                token: action.index
            }
        case ActionType.SET_EXPIRED_USER:
            return {
                ...state,
                expired: action.index
            }
        case ActionType.SET_PICTURE_USER:
            return {
                ...state,
                picture: action.index
            }
        case ActionType.SET_ROLE_USER:
            return {
                ...state,
                role: action.index
            }
        case ActionType.SET_TAHUN_AJAR:
            return {
                ...state,
                tahun_ajar: action.index
            }
        default:
            return state
    }
}

export default rootReducer