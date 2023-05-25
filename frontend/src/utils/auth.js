// const BASE_URL = "https://auth.nomoreparties.co";
export const BASE_URL = "https://alexey.back.nomoredomains.monster";
// const BASE_URL = "http://alexey.back.nomoredomains.monster";

function handleRequest(url, method, body, token) {
  const headers = { "Content-Type": "application/json" };
  const config = { method, headers };
  if (token !== undefined) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }
  return fetch(`${BASE_URL}${url}`, config)
    .then((res) => {
      return res.ok
        ? res.json()
        : Promise.reject(`Ошибка: ${res.status} ${res.statusText}`);
    });
}

export function registration({ password, email }) {
  return handleRequest("/signup", "POST", { password, email });
}

export function authorization({ password, email }) {
  return handleRequest("/signin", "POST", { password, email });
}

export function getContent(token) {
  return handleRequest("/users/me", "GET", undefined, token);
}