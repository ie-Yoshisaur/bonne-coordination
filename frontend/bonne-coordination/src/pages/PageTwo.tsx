import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';

const PageTwo = () => {
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
            <p>{appContext?.userName}さんは骨格タイプが {appContext?.skeletalType}なので以下のような服が似合います</p>
            <p>トップス</p>
            {appContext?.skeletalType.match(/ストレート/) ? <img src="https://image.uniqlo.com/GU/ST3/jp/imagesgoods/345037/sub/jpgoods_345037_sub54.jpg?height=600&imformat=chrome&width=600" alt="ストレートトップス" /> : <> </>}
            {appContext?.skeletalType.match(/ウェーブ/) ? <img src="https://image.uniqlo.com/GU/ST3/jp/imagesgoods/343391/sub/jpgoods_343391_sub53.jpg?height=600&imformat=chrome&width=600" alt="ウェーブトップス" /> : <> </>}
            {appContext?.skeletalType.match(/ナチュラル/) ? <img src="https://image.uniqlo.com/GU/ST3/jp/imagesgoods/345037/sub/jpgoods_345037_sub54.jpg?height=600&imformat=chrome&width=600" alt="ナチュラルトップス" />  : <> </>}

            <p>パンツ</p>
            {appContext?.skeletalType.match(/ストレート/) ? <img src="https://image.uniqlo.com/GU/ST3/jp/imagesgoods/346220/sub/jpgoods_346220_sub54.jpg?height=600&imformat=chrome&width=600" alt="ストレートパンツ" /> : <> </>}
            {appContext?.skeletalType.match(/ウェーブ/) ? <img src="https://image.uniqlo.com/GU/ST3/jp/imagesgoods/346487/sub/jpgoods_346487_sub51.jpg?height=600&imformat=chrome&width=600" alt="ウェーブパンツ" /> : <> </>}
            {appContext?.skeletalType.match(/ナチュラル/) ? <img src="https://www.muji.com/public/media/img/item/4550344968925_07_1260.jpg" alt="ナチュラルパンツ" />  : <> </>}

            <p>シューズ</p>
            {appContext?.skeletalType.match(/ストレート/) ? <img src="https://image.uniqlo.com/GU/ST3/jp/imagesgoods/344611/item/jpgoods_88_344611.jpg?height=600&imformat=chrome&width=600" alt="ストレートシューズ" /> : <> </>}
            {appContext?.skeletalType.match(/ウェーブ/) ? <img src="https://image.uniqlo.com/GU/ST3/jp/imagesgoods/346447/item/jpgoods_32_346447.jpg?height=600&imformat=chrome&width=600" alt="ウェーブシューズ" /> : <> </>}
            {appContext?.skeletalType.match(/ナチュラル/) ? <img src="https://image.uniqlo.com/GU/ST3/jp/imagesgoods/344449/item/jpgoods_88_344449.jpg?height=600&imformat=chrome&width=600" alt="ナチュラルシューズ" />  : <> </>}

            <p>グッズ</p>
            {appContext?.skeletalType.match(/ストレート/) ? <img src="https://image.uniqlo.com/GU/ST3/jp/imagesgoods/343263/sub/jpgoods_343263_sub54.jpg?height=600&imformat=chrome&width=600" alt="ストレートグッズ" /> : <> </>}
            {appContext?.skeletalType.match(/ウェーブ/) ? <img src="https://image.uniqlo.com/GU/ST3/jp/imagesgoods/343264/sub/jpgoods_343264_sub53.jpg?height=600&imformat=chrome&width=600" alt="ウェーブグッズ" /> : <> </>}
            {appContext?.skeletalType.match(/ナチュラル/) ? <img src="https://www.muji.com/public/media/img/item/4550512261964_1260.jpg" alt="ナチュラルグッズ" />  : <> </>}

        </div>
    );
};

export default PageTwo;
