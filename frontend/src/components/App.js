import '../index.css';
import React, { useCallback, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import api from '../utils/api'
import Header from './Header'
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeletePopup from './DeletePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRouteElement from './ProtectedRoute';
import { registration, authorization, getContent } from '../utils/auth'
import InfoTooltip from './InfoTooltip';
import correctStatus from '../images/correct.svg'
import unCorrectStatus from '../images/UnCorrect.svg'

function App() {
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [infoTooltipOpen, setInfoTooltipOpen] = useState(false);
    const [cards, setCards] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ password: '', email: '' });
    const [userEmail, setUserEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [infoToolTipData, setInfoToolTipData] = useState({ text: '', image: '' })

    const navigate = useNavigate();
    useEffect(() => {
        loggedIn &&
            Promise.all([api.getUserInfo(), api.getInitialCards()])
                .then(([userData, cardsData]) => {
                    setCurrentUser(userData);
                    setCards(cardsData.reverse());
                })
                .catch((res) => console.log(res));

    }, [loggedIn]);

    const cbAuthenticate = useCallback(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            setLoggedIn(true);
            setUserData(data.email);
        }
    }, [])

    const cbLogin = useCallback(async (userData) => {
        try {
            const data = await authorization(userData)
            cbAuthenticate(data);
            setUserEmail(userData.email)
            // console.log(userData.email)
            navigate("/", { replace: true });
        } catch (e) {
            console.error(e)
            handleInfoTooltip();
            setInfoToolTipData({ text: 'Что-то пошло не так! Попробуйте ещё раз', image: unCorrectStatus })
        } finally {
            setLoading(false)
        }
    }, [cbAuthenticate, navigate])

    const cbRegister = useCallback(async (userData) => {
        try {
            const data = await registration(userData)
            cbAuthenticate(data);
            setInfoToolTipData({ text: 'Вы успешно зарегистрировались!', image: correctStatus })
            navigate("/sign-in", { replace: true });
        } catch (e) {
            console.error(e)
            setInfoToolTipData({ text: 'Что-то пошло не так! Попробуйте ещё раз', image: unCorrectStatus })
        }
        finally {
            handleInfoTooltip();
            setLoading(false)
        }
    }, [cbAuthenticate, navigate])

    const cbTokenCheck = useCallback(async () => {
        const token = localStorage.getItem('token')
        setLoading(false)
        if (token) {
            try {
                const user = await getContent(token);
                if (!user) {
                    throw new Error('пользователь с email не найден')
                }
                if (!token) {
                    throw new Error('Токен не передан или передан не в том формате')
                }
                // setUserData(user.data.email)
                setUserEmail(user.data.email)
                setLoggedIn(true)
                navigate("/", { replace: true })
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
    }, [navigate])

    const cbLogout = useCallback(() => {
        localStorage.removeItem('token')
        setLoggedIn(false)
        setUserData({ password: '', email: '' })
        navigate("/sign-in", { replace: true });
        setLoading(false)
    }, [navigate])

    useEffect(() => {
        cbTokenCheck();
    }, [cbTokenCheck]);

    if (loading) {
        return 'Loading'
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }
    function handleInfoTooltip() {
        setInfoTooltipOpen(true);
    }
    function handleEditProfileClick() {
        setEditProfilePopupOpen(true);
    }
    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }
    function handleCardClick(card) {
        setSelectedCard(card);
    }
    function handleDeleteConfirmClick() {
        setIsDeletePopupOpen(true);
    }
    
    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch((res) => console.log(res));
        }
    

    function handleCardDelete(card) {
        handleDeleteConfirmClick();
        api.deleteCard(card._id)
            .then(() => {
                setCards((state) => state.filter((c) => c._id !== card._id));
                closeAllPopups();
            })
            .catch((res) => console.log(res));
    }

    function handleUpdateUser({ name, about }) {
        api.setUserInfo(name, about)
            .then(({ name, about, avatar, _id }) => {
                setCurrentUser({ name, about, avatar, _id });
                closeAllPopups();
            })
            .catch((res) => console.log(res));
    }

    function handleUpdateAvatar({ avatar }) {
        api.setUserAvatar(avatar)
            .then(({ avatar }) => {
                setCurrentUser({ ...currentUser, avatar });
                closeAllPopups();
            })
            .catch((res) => console.log(res));
    }

    function handleAddPlaceSubmit({ name, link }) {
        api.addedCard(name, link)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch((res) => console.log(res));
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsDeletePopupOpen(false);
        setInfoTooltipOpen(false)
        setSelectedCard(null);
    }

    // console.log(userEmail)
    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <Header
                    email={userEmail}
                    onLogOut={cbLogout} />
                <Routes>
                    <Route path="/sign-in" loggedIn={loggedIn}
                        element={
                            <Login
                                onLogin={cbLogin}

                            />} />
                    <Route path="/sign-up" element={
                        <Register
                            onRegister={cbRegister}
                        />}
                    />
                    <Route index path="/" element={
                        <ProtectedRouteElement
                            loggedIn={loggedIn}
                            element={Main}
                            cards={cards}
                            onEditAvatar={handleEditAvatarClick}
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onDeletePopup={handleDeleteConfirmClick}
                            onCardClick={handleCardClick}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
                        />

                    } />
                </Routes>

                <Footer />
                {/* попап Регистрации */}
                <InfoTooltip
                    infoToolTipData={infoToolTipData}
                    isOpen={infoTooltipOpen}
                    onClose={closeAllPopups}
                />

                {/* попап удалить карточку */}
                <DeletePopup
                    isOpen={isDeletePopupOpen}
                    onClose={closeAllPopups}
                />
                {/* попап редактирования */}
                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser} />
                {/* попап добавить карточку */}
                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlaceSubmit}
                />

                {/* попап аватара */}
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar} />

                {/* попап с картинкой */}
                <ImagePopup
                    card={selectedCard}
                    onClose={closeAllPopups}
                />
            </div >
        </CurrentUserContext.Provider>
    );
}

export default App;