import {AuthActions} from "../actions/auth.action";
import { ActionTypes } from '../actions/auth.action';

export interface State{
    IsAuthenticated:boolean;
}
const initialState:State ={
    IsAuthenticated:null
};

export function authReducer(state= initialState,action:AuthActions){
    switch(action.type){
        case(ActionTypes.IS_AUTHENTICATED):
        return{
            IsAuthenticated:true
        }
        case(ActionTypes.IS_UNAUTHENTICATED):
        return {
            IsAuthenticated:false
        }
        default:
            return state
    }
}
export const getIsAuthenticated=(state:State)=>state.IsAuthenticated;