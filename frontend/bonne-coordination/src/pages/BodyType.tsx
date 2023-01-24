import React, { ChangeEvent, useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import BodyTypeDiagnose from '../components/body/BodyTypeDiagnose';

const BodyType: React.FC = () => {
    const appContext = useContext(AppContext);
//    if (!appContext.isSignedIn) {
//        return (
//            <div>
//                <p>ログインしてください</p>
//            </div>
//        );
//    }
    return (
        <div>
              {appContext.doesHaveBodyType ? <> </> : <BodyTypeDiagnose />}
              {appContext.doesHaveBodyType ? <p>あなたの骨格は{appContext?.bodyType}です</p> : <> </>}
        </div>
    );
};

export default BodyType;
