import { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useCollection } from '@nandorojo/swr-firestore';

const useStyles = makeStyles((theme) => ({}));

export default function Home() {
	// Our custom hook to get context values
	const classes = useStyles();
	const theme = useTheme();
	const { loadingUser, user } = useUser();

	useEffect(() => {
		if (!loadingUser) {
			// You know that the user is loaded: either logged in or out!
			// console.log(user);
		}
		// You also have your firebase app initialized
	}, [loadingUser, user]);

	const { data: products, loading, error } = useCollection('products');

	return <h1>TEST</h1>;
}
