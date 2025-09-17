import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentRole: null,
  availableRoles: [],
  isRoleModalOpen: false,
  authData: null,
  roleChanged: false,
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setCurrentRole: (state, action) => {
      state.currentRole = action.payload;
      state.roleChanged = true;
    },
    setAvailableRoles: (state, action) => {
      state.availableRoles = action.payload;
    },
    setRoleModalOpen: (state, action) => {
      state.isRoleModalOpen = action.payload;
    },
    setAuthData: (state, action) => {
      state.authData = action.payload;
    },
    resetRoleChanged: (state) => {
      state.roleChanged = false;
    },
  },
});

export const { setCurrentRole, setAvailableRoles, setRoleModalOpen, setAuthData, resetRoleChanged } = roleSlice.actions;
export default roleSlice.reducer;