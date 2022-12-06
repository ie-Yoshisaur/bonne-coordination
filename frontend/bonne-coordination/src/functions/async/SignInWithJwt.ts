import { AppState } from '../../contexts/AppContext';

export default async function signUp(appContext: AppState | null) {
    const signUpWithJwtUrl = 'http://localhost/api/sign-in-with-jwt';
    fetch(signUpWithJwtUrl, {
        method: 'GET',
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
