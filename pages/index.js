import { useEffect } from 'react';
import { useUser } from '../context/userContext';
import firebase from '../firebase/clientApp';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ProductCard from '../components/ProductCard';

const useStyles = makeStyles((theme) => ({}));

export default function Home(props) {
	// Our custom hook to get context values
	const classes = useStyles();
	const { loadingUser, user } = useUser();

	useEffect(() => {
		console.log('Props222: ', props);
		if (!loadingUser) {
			// You know that the user is loaded: either logged in or out!
			console.log(user);
		}
		// You also have your firebase app initialized
		console.log(firebase);
	}, [loadingUser, user]);
	return (
		<Grid container spacing={2}>
			<Grid item xs={3}>
				<ProductCard />
			</Grid>
			<Grid item xs={3}>
				<ProductCard />
			</Grid>
			<Grid item xs={3}>
				<ProductCard />
			</Grid>
			<Grid item xs={3}>
				<ProductCard />
			</Grid>
			<Grid item xs={3}>
				<ProductCard />
			</Grid>
		</Grid>
	);
}
