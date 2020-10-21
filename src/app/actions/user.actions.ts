import { Action }			from '@ngrx/store';
import { User }			from '../Model/user.model';

// User Action Types defination
export const ActionTypes = {
	// Loading Users
	LOAD:			 	'[User] -> Load (requested)',
	LOAD_COMPLETED:  	'[User] -> Load (completed)',
	LOAD_ERROR:		 	'[User] -> Load (error)'
}

// User Actions defination
// Load payload for single user
export class UserPayLoad {
	constructor (public user: User) {}
}

// Load ---------------------------------------------
// Load action for user
export class LoadAction implements Action {
	// Variables
	type = ActionTypes.LOAD;

	// Constructor
	constructor (public payload: any = null) {}
}

// On successful load of users
export class LoadCompletedAction implements Action {
	// Variables
	type = ActionTypes.LOAD_COMPLETED;

	// Constructor
	constructor (public payload: UserPayLoad) {}
}

// On unsuccessful load of users
export class LoadErrorAction implements Action {
	// Variables
	type = ActionTypes.LOAD_ERROR;

	// Constructor
	constructor (public payload: string) {}
}

// Export User(s) Actions
export type UserAction 
	= LoadAction 
	| LoadCompletedAction 
	| LoadErrorAction;






