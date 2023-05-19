import React from "react";
import { Routes, Link, Route } from 'react-router-dom';

function NavBar({ email, onLogOut }) {
//   console.log(email)
    return (
        <div className="header__navigation">
            <Routes>
                <Route path="/sign-in" element={
                    <Link to="/sign-up" className="header__link">Регистрация</Link>} />
                <Route path="/sign-up" element={
                    <Link to="/sign-in" className="header__link">Войти</Link>} />
                <Route path="/" element={
                    <div className="header__user-info">
                        <p className='header__email'>{email}</p>
                        <button onClick={onLogOut} className="header__log-out">Выйти</button>
                    </div>
                } />
            </Routes>
        </div>
    )


}

export default NavBar;