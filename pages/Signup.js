import firebase from '@/firebase/clientApp';
import { useState } from 'react';
import { useUser } from '../context/userContext';
import { useRouter } from 'next/router';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
	root: { width: '500px', margin: 'auto' },
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignUp() {
	const classes = useStyles();
	const { loadingUser, user } = useUser();

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const router = useRouter();

	async function createUser() {
		await firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((res) => {
				res.user.updateProfile({
					displayName: `${firstName} ${lastName}`,
				});
				const userObj = { uid: res.user.uid, email: res.user.email, displayName: `${firstName} ${lastName}` };
				firebase.firestore().collection('users').doc(res.user.uid).set(userObj);
				alert('User created successfully!');
				router.push('/');
			})
			.catch((error) => {
				console.error('Error creating user: ', error);
			});
	}

	// Finishes firebase onAuthStateChanged and didn't find any user
	if (!loadingUser && user === null) {
		return (
			<Card className={classes.root}>
				<CardContent>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					<FormControl className={classes.form}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="given-name"
									name="firstName"
									id="firstName"
									label="First Name"
									variant="outlined"
									required
									fullWidth
									autoFocus
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="family-name"
									name="lastName"
									id="lastName"
									label="Last Name"
									variant="outlined"
									required
									fullWidth
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									autoComplete="email"
									name="email"
									id="email"
									label="Email Address"
									variant="outlined"
									required
									fullWidth
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									autoComplete="new-password"
									name="password"
									id="password"
									label="Password"
									variant="outlined"
									required
									fullWidth
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<FormControlLabel
									control={<Checkbox value="allowExtraEmails" color="primary" />}
									label="I want to receive inspiration, marketing promotions and updates via email."
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={createUser}
						>
							Sign Up
						</Button>
						<Grid container justify="flex-end">
							<Grid item>
								<Link href="/SignIn/" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</FormControl>
				</CardContent>
			</Card>
		);
		// Finishes firebase onAuthStateChanged and a user is found
	} else if (user) {
		setTimeout(() => {
			router.push('/');
		}, 2000);
		return (
			<>
				<Typography component="h1" variant="h5">
					You are already logged in. Redirecting to the home page...
				</Typography>
			</>
		);
		// // While firebase onAuthStateChanged is loading
	} else {
		return <></>;
	}
}
