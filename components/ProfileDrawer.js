import React from 'react';
import firebase from '@/firebase/clientApp';
import { useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/userContext';
import { Context } from '@/context/storeContext';

import { Avatar, Button, CssBaseline, TextField, FormControlLabel } from '@material-ui/core';
import { Checkbox, Link, Grid, Box, Typography } from '@material-ui/core';

import PermIdentityOutlined from '@material-ui/icons/PermIdentityOutlined';

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
	const { loadingUser, user } = useUser();
	const [state, dispatch] = useContext(Context);

	const [editedUser, setEditedUser] = useState({
		displayName: user.displayName,
		email: user.email,
		phoneNumber: user.phoneNumber,
	});

	const usersRef = firebase.firestore().collection('users');
	const currentUser = firebase.auth().currentUser;

	//Prevent to update user if there's no changes
	const hasChange = () => {
		if (
			editedUser.displayName === user.displayName &&
			editedUser.email === user.email &&
			editedUser.phoneNumber === user.phoneNumber
		)
			return false;
		else return true;
	};

	const resetPassword = async () => {
		firebase
			.auth()
			.sendPasswordResetEmail(user.email)
			.then(function () {
				console.log(`Password reset email sent to ${user.email}!`);
			})
			.catch(function (error) {
				console.log(`Error reseting password: ${error.message}`);
			});
	};

	const editUser = async () => {
		let hasError = null;
		try {
			await usersRef
				.doc(user.uid)
				.update(editedUser)
				.then(() => {
					currentUser.updateProfile(editedUser);
				});
		} catch (error) {
			console.log(`Error Updating User: ${error}`);
			console.error(error);
		} finally {
			if (!hasChange()) {
				console.log(`User "${user.displayName}" has no change to update.`);
			}
			if (!hasError && hasChange()) {
				console.log(`User "${user.displayName}" has been updated successfully.`);
			}
		}
	};

	if (!loadingUser && user) {
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<PermIdentityOutlined />
					</Avatar>
					<Typography component="h1" variant="h5">
						Profile
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								name="displayName"
								variant="outlined"
								required
								fullWidth
								id="displayName"
								label="Display Name"
								autoFocus
								defaultValue={user.displayName}
								onChange={(e) => setEditedUser({ ...editedUser, displayName: e.target.value })}
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
								defaultValue={user.email}
								onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="phoneNumber"
								label="Phone Number"
								id="phoneNumber"
								defaultValue={user.phoneNumber}
								onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })}
							/>
						</Grid>
						<Grid item xs={6}>
							<Button
								fullWidth
								variant="contained"
								color="secondary"
								className={classes.submit}
								onClick={resetPassword}
							>
								Reset Password
							</Button>
						</Grid>
						<Grid item xs={6}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={editUser}
							>
								Save Changes
							</Button>
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
				<Typography>You are not logged in!</Typography>
			</>
		);
	}
}
