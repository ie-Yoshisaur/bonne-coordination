import { AppState } from '../../contexts/AppContext';

export default async function fetchBodyType(
    appContext: AppState | null,
    gender: string,
    bodyImpression: string,
    fingerJointSize: string,
    wristShape: string,
    wristAnkcle: string,
    clavicleImpression: string,
    kneecapImpression: string,
    unsuitableClothe: string,
) {
    const fetchBodyTypeURL = process.env.REACT_APP_API_URL + '/get-bodytype';
    await fetch(fetchBodyTypeURL, {
        method: 'POST',
        body: JSON.stringify({
            gender,
            bodyImpression,
            fingerJointSize,
            wristShape,
            wristAnkcle,
            clavicleImpression,
            kneecapImpression,
            unsuitableClothe,
        })
    })
        .then((response) => {
            if (response.statusText === 'OK') {
                return Promise.resolve(response.json());
            }
            return Promise.reject();
        })
        .then((json) => {
            appContext!.setBodyType(json!.bodyType);
            appContext!.setDoesHaveBodyType(true);
            return Promise.resolve();
        });
}
