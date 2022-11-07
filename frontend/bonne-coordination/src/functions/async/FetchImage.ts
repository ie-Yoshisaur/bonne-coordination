import { AppState } from '../../contexts/AppContext';

export default async function fetchProblemImage(
    appContext: AppState | null,
) {
    const fetchImageURL = 'http://localhost/api/get-image';
    await fetch(fetchImageURL, {
        method: 'GET',
    })
        .then((response) => {
            if (response.statusText === 'OK') {
                return Promise.resolve(response.blob());
            }
            return Promise.reject();
        })
        .then((blob) => {
            const imageURL = URL.createObjectURL(blob);
            appContext!.setImageURL(imageURL);
            return Promise.resolve();
        });
}
