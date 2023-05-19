import React from "react";
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
    const setName = React.useRef();
    const setLink = React.useRef();

    function handleSubmit(e) {
        e.preventDefault();
        onAddPlace({
            name: setName.current.value,
            link: setLink.current.value
        });
    }

    return (
        <PopupWithForm
            name="AddPlace"
            title="Новое место"
            textButton="Создать"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input
                ref={setName}
                id="input-place"
                name="name"
                type="text"
                className="form__textarea form__textarea_element_name"
                placeholder="Название"
                minLength="2"
                maxLength="30"
                required
            />
            <span id="input-place-error" className="form__span form__span_active" />
            <input
                ref={setLink}
                id="input-url"
                name="link"
                type="url"
                className="form__textarea form__textarea_element_url"
                placeholder="Ссылка на картинку"
                required
            />
            <span id="input-url-error" className="form__span form__span_active" />
        </PopupWithForm>
    )

};

export default AddPlacePopup;