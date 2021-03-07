import React, { createContext, useReducer } from 'react';
import reducers from '@context/reducers';

const initialState = {
	signInDrawerBoolean: false,
	signUpDrawerBoolean: false,
	profileDrawerBoolean: false,
	error: null,
};

const StoreContext = ({ children }) => {
	const [state, dispatch] = useReducer(reducers, initialState);
	return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>;
};

export const Context = createContext(initialState);
export default StoreContext;
