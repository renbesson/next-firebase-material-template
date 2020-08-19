import firebase from '@/firebase/clientApp';
import { useState } from 'react';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle, DialogActions, DialogContent, InputAdornment } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';

const useStyles = makeStyles((theme) => ({
	root: { margin: 'auto' },
	inputRight: {
		textAlign: 'right',
	},
}));

export default function SignIn({ dialogOpen, setDialogOpen }) {
	const classes = useStyles();
	const { loadingUser, user } = useUser();
	const router = useRouter();

	const [newProduct, setNewProduct] = useState({
		name: '',
		description: '',
		price: '',
		quantity: '',
		category: '',
		productCode: '',
		images: [],
	});
	const [images, setImages] = useState([]);

	const createProduct = async () => {
		const hasError = null;
		try {
			const refProducts = firebase.firestore().collection('products');
			await refProducts.add(newProduct).then((doc) => {
				refProducts.doc(doc.id).update({
					id: doc.id,
				});
				if (images.length > 0) {
					images.forEach((file, index) => {
						const fileName = `${doc.id}-${index}.jpg`;
						const path = `products/${doc.id}/images/${fileName}`;
						const refImages = firebase.storage().ref().child(path);
						refImages.put(file).then((snapshot) => {
							snapshot.ref.getDownloadURL().then((URL) => {
								refProducts.doc(doc.id).update({
									images: firebase.firestore.FieldValue.arrayUnion({
										url: URL,
										fileName: fileName,
									}),
								});
							});
						});
					});
				}
			});
		} catch (error) {
			console.error(error);
			hasError = true;
		} finally {
			if (!hasError) {
				alert('Product created successfully!');
				setDialogOpen(false);
			}
		}
	};

	// Finishes firebase onAuthStateChanged and didn't find any user
	if (!loadingUser && user) {
		return (
			<Dialog
				className={classes.root}
				onClose={() => setDialogOpen(false)}
				aria-labelledby="customized-dialog-title"
				open={dialogOpen}
			>
				<DialogTitle>Create New Product</DialogTitle>
				<DialogContent>
					<FormControl>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									id="name"
									label="Name"
									variant="outlined"
									className={classes.textField}
									inputProps={{ maxLength: 90 }}
									fullWidth
									value={newProduct.name}
									onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									id="description"
									label="Description"
									variant="outlined"
									className={classes.textField}
									multiline
									rows={10}
									fullWidth
									value={newProduct.description}
									onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField
									id="price"
									label="Price"
									variant="outlined"
									type="number"
									className={(classes.textField, classes.inputRight)}
									fullWidth
									inputProps={{ style: { textAlign: 'center' } }}
									InputProps={{
										startAdornment: <InputAdornment position="start">$</InputAdornment>,
									}}
									value={newProduct.price}
									onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField
									id="quantity"
									label="Quantity"
									variant="outlined"
									type="number"
									className={classes.textField}
									fullWidth
									value={newProduct.quantity}
									onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField
									id="category"
									label="Category"
									variant="outlined"
									className={classes.textField}
									fullWidth
									value={newProduct.category}
									onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField
									id="productCode"
									label="Product Code"
									variant="outlined"
									className={classes.textField}
									fullWidth
									value={newProduct.productCode}
									onChange={(e) => setNewProduct({ ...newProduct, productCode: e.target.value })}
								/>
							</Grid>
							<Grid item xs={12}>
								<DropzoneArea
									acceptedFiles={['image/*']}
									dropzoneText={'Image upload available on product edit'}
									filesLimit={6}
									onChange={(files) => setImages(files)}
								/>
							</Grid>
						</Grid>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" color="primary" onClick={createProduct}>
						Create
					</Button>
					<Button variant="contained" onClick={() => setDialogOpen(false)}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
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
