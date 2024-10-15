import { combineReducers } from "redux";
import authSlice from "./authSlice";
import userSlice from "./userSlice";
import categorySlice from "./categorySlice";
import productSlice from "./productSlice"
import productDetailSlice from "./productDetailSlice"

const reducers = combineReducers({
    auth : authSlice,
    user : userSlice,
    category : categorySlice,
    product : productSlice,
    productDetail : productDetailSlice,
})
export default reducers