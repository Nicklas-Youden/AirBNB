import axios from "axios";

class Connection {
  getAirBNBs = () => this.get("airbnbs");

  getSingleAirBNB = (id: string) => this.get(`airbnbs/${id}`);

  get = (endpoint: string) => {
    return new Promise((resolve) => {
      axios
        .get(`/api/${endpoint}`)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error("API GET Error:", error);
          resolve(null);
        });
    });
  };
}

export default Connection;
