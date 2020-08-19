import UserProvider from '@/context/userContext';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import Nav from '../components/Nav';
import Header from '../components/Header';
import Container from '@material-ui/core/Container';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import theme from '@theme';

// admin
import clsx from 'clsx';
import NavAdmin from '@/components/admin/NavAdmin';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
	toolbarIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	menuButtonHidden: {
		display: 'none',
	},
	title: {
		flexGrow: 1,
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9),
		},
	},
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto',
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
		minHeight: '50vh',
		backgroundColor: theme.palette.background.default,
	},
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column',
	},
	fixedHeight: {
		height: 240,
	},
}));

export default function App({ Component, pageProps }) {
	const classes = useStyles();

	const [open, setOpen] = React.useState(true);
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

	if (Component.AdminLayout) {
		return (
			<div className={classes.root}>
				<ThemeProvider theme={theme}>
					<UserProvider>
						<NavAdmin />
					</UserProvider>
					<main className={classes.content}>
						<div className={classes.appBarSpacer} />
						<Container fixed className={classes.container}>
							<UserProvider>
								<CssBaseline />
								<Component {...pageProps} />
							</UserProvider>
						</Container>
					</main>
				</ThemeProvider>
			</div>
		);
	}

	return (
		<>
			<ThemeProvider theme={theme}>
				<Head>
					<title>Next.js w/ Firebase Client-Side</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<header>
					<Header />
				</header>
				<nav style={{ marginBottom: '64px' }}>
					<UserProvider>
						<Nav />
					</UserProvider>
				</nav>
				<main>
					<Container fixed className={classes.container}>
						<UserProvider>
							<CssBaseline />
							<Component {...pageProps} />
						</UserProvider>
					</Container>
				</main>
			</ThemeProvider>
		</>
	);
}
