// src/services/auth/PatientAuthPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

import { AuthContext } from "../../context/authContext";

const API_URL = "http://localhost:5000/api/auth";

export default function PatientAuthPage() {
  const navigate = useNavigate(); // <-- hook
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    phone: "",
    password: "",
    age: "",
    gender: "",
    address: "",
    height: "",
    weight: "",
    priorDisease: "",
  });
  const [message, setMessage] = useState("");
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = isLogin ? `${API_URL}/login/patient` : `${API_URL}/register/patient`;
      const body = isLogin
        ? { phone: formData.phone, password: formData.password }
        : formData;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      if (isLogin) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        login(data.patient, "patient"); // ✅ update context
        navigate("/patient-dashboard"); // ✅ redirect
        setMessage("Login successful!");
      } else {
        setMessage("Registration successful! You can now login.");
        setIsLogin(true);
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>{isLogin ? "Patient Login" : "Patient Register"}</h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="text" name="role" placeholder="Patient" onChange={handleChange} required />
            <input type="number" name="age" placeholder="Age" onChange={handleChange} />
            <input type="text" name="gender" placeholder="Gender" onChange={handleChange} />
            <input type="text" name="address" placeholder="Address" onChange={handleChange} />
            <input type="number" name="height" placeholder="Height" onChange={handleChange} />
            <input type="number" name="weight" placeholder="Weight" onChange={handleChange} />
            <input type="text" name="priorDisease" placeholder="Prior Disease" onChange={handleChange} />
          </>
        )}
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>

      <p>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
}
