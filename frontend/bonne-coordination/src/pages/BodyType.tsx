import React, { ChangeEvent, useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import DiagnosisModal from '../components/modals/DiagnosisModal';

const BodyType = () => {
    const appContext = useContext(AppContext);
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
            {appContext?.doesHaveBodyType ? <> </> : <DiagnosisModal />}
            {appContext?.doesHaveBodyType ? <p>あなたの骨格は{appContext?.bodyType}です</p> : <> </>}
        </div>
    );
};
export default BodyType;
