// // src/services/auth/PatientAuthPage.jsx
// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

// import { AuthContext } from "../../context/authContext";

// const API_URL = "http://localhost:5000/api/auth";

// export default function PatientAuthPage() {
//   const navigate = useNavigate(); // <-- hook

//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     role: "",
//     phone: "",
//     password: "",
//     age: "",
//     gender: "",
//     address: "",
//     height: "",
//     weight: "",
//     priorDisease: "",
//   });
//   const [message, setMessage] = useState("");
//   const { login } = useContext(AuthContext);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       const url = isLogin ? `${API_URL}/login/patient` : `${API_URL}/register/patient`;
//       const body = isLogin
//         ? { phone: formData.phone, password: formData.password }
//         : formData;

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//         credentials: "include",
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setMessage(data.message || "Something went wrong");
//         return;
//       }

//       if (isLogin) {
//         localStorage.setItem("accessToken", data.accessToken);
//         localStorage.setItem("refreshToken", data.refreshToken);
//         login(data.patient, "patient"); // ✅ update context
//         navigate("/patient-dashboard"); // ✅ redirect
//         setMessage("Login successful!");
//       } else {
//         setMessage("Registration successful! You can now login.");
//         setIsLogin(true);
//       }
//     } catch (err) {
//       setMessage("Error: " + err.message);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
//       <h2>{isLogin ? "Patient Login" : "Patient Register"}</h2>

//       <form onSubmit={handleSubmit}>
//         {!isLogin && (
//           <>
//             <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
//             <input type="text" name="role" placeholder="Patient" onChange={handleChange} required />
//             <input type="number" name="age" placeholder="Age" onChange={handleChange} />
//             <input type="text" name="gender" placeholder="Gender" onChange={handleChange} />
//             <input type="text" name="address" placeholder="Address" onChange={handleChange} />
//             <input type="number" name="height" placeholder="Height" onChange={handleChange} />
//             <input type="number" name="weight" placeholder="Weight" onChange={handleChange} />
//             <input type="text" name="priorDisease" placeholder="Prior Disease" onChange={handleChange} />
//           </>
//         )}
//         <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
//         <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//         <button type="submit">{isLogin ? "Login" : "Register"}</button>
//       </form>

//       <p>{message}</p>
//       <button onClick={() => setIsLogin(!isLogin)}>
//         {isLogin ? "Need an account? Register" : "Already have an account? Login"}
//       </button>
//     </div>
//   );
// }


// PatientAuthPage.jsx
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

const API_URL = "http://localhost:5000/api/auth";

const PatientAuthPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
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
  const [showPassword, setShowPassword] = useState(false);

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

      localStorage.setItem("token", data.accessToken);

      if (isLogin) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        login(data.patient, "patient");
        navigate("/patient-dashboard");
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
    <div className="flex min-h-screen bg-emerald-50">
      {/* Left Side: Creative Facts */}
      <div className="w-1/2 bg-gradient-to-br from-emerald-100 to-emerald-200 flex flex-col justify-center items-center p-12 text-emerald-800">
        <div className="max-w-lg">
          <h3 className="text-2xl font-bold mb-4">Fascinating Facts</h3>
          <p className="mb-4">
            Your heart beats around 100,000 times a day, pumping about 2,000 gallons of blood – that's like filling a swimming pool every week!
          </p>
          <p className="mb-4">
            Your lungs inhale over 11,000 liters of air daily, equivalent to a small hot air balloon, keeping your respiratory system in harmony.
          </p>
          <p className="mb-4">
            With Respiscope, track your heart and lung health with precision, turning vital signs into a life-saving melody.
          </p>
          <div className="bg-emerald-300 text-white p-4 rounded-lg mt-6 inline-block">
            <p className="font-semibold">Dr. Elena Vasquez, Pulmonologist</p>
            <p>"Respiscope transformed my patient care with its smart insights."</p>
          </div>
          <p className="mt-8 text-lg font-bold">Join 500,000+ Health Innovators</p>
        </div>
      </div>

      {/* Right Side: Patient Form */}
      <div className="w-1/2 flex flex-col justify-center items-center p-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-600">Respiscope</h1>
          <p className="text-sm text-emerald-700">Smart Stethoscope for Heart & Lung Health</p>
        </div>
        <h2 className="text-2xl font-semibold text-emerald-800 mb-6">{isLogin ? "Patient Login" : "Patient Register"}</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                  <User className="absolute right-3 top-3 text-emerald-400" size={20} />
                </div>
              </div>
              <div className="flex flex-row space-x-2">
                <div className="mb-4">
                  <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="role">
                    Role
                  </label>
                  <div className="relative">
                    <input
                      id="role"
                      name="role"
                      type="text"
                      placeholder="Patient"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                    />
                    <User className="absolute right-3 top-3 text-emerald-400" size={20} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="age">
                    Age
                  </label>
                  <div className="relative">
                    <input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row space-x-2">
              <div className="mb-4">
                <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="gender">
                  Gender
                </label>
                <div className="relative">
                  <input
                    id="gender"
                    name="gender"
                    type="text"
                    placeholder="Gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="address">
                  Address
                </label>
                <div className="relative">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              </div>
              <div className="flex flex-row space-x-2">
              <div className="mb-4">
                <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="height">
                  Height
                </label>
                <div className="relative">
                  <input
                    id="height"
                    name="height"
                    type="number"
                    placeholder="Height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="weight">
                  Weight
                </label>
                <div className="relative">
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="Weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              </div>
              <div className="mb-4">
                <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="priorDisease">
                  Prior Disease
                </label>
                <div className="relative">
                  <input
                    id="priorDisease"
                    name="priorDisease"
                    type="text"
                    placeholder="Prior Disease"
                    value={formData.priorDisease}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
              />
              <Mail className="absolute right-3 top-3 text-emerald-400" size={20} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
              />
              <Lock className="absolute left-3 top-3 text-emerald-400" size={20} />
              {showPassword ? (
                <EyeOff
                  className="absolute right-3 top-3 text-emerald-400 cursor-pointer"
                  size={20}
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="absolute right-3 top-3 text-emerald-400 cursor-pointer"
                  size={20}
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 rounded-lg font-bold hover:bg-emerald-600 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="mt-4 text-sm text-emerald-700">{message}</p>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-emerald-600 hover:underline"
        >
          {isLogin ? "Need an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default PatientAuthPage;