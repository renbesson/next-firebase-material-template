import { useState, useEffect } from 'react';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/router';
import { fade, makeStyles } from '@material-ui/core/styles';
import firebase from '@/firebase/clientApp';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import NewProductDialog from '@components/admin/NewProductDialog';
import EditProductDialog from '@components/admin/EditProductDialog';
import ProductCardEdit from '@components/admin/ProductCardEdit';
import { Card, CardActionArea } from '@material-ui/core';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

const useStyles = makeStyles((theme) => ({
	card: { width: '800px', margin: 'auto' },
	addCard: {
		height: 150,
		minWidth: 280,
	},
	addIconSize: {
		width: '150px',
		height: '150px',
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.black, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.black, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	},
	textField: {
		width: '100%',
	},
}));

Products.AdminLayout = true;

export default function Products() {
	const classes = useStyles();
	const { loadingUser, user } = useUser();
	const router = useRouter();

	const [newDialogOpen, setNewDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editedProductIndex, setEditedProductIndex] = useState();
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const refProducts = firebase.firestore().collection('products');

		const unsubscribe = refProducts.onSnapshot((querySnapshot) => {
			querySnapshot.docChanges().forEach((change) => {
				if (!products.some((product) => product.id === change.doc.id)) {
					if (change.type === 'added') {
						setProducts((prevProducts) => [...prevProducts, change.doc.data()]);
					} else if (change.type === 'modified') {
						setProducts((prevProducts) => {
							let newProducts = [...prevProducts];
							const productIndex = newProducts.findIndex((product) => product.id === change.doc.id);
							newProducts.splice(productIndex, 1, change.doc.data());
							return newProducts;
						});
					} else if (change.type === 'removed') {
						setProducts((prevProducts) => {
							let newProducts = [...prevProducts];
							const productIndex = newProducts.findIndex((product) => product.id === change.doc.id);
							newProducts.splice(productIndex, 1);
							return newProducts;
						});
					}
				}
			});
		});
		return () => unsubscribe();
	}, []);

	const ProductsGrid = () => {
		return (
			<Grid container spacing={2}>
				<Grid item xs>
					<Card className={classes.addCard}>
						<CardActionArea onClick={() => setNewDialogOpen(true)}>
							<AddRoundedIcon className={classes.addIconSize} />
						</CardActionArea>
					</Card>
				</Grid>
				{products.map((product) => {
					if (product.id) {
						return (
							<Grid item xs key={product.id}>
								<Card>
									<CardActionArea
										onClick={() => {
											setEditDialogOpen(true);
											setEditedProductIndex(products.findIndex((item) => item === product));
										}}
									>
										<ProductCardEdit productData={product} />
									</CardActionArea>
								</Card>
							</Grid>
						);
					}
				})}
				<Grid item xs>
					<EditProductDialog
						dialogOpen={editDialogOpen}
						setDialogOpen={setEditDialogOpen}
						productData={products[editedProductIndex]}
					/>
				</Grid>
			</Grid>
		);
	};

	// Finishes firebase onAuthStateChanged and didn't find any user
	if (!loadingUser && user) {
		return (
			<>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<SearchIcon />
							</div>
							<InputBase
								placeholder="Search…"
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput,
								}}
								inputProps={{ 'aria-label': 'search' }}
							/>
						</div>
					</Grid>
					<Grid item xs={12}>
						<NewProductDialog dialogOpen={newDialogOpen} setDialogOpen={setNewDialogOpen} />
					</Grid>
				</Grid>
				<ProductsGrid />
			</>
		);
		// Finishes firebase onAuthStateChanged and a user is found
	} else if (!loadingUser && !user) {
		setTimeout(() => {
			router.push('/SignIn');
		}, 2000);
		return (
			<Typography component="h1" variant="h5">
				You are NOT signed in. Redirecting to the sign in page...
			</Typography>
		);
		// // While firebase onAuthStateChanged is loading
	} else {
		return <></>;
	}
}
