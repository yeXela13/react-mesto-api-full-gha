import React from "react";
import PopupWithForm from "./PopupWithForm";

function DeletePopup({ onClose, isOpen }) {

    function handleSubmit(e) {
        e.preventDefault();
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