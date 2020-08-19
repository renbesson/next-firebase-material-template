import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import IconButton from '@material-ui/core/IconButton';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import InputBase from '@material-ui/core/InputBase';
import { TextField, ButtonGroup } from '@material-ui/core';
import { spacing } from '@material-ui/system';

const useStyles = makeStyles((theme) => ({
	card: {
		width: 200,
		height: 400,
	},
	media: {
		height: 200,
	},
	zeroMargin: {
		margin: 0,
		padding: 0,
	},
	buttonSize: {
		width: '55px',
		height: '56px',
		padding: '0px 0px',
	},
	iconButton: {
		background: theme.palette.primary.main,
	},
}));

export default function ProductCard() {
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
			if (prevQuantity < 9) return prevQuantity + 1;
			return prevQuantity;
		});
	}

	return (
		<Card className={classes.card}>
			<CardMedia className={classes.media} image="/images/arroz.jpg" title="Contemplative Reptile" />
			<CardContent className={classes.zeroMargin}>
				<Typography gutterBottom variant="subtitle1" component="h2">
					Risoto com Funghi Cozinha Fácil TIO JOÃO Pacote 250g
				</Typography>
				<Typography variant="h6" color="textSecondary" component="h2" className={classes.zeroMargin}>
					R$16,00
				</Typography>
			</CardContent>
			<CardActions disableSpacing={true} classes={{ root: classes.zeroMargin }}>
				<ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
					<Button
						aria-label="increment quantity"
						onClick={decrementQuantity}
						variant="contained"
						color="primary"
					>
						<RemoveRoundedIcon />
					</Button>
					<TextField
						variant="outlined"
						value={quantity}
						onChange={(e) => setQuantity(e.target.value)}
					></TextField>
					<Button aria-label="increment quantity" onClick={incrementQuantity} variant="contained">
						<AddRoundedIcon />
					</Button>
					<Button aria-label="delete" variant="contained">
						<ShoppingCartOutlinedIcon />
					</Button>
				</ButtonGroup>
			</CardActions>
		</Card>
	);
}
