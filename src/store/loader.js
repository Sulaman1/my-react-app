import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false
};

const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        
        setLoading(state, action) {
            state.loading = true;
        },
        removeLoading(state) {
            state.loading = false;
        }
    }
});

const loaderActions = loaderSlice.actions;

export const setLoaderOn = () => {

    return dispatch => {
        dispatch(loaderActions.setLoading());
    };
};

export const setLoaderOff = () => {
    return dispatch => {
        dispatch(loaderActions.removeLoading());
    };
};


export default loaderSlice.reducer;