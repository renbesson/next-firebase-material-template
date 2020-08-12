import { useState } from 'react';
import { useRouter } from 'next/router';
import firebase from '../firebase/clientApp';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
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
				alert('User created successfully!');
				router.push('/');
			})
			.catch((error) => {
				console.error('Error creating user: ', error);
			});
	}

	return (
		<Card className={classes.root}>
			<CssBaseline />
			<CardContent>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<FormControl className={classes.form} noValidate>
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
							<Link href="/Login" variant="body2">
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</FormControl>
				{email}
				{password}
			</CardContent>
		</Card>
	);
}
