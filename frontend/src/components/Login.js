import React, { useCallback, useState } from "react";

function Login({ name, onLogin }) {
    const [userData, setUserData] = useState({ password: '', email: '' })

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value })
    }, [userData])

    function handleSubmit(e) {
        e.preventDefault();
        onLogin(userData)
    }

    return (
        <section className="page">
            <h2 className="form__title_auth">Войти</h2>
            <form onSubmit={handleSubmit} className={`form form_${name}`} name={`${name}`}>
                <input
                    onChange={handleChange}
                    value={userData.email}
                    id="input-email"
                    name="email"
                    type="text"
                    className="form__textarea form__textarea_auth_email"
                    placeholder="email"
                    required />
                <span id="input-email-error" className="form__span form__span_active" />
                <input
                    onChange={handleChange}
                    value={userData.password}
                    id="input-password"
                    className="form__textarea form__textarea_auth_password" type="password"
                    name="password"
                    placeholder="password"
                    required />
                <span id="input-password-error" className="form__span form__span_active" />
                <button aria-label="submit" className="form__button_auth" type="submit" >Вход</button>
            </form>

        </section>
    )
}

export default Login;