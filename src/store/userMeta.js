import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	role: 'Super Admin',
	permissions: []
};

export const userMeta = createSlice({
	name: 'user',
	initialState: { ...initialState },
	reducers: {
		setPermissions: (state, action) => {
			console.log('setPermissions', action.payload);
			state.permissions = action.payload;
		},
		setRole: (state, action) => {
			state.role = action.payload
		},
		setUserAccess: (state, action) => {
			console.log('setUserAccess', action.payload);
			state.access = action.payload
		},
		clearUserMeta: () => {
			return initialState;
		}
	}
});

export const userMetaActions = userMeta.actions;

export default userMeta.reducer;

export const setPermissionsInRedux = data => {
	return dispatch => {
		dispatch(userMetaActions.setPermissions(data));
	};
};

export const setUserAccessRights = data => {
	return dispatch => {
		dispatch(userMetaActions.setUserAccess(data));
	};
}

export const setRoleInRedux = data => {
	return dispatch => {
		dispatch(userMetaActions.setRole(data));
	};
};
