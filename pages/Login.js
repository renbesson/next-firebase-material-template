import { useState, useEffect } from 'react';
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

const useStyles = makeStyles((theme) => ({
	root: { width: '500px', margin: 'auto' },
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

export default function SignIn(props) {
	const classes = useStyles();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const router = useRouter();

	async function loginUser() {
		console.log('sdsadas', email, password);
		await firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((res) => {
				alert(`User ${res.user.displayName} logged successfully!`);
				router.push('/');
			})
			.catch((error) => {
				console.error('Error login user: ', error);
			});
	}

	useEffect(() => {
		console.log('Nav Useghfgr:', props);
	}, []);

	return (
		<Card className={classes.root}>
			<CssBaseline />
			<CardContent>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<form className={classes.form} noValidate>
					<TextField
						autoComplete="email"
						name="email"
						id="email"
						label="Email Address"
						variant="outlined"
						margin="normal"
						required
						fullWidth
						autoFocus
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<TextField
						autoComplete="current-password"
						name="password"
						id="password"
						label="Password"
						variant="outlined"
						margin="normal"
						required
						fullWidth
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={loginUser}
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
							<Link href="/Signup" variant="body2">
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</form>
			</CardContent>
		</Card>
	);
}
