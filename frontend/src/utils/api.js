import { BASE_URL } from './auth';

class Api {
    constructor(options) {
        this._options = options;
        this._baseUrl = this._options.baseUrl;
        this._headers = this._options.headers;
    }

    _checkHeaders = () => {
        this._token = localStorage.getItem('token');
        this._headers.authorization = `Bearer ${this._token}`;
        return this._headers;
    };

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

    _request(url, options) {
        return fetch(url, options).then(this._checkResponse)
    }

    getUserInfo() {
        return this._request(`${this._baseUrl}/users/me`, {
            headers: this._checkHeaders(),
        })
    }

    setUserInfo(name, about) {
        return this._request(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this._checkHeaders(),
            body: JSON.stringify({
                name,
                about
            })
        })
    }

    getInitialCards() {
        return this._request(`${this._baseUrl}/cards`, {
            headers: this._checkHeaders(),
        })
    }

    addedCard(name, link) {
        return this._request(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: this._checkHeaders(),
            body: JSON.stringify({
                link,
                name
            })
        })
    }

    setUserAvatar(avatar) {
        return this._request(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._checkHeaders(),
            body: JSON.stringify({
                avatar
            })
        })
    }

    deleteCard(cardId) {
        return this._request(`${this._baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: this._checkHeaders(),
        })
    }

    changeLikeCardStatus(cardId, isLiked) {
        if (isLiked) {
            return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
                method: 'PUT',
                headers: this._checkHeaders(),
            })
        }
        return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: 'DELETE',
            headers: this._checkHeaders(),
        })
    }
}
const api = new Api({
    baseUrl: BASE_URL,
    headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json'
    }
});

export default api;

