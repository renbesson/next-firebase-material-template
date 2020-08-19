import firebase from '@/firebase/clientApp';
import { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ProductCard from '../components/ProductCard';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({}));

export default function Home(props) {
	// Our custom hook to get context values
	const classes = useStyles();
	const theme = useTheme();
	const { loadingUser, user } = useUser();

	const [products, setProducts] = useState([]);

	useEffect(() => {
		if (!loadingUser) {
			// You know that the user is loaded: either logged in or out!
			// console.log(user);
		}
		// You also have your firebase app initialized
		// console.log(firebase);
	}, [loadingUser, user]);

	useEffect(() => {
		const refProducts = firebase.firestore().collection('products');

		try {
			const unsubscribe = refProducts.get().then((snapshot) => {
				snapshot.forEach((doc) => {
					const productExists = products.some((product) => product.id === doc.id);
					console.log(productExists, 'docID: ', doc.id);
					if (products.length === 0 || !productExists) {
						setProducts((prevProducts) => [...prevProducts, doc.data()]);
					}
				});
			});
		} catch (error) {
			console.error(error);
		}

		return;
	}, []);

	const ProductsGrid = () => {
		if (products.length > 0) {
			return (
				<Grid container spacing={2}>
					{products.map((product) => {
						return (
							<Grid item xs key={product.id}>
								<ProductCard productData={product} />
							</Grid>
						);
					})}
				</Grid>
			);
		} else {
			return (
				<Grid container spacing={2}>
					<Typography component="h1" variant="h5">
						No products to show.
					</Typography>
				</Grid>
			);
		}
	};

	return <ProductsGrid />;
}
