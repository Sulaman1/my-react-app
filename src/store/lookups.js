import { createSlice } from '@reduxjs/toolkit';
import axios from '../axios';
import { getData, postData } from '../services/request';
import swal from 'sweetalert';

const initialState = {
	countries: [],
	lookupData: {}
};

const lookupsSlice = createSlice({
	name: 'lookups',
	initialState,
	reducers: {
		setLoadedCountries(state, action) {
			state.countries = action.payload;
			state.loading = false;
		},
		setLoadedLookupData(state, action) {
			console.log('<<<<>>>> typetype', action.payload.type);
			const { data, type } = action.payload;
			state.lookupData[type] = data;
			state.loading = false;
		},
		loadError(state, action) {
			state.error = action.payload;
			state.loading = false;
		},
		postSuccess(state) {
			state.lookupsRedirect = true;
			state.loading = false;
		},
		toggleLookupsRedirect(state) {
			state.lookupsRedirect = !state.lookupsRedirect;
		},
		fetchLookupsStart(state) {
			state.loading = true;
		},
		addLookupStart(state) {
			state.loading = true;
		}
	}
});

export const lookupsActions = lookupsSlice.actions;

export const setRedirectFalse = () => {
	return async dispatch => {
		dispatch(lookupsActions.toggleLookupsRedirect());
	};
};

export const onLoadData = (url, showButtons) => {
	return async dispatch => {
		dispatch(lookupsActions.fetchLookupsStart());
		try {
			let result = await getData(url);
			if (!result || !result.result) {
				swal({
					button: true,
					icon: 'error',
					text: 'Something went wrong',
					timer: 2500
				});
			} else {
				result = result.result;
				let data = null;
				if (result.data) {
					data = result.data || [];
				} else if (result.items) {
					data = result.items || [];
				}

				dispatch(lookupsActions.setLoadedCountries(data));
			}
		} catch (err) {
			dispatch(lookupsActions.loadError(err));
		}
	};
};

export const onLoadDropData = (url, type = "") => {
	return async dispatch => {
		dispatch(lookupsActions.fetchLookupsStart());
		try {

			let result = await getData(url);
			if (!result || !result.result) {
				swal({
					button: true,
					icon: 'error',
					text: 'Something went wrong',
					timer: 2500
				});
			} else {
				result = result.result;
				let data = {
					type: type || ""
				};
				console.log(type, '<<<<<< typetype')

				if (result.data) {
					data['data'] = result.data || [];
				} else if (result.items) {
					data['data'] = result.items || [];
				}
				dispatch(lookupsActions.setLoadedLookupData(data));
			}
		} catch (err) {
			dispatch(lookupsActions.loadError(err));
		}
	};
};

export const postAdd = (url, payload, callBackMethod) => {
	return async dispatch => {
		dispatch(lookupsActions.addLookupStart());
		try {
			const result = await postData(url, payload);
			if (!result?.success) {
				swal(`${result?.error?.message}`, "", "error")
				return
			} else {
				swal('Successfully Saved!', '', 'success');
				if(callBackMethod) {
					callBackMethod()
				}
				dispatch(lookupsActions.postSuccess());
			}
		} catch (error) {
			dispatch(lookupsActions.loadError(error));
		}
	};
};




export const updateLookupsData = (data, id, url) => {
	return async dispatch => {
		dispatch(lookupsActions.addLookupStart());
		if (url && id) {
			const response = await axios.put('/' + url + '/' + id, data);
			dispatch(lookupsActions.postSuccess());
		} else {
			swal({
				button: true,
				icon: 'error',
				text: 'Something went wrong',
				timer: 2500
			});
		}
	};
};

export const deleteLookupData = (url, id) => {
	return async dispatch => {
		dispatch(lookupsActions.addLookupStart());
		if (url && id) {
			const authKey =
				sessionStorage.getItem("accessToken")
					? "Bearer " + sessionStorage.getItem("accessToken")
					: "";
			const response = await axios.delete(url + '?input=' + id, {
				headers: {
					Authorization: authKey
				},
				data: {}
			});
			dispatch(lookupsActions.postSuccess());
		} else {
			swal({
				button: true,
				icon: 'error',
				text: 'something went wrong at update',
				timer: 2500
			});
		}
	};
};

export const onLoadTrips = (userId) => {
	return async dispatch => {
		dispatch(lookupsActions.fetchLookupsStart());
		try {
			let url = '';
			if (userId) {
				url = '/trips/user-trips/' + userId;
			} else {
				url = '/trips'
			}

			let result = await getData(url);
			if (result && result.message) {
				swal({
					button: true,
					icon: 'error',
					text: result.message,
					timer: 2500
				});
			} else {
				const data = result.length > 0 ? result : result.model ? result.model : [];
				dispatch(lookupsActions.setLoadedTrips(data));
			}
		} catch (err) {
			dispatch(lookupsActions.loadError(err));
		}
	};
};

export const onLoadSettings = () => {
	return async dispatch => {
		dispatch(lookupsActions.fetchLookupsStart());
		try {
			let result = await getData('/config/');
			if (result && result.message) {
				swal({
					button: true,
					icon: 'error',
					text: result.message,
					timer: 2500
				});
			} else {
				const data = result.model ? result.model[0] : [];
				dispatch(lookupsActions.setSystemSetting(data));
			}
		} catch (err) {
			dispatch(lookupsActions.loadError(err));
		}
	};
};


export default lookupsSlice.reducer;
