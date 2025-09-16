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
}

export default Connection;
