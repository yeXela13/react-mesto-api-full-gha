import { useState, useEffect, useContext } from "react";
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
    const currentUser = useContext(CurrentUserContext);
    const [name, setName] = useState(currentUser.name);
    const [description, setDescription] = useState(currentUser.about);

    useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser]);

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateUser({
            name: name,
            about: description,
        });
    }
    function handleNameChange(e) {
        setName(e.target.value);
    }
    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    return (
        <PopupWithForm
            name="popap-form"
            title="Редактировать профиль"
            textButton="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input
                value={name || ""}
                onChange={handleNameChange}
                id="input-name"
                name="name"
                type="text"
                className="form__textarea form__textarea_profile_name"
                placeholder="Имя"
                minLength="2"
                maxLength="40"
                required />
            <span id="input-name-error" className="form__span form__span_active" />
            <input
                value={description || ""}
                onChange={handleDescriptionChange}
                id="input-post"
                className="form__textarea form__textarea_profile_post" type="text"
                name="post"
                placeholder="О себе"
                minLength="2"
                maxLength="200"
                required />
            <span id="input-post-error" className="form__span form__span_active" />
        </PopupWithForm>
    )
}

export default EditProfilePopup;