import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import IconButton from '@material-ui/core/IconButton';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import { TextField, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: { padding: theme.spacing(1) },
	card: {
		height: 150,
		minWidth: 280,
	},
	cardActions: {
		alignSelf: 'flex-end',
		justifySelf: 'end',
		paddingTop: theme.spacing(0),
		paddingBottom: theme.spacing(0),
		paddingLeft: theme.spacing(0),
		paddingRight: theme.spacing(0),
		maxWidth: '215px',
	},
	media: {
		height: 150,
		width: 150,
	},
	zeroPadding: {
		padding: theme.spacing(0),
	},
	buttonSize: {
		width: '55px',
		height: '50px',
	},
}));

export default function ProductCard({ productData }) {
	const classes = useStyles();
	const [quantity, setQuantity] = useState(1);

	function decrementQuantity() {
		setQuantity((prevQuantity) => {
			if (prevQuantity > 1) return prevQuantity - 1;
			return prevQuantity;
		});
	}
	function incrementQuantity() {
		setQuantity((prevQuantity) => {
			if (prevQuantity < 20) return prevQuantity + 1;
			return prevQuantity;
		});
	}

	return (
		<Card className={classes.card}>
			<Grid container>
				<CardMedia
					className={classes.media}
					image={
						productData.images && productData.images[0]
							? productData.images[0].url
							: '/images/600px-No_image_available.png'
					}
					title={productData.name}
				/>
				<Grid container item xs className={classes.root} direction="column" alignContent="space-between">
					<Grid item xs className={classes.zeroPadding}>
						<Typography variant="body2" component="p" align="justify">
							{productData.name}
						</Typography>
					</Grid>
					<Grid container item xs className={classes.zeroPadding} direction="row" justify="space-between">
						<Typography variant="h6" color="textSecondary" component="h2">
							{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
								productData.price
							)}
						</Typography>
						<Typography variant="overline" component="p" align="justify" style={{ paddingRight: '20px' }}>
							Code: {productData.productCode}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Card>
	);
}
