import { createContext, useContext, useState } from "react";
import axios from "axios";
const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  const signup = async (username) => {
    try {
      const response = await axios.post(`${API}/signup`, {
        username,
        password: "secret",
      });

      if (response.data.success) {
        setToken(response.data.token);
        setLocation("TABLET");
      } else {
        throw new Error("signup failed");
      }
    } catch (err) {
      console.log(err);
    }
  };
  // TODO: authenticate
  const authenticate = async () => {
    if (!token) {
      throw new Error("No token found");
    }
    try {
      const result = await axios(`${API}/authenticate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.data.success) {
        setLocation("TUNNEL");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
