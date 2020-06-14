class ExpoTokenService {
  send(token) {
    return fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    })
      .then((data) => data.json())
      .then((result) => {
        return result;
      });
  }
  server(server) {
    this.url = `${server}/expo-token`;
    return this;
  }
}

export const expoTokenService = new ExpoTokenService();
