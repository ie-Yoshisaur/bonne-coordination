import React, { ChangeEvent, useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import DiagnosisModal from '../components/modals/DiagnosisModal';

const PageOne = () => {
    const appContext = useContext(AppContext);
    console.log(appContext?.skeletalType);

    if (!appContext?.isSignedIn) {
        return (
            <div>
                <p>ログインしてください</p>
            </div>
        );
    }
    return (
        <div>
            <p>こんにちは、{appContext?.userName}さん</p>
            {appContext?.doesHaveSkeletalType ? <> </> : <DiagnosisModal />}
            {appContext?.doesHaveSkeletalType ? <p>あなたの骨格は{appContext?.skeletalType}です</p> : <> </>}
        </div>
    );
};
export default PageOne;
