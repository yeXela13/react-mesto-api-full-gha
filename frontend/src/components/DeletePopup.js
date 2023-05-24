import React from "react";
import PopupWithForm from "./PopupWithForm";

function DeletePopup({ card, onClose, isOpen, onCardDelete }) {

    function handleSubmit(e) {
        e.preventDefault();
        onCardDelete(card)
     }

    return (
        <PopupWithForm
            name="popap-delete-form"
            title="Вы уверены?"
            textButton="Да"
            onClose={onClose}
            isOpen={isOpen}
            onSubmit={handleSubmit}
        />
    )
}

export default DeletePopup;