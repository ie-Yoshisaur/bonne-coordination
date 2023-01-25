import { AppState } from '../../contexts/AppContext';

export default async function fetchBodyType(
    appContext: AppState,
    gender: string,
    bodyImpression: string,
    unsuitableClothe: string,
    handImpression: string,
    legImpression: string,
    buttocksImpression: string,
    neckImpression: string,
    muscleImpression: string,
) {
    const fetchBodyTypeURL = process.env.REACT_APP_API_URL + '/get-bodytype';
    await fetch(fetchBodyTypeURL, {
        method: 'POST',
        body: JSON.stringify({
            gender,
            bodyImpression,
            unsuitableClothe,
            handImpression,
            legImpression,
            buttocksImpression,
            neckImpression,
            muscleImpression,
        })
    })
        .then((response) => {
            if (response.statusText === 'OK') {
                return Promise.resolve(response.json());
            }
            return Promise.reject();
        })
        .then((json) => {
            appContext.setBodyType(json!.bodyType);
            appContext.setDoesHaveBodyType(true);
            return Promise.resolve();
        });
}
