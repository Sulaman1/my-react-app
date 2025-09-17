import { createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

const initialState = {
	token: null,
	userId: null,
	refreshToken: null,
	err: null,
	loading: false,
	roles: []
};

const authSlice = createSlice({
	name: 'authentication',
	initialState,
	reducers: {
		loginSuccess(state, action) {
			state.token = action.payload.accessToken;
			state.userId = action.payload.userId;
			state.refreshToken = action.payload.refreshToken;
			state.companyId = action.payload.companyId;
			state.officeId = action.payload.officeId;
			state.email = action.payload.email;
			state.firstName = action.payload.firstName;
			state.lastName = action.payload.lastName;
			state.user = action.payload;
			state.loading = false;
			state.err = null;
		},
		signupSuccess(state, action) {
			state.token = action.payload.token;
			state.userId = action.payload.userId;
			state.refreshToken = action.payload.refreshToken;
			state.loading = false;
			state.err = null;
		},
		authFail(state, action) {
			state.err = action.payload;
			state.loading = false;
		},
		authStart(state) {
			state.loading = true;
		},
		logout(state) {
			state.token = null;
			state.refreshToken = null;
			state.userId = null;
		}
	}
});

const authActions = authSlice.actions;

export const onLogin = (email, password) => {
	const data = {
		email,
		password
	};
	return dispatch => {
		dispatch(authActions.authStart());
		axios
			.post('/users/login', data)
			.then(response => {
				console.log(response.data);

				const { accessToken, refreshToken, companyId, email, officeId, _id, firstName, lastName } = response.data;
				sessionStorage.setItem("accessToken", accessToken);
				sessionStorage.setItem("refreshToken", refreshToken);
				sessionStorage.setItem("companyId", companyId);
				sessionStorage.setItem("officeId", officeId);
				sessionStorage.setItem("email", email);
				sessionStorage.setItem("firstName", firstName);
				sessionStorage.setItem("lastName", lastName);
				sessionStorage.setItem("userId", _id)
				sessionStorage.setItem("user", JSON.stringify(response.data));


				dispatch(authActions.loginSuccess(response.data));
			})
			.catch(err => {
				console.log(err);
				dispatch(authActions.authFail(err));
			});
	};
};

export const onSignup = (email, password) => {
	const data = {
		email,
		password
	};
	return dispatch => {
		dispatch(authActions.authStart());
		axios
			.post('', data)
			.then(response => {
				console.log(response.data);
				const payload = {
					token: response.data.accessToken,
					refreshToken: response.data.refreshToken,
					email: response.data.email,
					roles: response.data.roles
				};
				localStorage.setItem('token', response.data.accessToken);
				localStorage.setItem('branchId', response.data.branchId);
				localStorage.setItem('agencyId', response.data.agencyId);
				localStorage.setItem(
					'refreshToken',
					response.data.refreshToken
				);
				dispatch(authActions.signupSuccess(payload));
			})
			.catch(err => {
				const error = err.response.data.message;
				dispatch(authActions.authFail(error));
			});
	};
};

export default authSlice.reducer;
