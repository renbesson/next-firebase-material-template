import UserProvider from '@/context/userContext';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import Header from '@/components/Header';
import Container from '@material-ui/core/Container';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import theme from '@theme';

// Fuego
import { Fuego, FuegoProvider } from '@nandorojo/swr-firestore';

//Global variables
import StoreProvider from '@context/storeContext';

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

	return (
		<FuegoProvider fuego={fuego}>
			<UserProvider>
				<StoreProvider>
					<ThemeProvider theme={theme}>
						<Head>
							<title>Next.js w/ Firebase Client-Side</title>
							<link rel="icon" href="/favicon.ico" />
						</Head>
						<nav style={{ marginBottom: '64px' }}>
							<Header></Header>
						</nav>
						<main>
							<Container fixed className={classes.container}>
								<CssBaseline />
								<Component {...pageProps} />
							</Container>
						</main>
					</ThemeProvider>
				</StoreProvider>
			</UserProvider>
		</FuegoProvider>
	);
}
