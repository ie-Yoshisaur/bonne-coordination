import React, { useCallback } from 'react';
import ClotheInfo from '../../type/ClotheInfo';
import './ProductCard.css';

interface Props {
    clotheInfo: ClotheInfo;
    className?: string;
    onClick?: (website:string) => void;
}

const ProductCard: React.FC<Props> = ({ clotheInfo,className,onClick }) => {
    const handleClick = useCallback(() => {
        window.open(clotheInfo.saleSiteURL);
    }, [clotheInfo.saleSiteURL]);
    return (
        <div className={`product-card ${className}`} onClick={handleClick}>
            <img src={clotheInfo.imageURL} alt={clotheInfo.name} className="product-card__image" />
            <div className="product-card__content">
                <h2 className="product-card__name">{clotheInfo.name}</h2>
                <p className="product-card__brand">{clotheInfo.brand}</p>
                <p className="product-card__price">{clotheInfo.price}円</p>
            </div>
        </div>
    );
};

export default ProductCard;
