import { AppState } from '../../contexts/AppContext';

export default async function signUp(appContext: AppState | null) {
    const signUpWithJwtUrl = process.env.REACT_APP_API_URL + '/sign-in-with-jwt';
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
            if (json?.doesHaveSkeletalType) {
                appContext?.setDoesHaveSkeletalType(true);
                const skeletalType = json?.skeletalType;
                appContext?.setSkeletalType(skeletalType);
            }
            appContext?.setIsSignedIn(true);
        })
        .catch(() => {
            appContext?.setIsSignedIn(false);
        });
}
