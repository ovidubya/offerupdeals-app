class DataService {
  url = "";
  getData() {
    return fetch(this.url)
      .then((data) => data.json())
      .then((result) => {
        return result.data;
      });
  }
  server(server) {
    this.url = `${server}/data`;
    return this;
  }
}

export const dataService = new DataService();
