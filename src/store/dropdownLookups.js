import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  countries: [],
};

const lookupSlice = createSlice({
  name: 'dropdownLookups',
  initialState,
  reducers: {
    setDropdownLookups(state, action) {
      return { ...state, ...action.payload };
    },
  },
});
export const { setDropdownLookups } = lookupSlice.actions;
export default lookupSlice.reducer;
