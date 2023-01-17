import { AppState } from '../../contexts/AppContext';

export default async function fetchSkeletalType(
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
    const fetchSkeletalTypeURL = process.env.REACT_APP_API_URL + '/get-skeletaltype';
    await fetch(fetchSkeletalTypeURL, {
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
            appContext!.setSkeletalType(json!.skeletalType);
            appContext!.setDoesHaveSkeletalType(true);
            return Promise.resolve();
        });
}
