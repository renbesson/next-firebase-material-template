import UserProvider from '@/context/userContext';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import Nav from '../components/Nav';
import Container from '@material-ui/core/Container';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import theme from '@theme';

// admin
import clsx from 'clsx';
import NavAdmin from '@/components/admin/NavAdmin';

// Fuego
import { Fuego, FuegoProvider } from '@nandorojo/swr-firestore';

const clientCredentials = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const fuego = new Fuego(clientCredentials);

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto',
	},
	container: {
		maxWidth: '1200px',
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
		minHeight: '50vh',
		backgroundColor: theme.palette.background.default,
	},
}));

export default function App({ Component, pageProps }) {
	const classes = useStyles();

	if (Component.AdminLayout) {
		return (
			<div className={classes.root}>
				<FuegoProvider fuego={fuego}>
					<UserProvider>
						<ThemeProvider theme={theme}>
							<NavAdmin />
							<main className={classes.content}>
								<div className={classes.appBarSpacer} />
								<Container fixed className={classes.container}>
									<CssBaseline />
									<Component {...pageProps} />
								</Container>
							</main>
						</ThemeProvider>
					</UserProvider>
				</FuegoProvider>
			</div>
		);
	}

	return (
		<FuegoProvider fuego={fuego}>
			<UserProvider>
				<ThemeProvider theme={theme}>
					<Head>
						<title>Next.js w/ Firebase Client-Side</title>
						<link rel="icon" href="/favicon.ico" />
					</Head>
					<nav style={{ marginBottom: '64px' }}>
						<Nav />
					</nav>
					<main>
						<Container fixed className={classes.container}>
							<CssBaseline />
							<Component {...pageProps} />
						</Container>
					</main>
				</ThemeProvider>
			</UserProvider>
		</FuegoProvider>
	);
}
