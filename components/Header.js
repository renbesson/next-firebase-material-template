import firebase from '@/firebase/clientApp';
import React from 'react';
import { useState, useContext } from 'react';
import { useUser } from '../context/userContext';
import { Context } from '@/context/storeContext';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton, Switch } from '@material-ui/core';
import { FormControlLabel, FormGroup, MenuItem, Menu } from '@material-ui/core';
import { Container, SwipeableDrawer, Button } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

import SignUpDrawer from '@/components/SignUpDrawer';
import SignInDrawer from '@/components/SignInDrawer';
import ProfileDrawer from '@/components/ProfileDrawer';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));

export default function Header() {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const { loadingUser, user } = useUser();
	const [state, dispatch] = useContext(Context);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const toggleDrawer = (drawer) => (event) => {
		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		dispatch({ type: 'TOGGLE_BOOLEAN', boolean: drawer });
	};

	const onSignOut = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
				console.log(`Signed out successfully.`);
			})
			.catch((e) => {
				console.error(e);
			});
	};

	const MenuItemsSignedOut = [
		<MenuItem key="0" onClick={toggleDrawer('signInDrawerBoolean')}>
			Sign In
		</MenuItem>,
		<MenuItem key="1" onClick={toggleDrawer('signUpDrawerBoolean')}>
			Sign Up
		</MenuItem>,
	];

	const MenuItemsSignedIn = [
		<MenuItem key="0" onClick={toggleDrawer('profileDrawerBoolean')}>
			Profile
		</MenuItem>,
		<MenuItem key="1" onClick={onSignOut}>
			Sign Out
		</MenuItem>,
	];

	return (
		<div className={classes.root}>
			<SwipeableDrawer
				anchor="right"
				open={state.signUpDrawerBoolean}
				onClose={toggleDrawer('signUpDrawerBoolean')}
				onOpen={toggleDrawer('signUpDrawerBoolean')}
			>
				<SignUpDrawer />
			</SwipeableDrawer>

			<SwipeableDrawer
				anchor="right"
				open={state.signInDrawerBoolean}
				onClose={toggleDrawer('signInDrawerBoolean')}
				onOpen={toggleDrawer('signInDrawerBoolean')}
			>
				<SignInDrawer />
			</SwipeableDrawer>

			<SwipeableDrawer
				anchor="right"
				open={state.profileDrawerBoolean}
				onClose={toggleDrawer('profileDrawerBoolean')}
				onOpen={toggleDrawer('profileDrawerBoolean')}
			>
				<ProfileDrawer />
			</SwipeableDrawer>

			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						{user ? `${user.displayName} (${user.email})` : 'Guest'}
					</Typography>
					{
						<div>
							<IconButton
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleMenu}
								color="inherit"
							>
								<AccountCircle />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={open}
								onClose={handleClose}
							>
								{!loadingUser && !user && MenuItemsSignedOut}
								{!loadingUser && user && MenuItemsSignedIn}
							</Menu>
						</div>
					}
				</Toolbar>
			</AppBar>
		</div>
	);
}
