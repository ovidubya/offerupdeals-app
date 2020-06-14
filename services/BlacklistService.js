class BlackListService {
  getBlacklist() {
    return fetch(this.url)
      .then((data) => data.json())
      .then((result) => {
        return result;
      });
  }
  blacklist(id) {
    console.log(`${this.url}/${id}`);
    return fetch(`${this.url}/${id}`, {
      method: "POST",
    })
      .then((data) => data.json())
      .then((result) => {
        return result;
      });
  }
  clearBlackList() {
    return fetch(`${this.url}/clear`, {
      method: "POST",
    })
      .then((data) => data.json())
      .then((result) => {
        return result;
      });
  }

  server(server) {
    this.url = `${server}/blacklist`;
    return this;
  }
}

export const blacklistService = new BlackListService();
