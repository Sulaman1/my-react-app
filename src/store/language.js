import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    urdu: false,
    hasVisitor: false
};

const changeLanguage = createSlice({
    name: 'language',
    initialState,
    reducers: {
        seturdu(state) {
            state.urdu = !state.urdu;
        },
        setHasVisitor(state, action) {
            state.hasVisitor = action.payload;
        }
    }
});

const buttonActions = changeLanguage.actions;

export const show = () => {
    return dispatch => {
        dispatch(buttonActions.seturdu());
    };
};

export const setVisitorStatus = (status) => {
    return dispatch => {
        dispatch(buttonActions.setHasVisitor(status));
    };
};

export default changeLanguage.reducer;


