"use client";

import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { redirect } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On mount, fetch current user (cookie sent automatically)
  useEffect(() => {
    axios.get("/api/user")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // Login: calls our Next.js API, which sets cookies
  const login = async (username, password) => {
    await axios.post("/api/login", { username, password });
    const { data } = await axios.get("/api/user");
    setUser(data);
  };

  // reister: 
  const register = async (form) => {
    await axios.post("/api/register", form);
    const { data } = await axios.get("/api/user");
    setUser(data.data);
  };

  const set = async(user)=>{
    setUser(user)
  }

  // Logout: clear cookies via our API
  const logout = async () => {
    await axios.post("/api/logout");
    setUser(null);
    redirect("/login")
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
