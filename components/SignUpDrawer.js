import React from 'react';
import firebase from '@/firebase/clientApp';
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/userContext';
import { Context } from '@/context/storeContext';

import { Avatar, Button, CssBaseline, TextField, FormControlLabel } from '@material-ui/core';
import { Checkbox, Link, Grid, Box, Typography } from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://material-ui.com/">
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
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
	const router = useRouter();
	const { loadingUser, user } = useUser();
	const [state, dispatch] = useContext(Context);
	const [newUser, setNewUser] = useState({
		displayName: '',
		email: '',
		password: '',
	});

	const createUser = async () => {
		await firebase
			.auth()
			.createUserWithEmailAndPassword(newUser.email, newUser.password)
			.then((res) => {
				const userObj = {
					uid: res.user.uid,
					displayName: res.user.displayName,
					email: res.user.email,
					phoneNumber: '',
					shoppingLists: [],
					cart: [],
					orders: [],
					addresses: [],
				};
				firebase.firestore().collection('users').doc(res.user.uid).set(userObj);
				dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'signUpDrawerBoolean' });
				console.log('Signed Up Successfully');

				// Refreshes the page to reload the userContext.js to get the new user's info.
				// setTimeout(() => router.reload(), 500);
			})
			.catch((error) => {
				console.log('Error Signing Up', JSON.stringify(error.message));
			});
	};

	//Toggle between SignUp and SignIn drawers
	const toggleDrawers = async () => {
		await dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'signUpDrawerBoolean' });
		await dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'signInDrawerBoolean' });
	};
	if (!loadingUser && user === null) {
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								autoComplete="displayName"
								name="displayName"
								variant="outlined"
								required
								fullWidth
								id="displayName"
								label="Display Name"
								autoFocus
								onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
								onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
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
							<Link href="#" variant="body2">
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</div>
				<Box mt={5}>
					<Copyright />
				</Box>
			</Container>
		);
	} else {
		return (
			<>
				<Typography>You are already logged in.</Typography>
			</>
		);
	}
}
