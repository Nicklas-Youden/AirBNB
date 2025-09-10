import axios from "axios";

class Connection {
  getAirBNBs = () => this.get("destinations");

  getSingleAirBNB = (id: string) => this.get(`destinations/${id}`);

  get = (endpoint: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/${endpoint}`)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error("API GET Error:", error);
          reject(error);
        });
    });
  };
}

export default Connection;
