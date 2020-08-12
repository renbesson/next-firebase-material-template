import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	image: {
		width: '100vw',
		height: '30vh',
	},
}));

export default function Header() {
	const classes = useStyles();
	return (
		<Link href="/">
			<img className={classes.image} src="/images/headerImg.jpg" />
		</Link>
	);
}
