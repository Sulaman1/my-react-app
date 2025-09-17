import { createSlice, current } from '@reduxjs/toolkit'

const initialState = {
  notes: [],
  notifications: []
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { ...initialState },
  reducers: {
    addNotification: (state, action) => {
      const items = [current(state).notes];

      items.push(action.payload);
      state.notes = items;

      const notification = [...current(state).notifications];
      notification.push(action.payload);
      state.notifications = notification;
    },
    removeNotification(state, action) {
      const items = [current(state).notes];
      const index = items.findIndex(item => item.message === action.payload.message);
      if (index > -1) {
        items.splice(index, 1);
      }
      state.notes = items;
    },
    storeAllNotifications: (state, action) => {
      const items = action.payload
      state.notifications = items;
    }
  }
});

export default notificationSlice.reducer;

const notificationAction = notificationSlice.actions;

export const setNotificationItem = (payload) => {
  return async dispatch => {
    dispatch(notificationAction.addNotification(payload));
  };
};

export const removeNotificationItem = (payload) => {
  return async dispatch => {
    dispatch(notificationAction.removeNotification(payload));
  };
};

export const storeNotifications = (payload) => {
  return async dispatch => {
    dispatch(notificationAction.storeAllNotifications(payload));
  };
};