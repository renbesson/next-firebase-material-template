import firebase from '@/firebase/clientApp';
import { useRouter } from 'next/router';

export default function SignOut(user) {
	const router = useRouter();
	useEffect(() => {
		// Firebase updates the id token every hour, this
		// makes sure the react state and the cookie are
		// both kept up to date
		firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
				alert('Sign out successfully!');
				router.push('/');
			})
			.catch((e) => {
				console.error(e);
			});

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div></div>;
}
