import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import fetchCoordination from '../functions/async/FetchCoordination';
import ProductCard from '../components/cards/ProductCard';
import './Clothes.css';

const Clothes = () => {
    const appContext = useContext(AppContext);
    useEffect(() => {
        fetchCoordination(appContext);
    }, []);
    if (!appContext.isSignedIn) {
        return (
            <div>
                <p>ログインしてください</p>
            </div>
        );
    }
    if (!appContext.doesHaveBodyType) {
        return (
            <div>
                <p>骨格診断を「Your Body Type」にて行ってください</p>
            </div>
        );
    }
    return (
        <div>
            <div className="product-list">
                {appContext.coordination.map((clotheInfo, index) => (
                    <div key={index} className="product-list__item">
                        <ProductCard className="product-card--fixed" clotheInfo={clotheInfo} />
                    </div>
                ))}
            </div>
            <div className="buttons">
                <button className="reload-button" onClick={() => fetchCoordination(appContext)} > 別の服を見る </button>
            </div>
        </div>
    );
};

export default Clothes;
