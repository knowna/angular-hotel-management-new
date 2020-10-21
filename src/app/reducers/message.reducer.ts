import { Action }				from '@ngrx/store';

export function MessageReducer (state: string = 'Hello Woeld', action: Action) {
	switch (action.type) {
		case 'SPANISH':
			return state = 'Hola Mundo';
		case 'FRENCH': 
			return state = 'Bonjour le mode';
		default:
			return state;
	}
}