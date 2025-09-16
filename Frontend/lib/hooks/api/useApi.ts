import { useState } from "react";
import Connection from "./connection";

const getConnection = () => new Connection();

export const useApi = () => {
  const [api] = useState(getConnection());
  return api;
};
