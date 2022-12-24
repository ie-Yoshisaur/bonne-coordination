import { AppState } from '../../contexts/AppContext';

export default async function signIn(
    appContext: AppState | null,
    name: string,
    password: string,
) {
    const signInUrl = process.env.REACT_APP_API_URL + '/sign-in';
    fetch(signInUrl, {
        method: 'POST',
        body: JSON.stringify({
            name,
            password,
        })
    })
        .then((response) => {
            if (response.status === 200) {
                return Promise.resolve(response.json());
            }
            return Promise.reject();
        })
        .then((json) => {
            appContext?.setUserName(json?.name);
            appContext?.setIsSignedIn(true);
        })
        .catch(() => {
            appContext?.setIsSignedIn(false);
        });
}
