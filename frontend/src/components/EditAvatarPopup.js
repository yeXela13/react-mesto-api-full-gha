import React from "react";
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {

    const setAvatar = React.useRef();

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateAvatar({
            avatar: setAvatar.current.value,
        });
    }

    return (
        <PopupWithForm
            name="popap-avatar-form"
            title="Обновить аватар"
            textButton="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input
                ref={setAvatar}
                id="input-avatar"
                name="avatar"
                type="url"
                className="form__textarea form__textarea_popap_avatar"
                placeholder="Ссылка на Ваш аватар"
                minLength="2"
                required
            />
            <span id="input-avatar-error" className="form__span form__span_active" />
        </PopupWithForm>
    )
}

export default EditAvatarPopup;