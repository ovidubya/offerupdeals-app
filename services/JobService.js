class JobService {
  url = "";
  start() {
    return fetch(`${this.url}/start-job`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((data) => data.json())
      .then((result) => {
        return result;
      });
  }
  stop() {
    return fetch(`${this.url}/end-job`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((data) => data.json())
      .then((result) => {
        return result;
      });
  }
  status() {
    return fetch(`${this.url}/job-status`)
      .then((data) => data.json())
      .then((result) => {
        return result;
      });
  }
  extract() {
    return fetch(`${this.url}/extract`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((data) => {
        return data.json();
      })
      .then((result) => {
        return result;
      });
  }
  server(server) {
    this.url = server;
    return this;
  }
}

export const jobService = new JobService();
