const url = "http://192.168.0.2:3000/offerup";

class SettingService {
  getSettings() {
    return fetch(this.url)
      .then((data) => data.json())
      .then((result) => {
        return result;
      });
  }
  setSettings(data) {
    return fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((data) => data.json())
      .then((result) => {
        return result;
      });
  }
  server(server) {
    this.url = `${server}/settings`;
    return this;
  }
}

export const settingService = new SettingService();
