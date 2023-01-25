import { AppState } from '../../contexts/AppContext';

export default async function fetchCoordination(
    appContext: AppState,
) {
    const fetchCoordinationURL = process.env.REACT_APP_API_URL + '/get-coordination';
    await fetch(fetchCoordinationURL, {
        method: 'GET',
    })
        .then((response) => {
            if (response.statusText === 'OK') {
                return Promise.resolve(response.json());
            }
            return Promise.reject();
        })
        .then((json) => {
            appContext.setCoordination(json!.set);
            appContext.setLikedList(json!.liked);
            appContext.setDislikedList(json!.disliked);
            console.log(json!.set);
            return Promise.resolve();
        });
}
