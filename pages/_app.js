import { useEffect } from 'react';
import UserProvider from '../context/userContext';
import Head from 'next/head';
import Nav from '../components/Nav';
import Header from '../components/Header';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	container: {
		marginTop: '32px',
		minHeight: '50vh',
	},
}));

export default function App({ Component, pageProps }) {
	const classes = useStyles();

	useEffect(() => {
		console.log('Nav User:', pageProps);
	}, []);

	return (
		<>
			<Head>
				<title>Next.js w/ Firebase Client-Side</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<header>
				<Header />
			</header>
			<nav style={{ marginBottom: '64px' }}>
				<Nav />
			</nav>
			<main>
				<UserProvider>
					<Container fixed className={classes.container}>
						<Component {...pageProps} />
					</Container>
				</UserProvider>
			</main>
		</>
	);
}
