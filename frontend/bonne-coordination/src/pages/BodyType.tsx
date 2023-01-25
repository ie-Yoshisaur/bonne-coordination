import React, { ChangeEvent, useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import BodyTypeDiagnose from '../components/body/BodyTypeDiagnose';
import BodyTypeExplanation from '../components/body/BodyTypeExplanation';

const BodyType: React.FC = () => {
    const appContext = useContext(AppContext);
    if (!appContext.isSignedIn) {
        return (
            <div>
                <p>ログインしてください</p>
            </div>
        );
    }
    return (
        <div>
            {appContext.doesHaveBodyType ? <> </> : <BodyTypeDiagnose />}
            {appContext.doesHaveBodyType ? <BodyTypeExplanation /> : <> </>}
        </div>
    );
};

export default BodyType;
