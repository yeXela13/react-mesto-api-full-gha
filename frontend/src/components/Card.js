import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext'


function Card({ card, onCardClick, onCardLike, onCardDelete }) {
    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = card.owner._id === currentUser._id;
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    const cardLikeButtonClassName = (
        `element__like ${isLiked && 'element__like-active'}`
    );

    function handleCardClick() {
        onCardClick(card);
    };
    function handleDeleteClick() {
        onCardDelete(card);
    };
    function handleLikeClick() {
        onCardLike(card);
    };

    return (

        <li className="element__item">
            <img className="element__image" src={card.link} alt={card.name} onClick={handleCardClick} />
            {isOwn && <button className="element__delete-button" type="button" onClick={handleDeleteClick} />}
            <div className="element__caption">
                <h2 className="element__text">{card.name}</h2>
                <div className="element__like-container">
                    <button className={cardLikeButtonClassName}
                        type="button" onClick={handleLikeClick}></button>
                    <p className="element__like-sum">{card.likes.length}</p>
                </div>
            </div>
        </li>

    );
}

export default Card;