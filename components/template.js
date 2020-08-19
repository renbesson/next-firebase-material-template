import firebase from '@/firebase/clientApp';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme) => ({
	root: { width: '500px', margin: 'auto' },
}));

export default function SignIn() {
	const classes = useStyles();
	const { loadingUser, user } = useUser();
	const router = useRouter();

	// Finishes firebase onAuthStateChanged and didn't find any user
	if (!loadingUser && user) {
		return (
			<Card className={classes.root}>
				<CardContent></CardContent>
			</Card>
		);
		// Finishes firebase onAuthStateChanged and a user is found
	} else if (!loadingUser && !user) {
		setTimeout(() => {
			router.push('/SignIn');
		}, 2000);
		return (
			<Typography component="h1" variant="h5">
				You are NOT signed in. Redirecting to the sign in page...
			</Typography>
		);
		// // While firebase onAuthStateChanged is loading
	} else {
		return <></>;
	}
}
