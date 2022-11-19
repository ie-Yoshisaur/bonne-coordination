import { AppState } from '../../contexts/AppContext';

export default async function signIn(
    appContext: AppState | null,
    name: string,
    password: string,
) {
    const signInUrl = 'http://localhost/api/sign-in';
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
            return Promise.resolve();
        }); 
}
