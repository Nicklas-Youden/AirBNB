import axios from "axios";

class Connection {
  getAirBNBs = (params?: Record<string, string | number>) => {
    return this.get(`destinations`, params ? { params } : undefined);
  };

  getSingleAirBNB = (id: string) => this.get(`destinations/${id}`);

  get = (endpoint: string, options?: object) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/${endpoint}`, options)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error("API GET Error:", error);
          reject(error);
        });
    });
  };

  createAirBNB = (data: object) => this.post("destinations", data);

  login = (email: string, password: string) =>
    this.post("users/login", { email, password });

  signup = (email: string, password: string, username: string, phone: number) =>
    this.post("users/signup", { email, password, username, phone });

  logout = () => this.post("users/logout");

  post = (endpoint: string, data?: object) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`/api/${endpoint}`, data)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error("API POST Error:", error.response.data);
          reject(error);
        });
    });
  };
}

export default Connection;
