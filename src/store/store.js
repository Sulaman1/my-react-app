// store/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // or sessionStorage if needed

// 🔹 Import your slices here
import notificationReducer from './notificationSlice';
import roleReducer from './roleSlice';
// add other reducers here

// 🔹 Combine reducers
const rootReducer = combineReducers({
  notification: notificationReducer,
  role: roleReducer,
  // add other slices here
});

// 🔹 Configure redux-persist
const persistConfig = {
  key: 'root',
  storage,
  // choose which slices to persist
  whitelist: ['notification', 'role'],
};

// 🔹 Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Configure store with middleware ignoring redux-persist actions
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // devTools: process.env.NODE_ENV !== 'production'
});

export default store;



// import { configureStore } from '@reduxjs/toolkit';
// import rootReducer from './rootReducer';
// import storage from 'redux-persist/lib/storage'
// import {combineReducers} from "redux"; 
// import { persistReducer, FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER } from 'redux-persist'

// // reducers
// import authReducer from './auth';
// import lookupsReducer from './lookups';
// import userMeta from './userMeta';
// import loaderReducer from './loader';
// import notificationSlice from './notificationSlice'
// import languageReducer from './language';
// import dropdownLookups from './dropdownLookups';
// import roleReducer from './roleSlice';

// const reducers = combineReducers({
// 		auth: authReducer,
// 		lookups: lookupsReducer,
// 		user: userMeta,
// 		loader: loaderReducer,
// 		notification: notificationSlice,
// 		language: languageReducer,
// 		dropdownLookups: dropdownLookups,
// 		role: roleReducer,
// });

// const persistConfig = {
// 	key: 'root',
// 	version: 1,
// 	storage,
// };

// const persistedReducer = persistReducer(persistConfig, reducers);


// // const store = configureStore({
// // 	reducer: rootReducer,
// // 	middleware: getDefaultMiddleware({
// // 		serializableCheck: false,
// // 	}),
// // });

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     //user: userReducer,
//   },
//   // no middleware property → uses defaults automatically
// });

// // const store = configureStore({
// //   reducer: persistedReducer,
// //   middleware: (getDefaultMiddleware) =>
// //     getDefaultMiddleware({
// //       serializableCheck: false,
// //     }),
// // });

// export default store;
