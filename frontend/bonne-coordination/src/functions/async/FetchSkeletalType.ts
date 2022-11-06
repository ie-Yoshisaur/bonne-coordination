import { AppState } from '../../contexts/AppContext';

export default async function fetchSkeletalType(appContext: AppState | null) {
    const fetchSkeletalTypeURL = 'http://localhost:8080/get-skeletaltype';
    await fetch(fetchSkeletalTypeURL, {
        method: 'GET',
    })
        .then((response) => {
            if (response.statusText === 'OK') {
                return Promise.resolve(response.json());
            }
            return Promise.reject();
        })
        .then((json) => {
            appContext!.setSkeletalType(json!.message);
            return Promise.resolve();
        });
}
