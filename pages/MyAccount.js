import { useUser } from '../context/userContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: { margin: 0 },
}));

export default function MyAccount() {
	const classes = useStyles();
	const { loadingUser, user } = useUser();

	return <div></div>;
}
