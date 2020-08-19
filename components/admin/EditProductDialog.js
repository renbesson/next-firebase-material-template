import firebase from '@/firebase/clientApp';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {
	DialogTitle,
	DialogActions,
	DialogContent,
	InputAdornment,
	GridList,
	GridListTile,
	GridListTileBar,
	IconButton,
} from '@material-ui/core';
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';
import { DropzoneArea } from 'material-ui-dropzone';

const useStyles = makeStyles((theme) => ({
	root: { margin: 'auto' },
	inputRight: {
		textAlign: 'right',
	},
	gridList: {
		flexWrap: 'nowrap',
		// Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
		transform: 'translateZ(0)',
	},
	gridListTile: { border: '2px dashed' },
}));

export default function SignIn({ dialogOpen, setDialogOpen, productData }) {
	const classes = useStyles();
	const { loadingUser, user } = useUser();
	const router = useRouter();

	const [editedProduct, setEditedProduct] = useState({});
	const [images, setImages] = useState([]);

	const refProducts = firebase.firestore().collection('products');
	const refImages = firebase.storage().ref();

	const deleteImage = async (fileName) => {
		const path = `products/${productData.id}/images/${fileName}`;
		refImages
			.child(path)
			.delete()
			.then(() => {
				const imageItem = productData.images.find((image) => image.fileName === fileName);
				if (productData.images.length > 1) {
					refProducts.doc(productData.id).update({
						images: firebase.firestore.FieldValue.arrayRemove(imageItem),
					});
				} else {
					refProducts.doc(productData.id).update({
						images: firebase.firestore.FieldValue.delete(),
					});
				}
			});
	};

	useEffect(() => {
		if (images.length > 0) {
			images.forEach((file) => {
				const path = `products/${productData.id}/images/${file.path}`;
				refImages
					.child(path)
					.put(file)
					.then((snapshot) => {
						snapshot.ref.getDownloadURL().then((URL) => {
							refProducts.doc(productData.id).update({
								images: firebase.firestore.FieldValue.arrayUnion({
									url: URL,
									fileName: file.path,
								}),
							});
						});
					});
			});
		}
		return () => {};
	}, [images]);

	const editProduct = async () => {
		await refProducts
			.doc(productData.id)
			.update(editedProduct)
			.then((doc) => {
				setDialogOpen(false);
				alert('Product created successfully!');
			})
			.catch((error) => {
				alert('Error updating product!');
				console.error(error);
			});
	};

	const deleteProduct = async () => {
		await refProducts
			.doc(productData.id)
			.delete()
			.then(() => {
				setDialogOpen(false);
				alert('Product deleted successfully!');
				if (productData.images.length > 0) {
					productData.images.forEach((image) => {
						refImages
							.child(`products/${productData.id}/images/${image.fileName}`)
							.delete()
							.catch((error) => {
								alert(`Error deleting product's image!`);
								console.error(error);
							});
					});
				}
			})
			.catch((error) => {
				alert('Error deleting product!');
				console.error(error);
			});
	};

	const ImagesList = () => {
		if (productData.images) {
			let list = [];
			productData.images.forEach((image) => {
				list.push(
					<GridListTile key={image.fileName} className={classes.gridListTile}>
						<img src={image.url} alt={image.fileName} />
						<GridListTileBar
							title={image.fileName}
							actionIcon={
								<IconButton
									aria-label={`star ${image.fileName}`}
									onClick={() => deleteImage(image.fileName)}
								>
									<CancelPresentationOutlinedIcon color="secondary" />
								</IconButton>
							}
						/>
					</GridListTile>
				);
			});
			return (
				<Grid item xs={12}>
					<GridList className={classes.gridList} cols={2.5}>
						{list}
					</GridList>
				</Grid>
			);
		} else {
			return <></>;
		}
	};

	// Finishes firebase onAuthStateChanged and didn't find any user
	if (!loadingUser && user && productData) {
		return (
			<Dialog
				className={classes.root}
				onClose={() => setDialogOpen(false)}
				aria-labelledby="customized-dialog-title"
				open={dialogOpen}
			>
				<DialogTitle>Edit Product</DialogTitle>
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
									value={editedProduct.name === undefined ? productData.name : editedProduct.name}
									onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
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
									value={
										editedProduct.description === undefined
											? productData.description
											: editedProduct.description
									}
									onChange={(e) =>
										setEditedProduct({ ...editedProduct, description: e.target.value })
									}
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
									value={editedProduct.price === undefined ? productData.price : editedProduct.price}
									onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
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
									value={
										editedProduct.quantity === undefined
											? productData.quantity
											: editedProduct.quantity
									}
									onChange={(e) => setEditedProduct({ ...editedProduct, quantity: e.target.value })}
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField
									id="category"
									label="Category"
									variant="outlined"
									className={classes.textField}
									fullWidth
									value={
										editedProduct.category === undefined
											? productData.category
											: editedProduct.category
									}
									onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField
									id="productCode"
									label="Product Code"
									variant="outlined"
									className={classes.textField}
									fullWidth
									value={
										editedProduct.productCode === undefined
											? productData.productCode
											: editedProduct.productCode
									}
									onChange={(e) =>
										setEditedProduct({ ...editedProduct, productCode: e.target.value })
									}
								/>
							</Grid>
							<Grid item xs={12}>
								<DropzoneArea
									acceptedFiles={['image/*']}
									dropzoneText={'Drag and drop an image here or click'}
									filesLimit={6}
									onChange={(files) => setImages(files)}
								/>
							</Grid>
							<ImagesList />
						</Grid>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" color="secondary" onClick={deleteProduct}>
						Delete Product
					</Button>
					<Button variant="contained" color="primary" onClick={editProduct}>
						Save Changes
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
