import axios from "axios";

class Connection {
  private getAuthToken = (): string | null => {
    const authData = localStorage.getItem("authData");
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        return parsedData.token || null;
      } catch {
        return null;
      }
    }
    return null;
  };

  private getHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  };
  getAirBNBs = (params?: Record<string, string | number>) => {
    return this.get(`destinations`, params ? { params } : undefined);
  };

  getSingleAirBNB = (id: string) => this.get(`destinations/${id}`);

  getUserProfile = () => this.get(`users/profile`);

  getBookings = () => this.get(`booking`);

  get = (endpoint: string, options?: object) => {
    return new Promise((resolve, reject) => {
      const config = {
        headers: this.getHeaders(),
        ...options,
      };

      axios
        .get(`/api/${endpoint}`, config)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error("API GET Error:", error);
          reject(error);
        });
    });
  };

  createAirBNB = (data: object) => this.post("destinations", data);

  createBooking = (data: object) => this.post("booking", data);

  login = (email: string, password: string) =>
    this.post("users/login", { email, password });

  signup = (
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
    phone: number
  ) =>
    this.post("users/signup", {
      email,
      password,
      confirmPassword,
      name,
      phone,
    });

  post = (endpoint: string, data?: object) => {
    return new Promise((resolve, reject) => {
      const config = {
        headers: this.getHeaders(),
      };

      axios
        .post(`/api/${endpoint}`, data, config)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error("API POST Error:", error.response.data);
          reject(error);
        });
    });
  };
}

export default Connection;
