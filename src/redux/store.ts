import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import userReducer from "./slices/user.slice";
import clientsReducer from "./slices/clients.slice";
import categoriesReducer from "./slices/categories.slice";
import subCategoriesReducer from "./slices/subCategories.slice";
import itemsReducer from "./slices/items.slice";
import quotesReducer from "./slices/quotes.slice";
import {
  useSelector,
  useDispatch,
  type TypedUseSelectorHook,
} from "react-redux";

const customLocalStorage = {
  getItem: (key: string) => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const config = {
  key: "root",
  storage: customLocalStorage,
};

const rootReduces = combineReducers({
  user: userReducer,
  clients: clientsReducer,
  categories: categoriesReducer,
  subCategories: subCategoriesReducer,
  items: itemsReducer,
  quotes: quotesReducer,
});

const persistedReducer = persistReducer(config, rootReduces);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
