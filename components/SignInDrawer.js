import React from 'react';
import firebase from '@/firebase/clientApp';
import { useState, useContext, useEffect } from 'react';
import { useUser } from '@/context/userContext';
import { Context } from '@/context/storeContext';

import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import { Link, Grid, Box } from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
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
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignIn() {
	const classes = useStyles();
	const { loadingUser, user } = useUser();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [state, dispatch] = useContext(Context);

	const signInUser = async () => {
		await firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((res) => {
				dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'signInDrawerBoolean' });
				console.log('Signed In Successfully');
			})
			.catch((error) => {
				console.log('Error Logging In');
			});
	};

	const toggleDrawers = () => {
		dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'signInDrawerBoolean' });
		dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'signUpDrawerBoolean' });
	};

	const toggleDrawer = (open) => (event) => {
		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		dispatch({ type: 'TOGGLE_BOOLEAN', boolean: 'signInDrawerBoolean' });
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
						Sign in
					</Typography>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						onChange={() => setEmail(event.target.value)}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						onChange={() => setPassword(event.target.value)}
					/>
					<FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={signInUser}
					>
						Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<Link href="#" variant="body2">
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							<Link href="#" variant="body2" onClick={toggleDrawers}>
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</div>
				<Box mt={8}>
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
