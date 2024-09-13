import { setIsInitialized, setLoading } from '../../app/appReducer'
import { authAPI } from '../../api/todolistAPI'
import { handleServerAppError, handleServerNetworkError } from '../../utils/errorUtils'
import { LoginData } from './Login'
import { AppThunk } from '../../app/store'

const initialState = {
	isLoggedIn: false
}

type InitialState = typeof initialState
enum STATUS_CODE {
	SUCCESS = 0,
	ERROR = 1,
	RECAPTCHA_ERROR = 10,
}

export const authReducer = (state = initialState, action: AuthActionsType): InitialState => {
	const { type, payload } = action
	switch (type) {
		case 'LOGIN/SET-IS-LOGGED-IN':
			return { ...state, isLoggedIn: payload.isLoggedIn }
		default:
			return state
	}
}

export const setIsLoggedInAC = (isLoggedIn: boolean) => ({ type: 'LOGIN/SET-IS-LOGGED-IN' as const, payload: { isLoggedIn } })

export const loginTC = (data: LoginData): AppThunk => (dispatch) => {
	dispatch(setLoading('loading'))
	authAPI.login(data)
		.then((res) => {
			if (res.data.resultCode === STATUS_CODE.SUCCESS) {
				dispatch(setIsLoggedInAC(true))
			} else {
				handleServerAppError(dispatch, res.data)
			}
			dispatch(setLoading('succeeded'))
		})
		.catch((e) => {
			handleServerNetworkError(dispatch, e)
		})
}
export const logoutTC = (): AppThunk => (dispatch) => {
	dispatch(setLoading('loading'))
	authAPI.logout()
		.then((res) => {
			if (res.data.resultCode === STATUS_CODE.SUCCESS) {
				dispatch(setIsLoggedInAC(false))
			} else {
				handleServerAppError(dispatch, res.data)
			}
			dispatch(setLoading('succeeded'))
		})
		.catch((e) => {
			handleServerNetworkError(dispatch, e)
		})
}

export const meTC = (): AppThunk => (dispatch) => {
	dispatch(setLoading('loading'))
	authAPI.me()
		.then((res) => {
			if (res.data.resultCode === STATUS_CODE.SUCCESS) {
				dispatch(setIsLoggedInAC(true))
			} else {
				handleServerAppError(dispatch, res.data)
			}
			dispatch(setLoading('succeeded'))
		})
		.catch((e) => {
			handleServerNetworkError(dispatch, e)
		})
		.finally(() => {
			dispatch(setIsInitialized(true))
		})
}

export type AuthActionsType = ReturnType<typeof setIsLoggedInAC> 