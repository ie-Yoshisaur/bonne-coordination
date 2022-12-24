import { AppState } from '../../contexts/AppContext';

export default async function signUp(
    appContext: AppState | null,
    name: string,
    password: string,
    passwordConfirmination: string,
) {
    const signUpUrl = process.env.REACT_APP_API_URL + '/sign-up';
    fetch(signUpUrl, {
        method: 'POST',
        body: JSON.stringify({
            name,
            password,
            passwordConfirmination,
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
