import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContextType";

export const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;
