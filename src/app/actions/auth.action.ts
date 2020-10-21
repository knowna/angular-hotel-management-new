import {Store,Action} from "@ngrx/store"

export const ActionTypes={
    IS_AUTHENTICATED:"[Auth] IsAuthenticated",
    IS_UNAUTHENTICATED:"[Auth] IsUnauthentiated"
}
export class IsAuthenticated implements Action{
    type=ActionTypes.IS_AUTHENTICATED
}
export class IsUnauthentiated implements Action{
    type=ActionTypes.IS_UNAUTHENTICATED
}
export type AuthActions= IsAuthenticated | IsUnauthentiated