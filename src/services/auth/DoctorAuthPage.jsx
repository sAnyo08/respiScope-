// // src/services/auth/DoctorAuthPage.jsx
// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
// import { AuthContext } from "../../context/authContext";

// const API_URL = "http://localhost:5000/api/auth";

// export default function DoctorAuthPage() {
//   const navigate = useNavigate(); // <-- hook
  
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     role: "",
//     phone: "",
//     password: "",
//     degree: "",
//     experience: "",
//     address: "",
//     hospital: "",
//   });
//   const [message, setMessage] = useState("");
//   const { login } = useContext(AuthContext); // ✅ use context

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       const url = isLogin ? `${API_URL}/login/doctor` : `${API_URL}/register/doctor`;
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
//         login(data.doctor, "doctor"); // ✅ update context
//         navigate("/doctor-dashboard"); // ✅ redirect
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
//       <h2>{isLogin ? "Doctor Login" : "Doctor Register"}</h2>

//       <form onSubmit={handleSubmit}>
//         {!isLogin && (
//           <>
//             <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
//             <input type="text" name="role" placeholder="Doctor" onChange={handleChange} required />
//             <input type="text" name="degree" placeholder="Degree" onChange={handleChange} />
//             <input type="text" name="experience" placeholder="Experience" onChange={handleChange} />
//             <input type="text" name="address" placeholder="Address" onChange={handleChange} />
//             <input type="text" name="hospital" placeholder="Hospital" onChange={handleChange} />
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

// src/services/auth/DoctorAuthPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import { AuthContext } from "../../context/authContext";
import { Phone, Lock, Eye, EyeOff, LogIn, User, LetterText, Calendar, Hospital, Map, PenIcon } from 'lucide-react';

const API_URL = "http://localhost:5000/api/auth";

export default function DoctorAuthPage() {
  const navigate = useNavigate(); // <-- hook
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    phone: "",
    password: "",
    degree: "",
    experience: "",
    address: "",
    hospital: "",
  });
  const [message, setMessage] = useState("");
  const { login } = useContext(AuthContext); // ✅ use context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = isLogin ? `${API_URL}/login/doctor` : `${API_URL}/register/doctor`;
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
      console.log(data);
      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      if (isLogin) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        login(data.doctor, "doctor"); // ✅ update context
        navigate("/doctor-dashboard"); // ✅ redirect
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
    //     <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
    //       <h2>{isLogin ? "Doctor Login" : "Doctor Register"}</h2>

    //       <form onSubmit={handleSubmit}>
    //         {!isLogin && (
    //           <>
    //             <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
    //             <input type="text" name="role" placeholder="Doctor" onChange={handleChange} required />
    //             <input type="text" name="degree" placeholder="Degree" onChange={handleChange} />
    //             <input type="text" name="experience" placeholder="Experience" onChange={handleChange} />
    //             <input type="text" name="address" placeholder="Address" onChange={handleChange} />
    //             <input type="text" name="hospital" placeholder="Hospital" onChange={handleChange} />
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

    // Login.jsx

    <div className="flex min-h-screen bg-emerald-50">
      {/* Left Side: Login Form */}
      <div className="w-1/2 flex flex-col justify-center items-center p-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-600">Respiscope</h1>
          <p className="text-sm text-emerald-700">Smart Stethoscope for Heart & Lung Health</p>
        </div>
        <h2 className="text-2xl font-semibold text-emerald-800 mb-6">{isLogin ? "Doctor Login" : "Doctor Register"}</h2>


        <form className="w-full max-w-md" onSubmit={handleSubmit}>

          {!isLogin && (
            <div>
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
                    onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                  <LetterText className="absolute right-3 top-3 text-emerald-400" size={20} />
                </div>
              </div>
              <div className="flex flex-row space-betweeen space-x-2">
                <div className="mb-4">
                  <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="name">
                    Role
                  </label>
                  <div className="relative">
                    <input
                      id="role"
                      type="text"
                      name="role"
                      placeholder="Doctor or Patient"
                      onChange={handleChange} required
                      className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                    />
                    <User className="absolute right-3 top-3 text-emerald-400" size={20} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="name">
                    Degree
                  </label>
                  <div className="relative">
                    <input
                      id="degree"
                      type="text"
                      name="degree"
                      placeholder="MBBS, MD, BHMS,.."
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                    />
                    <PenIcon className="absolute right-3 top-3 text-emerald-400" size={20} />
                  </div>
                </div>
              </div>
              <div className="flex flex-row space-x-2">
                <div className="mb-4">
                  <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="name">
                    Years of Experience
                  </label>
                  <div className="relative">
                    <input
                      id="YOE"
                      type="text"
                      name="experience"
                      placeholder="10"
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                    />
                    <Calendar className="absolute right-3 top-3 text-emerald-400" size={20} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="name">
                    Hospital
                  </label>
                  <div className="relative">
                    <input
                      id="hospital"
                      type="text"
                      name="hospital"
                      placeholder="AIIMS"
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                    />
                    <Hospital className="absolute right-3 top-3 text-emerald-400" size={20} />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="name">
                  Address
                </label>
                <div className="relative">
                  <input
                    id="address"
                    type="text"
                    name="address"
                    placeholder="city, state"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                  <Map className="absolute right-3 top-3 text-emerald-400" size={20} />
                </div>
              </div>

                {/* <div className="mb-4">
                  <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
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
                </div> */}
                {/* <div className="mb-4">
                  <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
                    />
                    <Lock className="absolute left-3 top-3 text-emerald-400" size={20} />
                    {showConfirmPassword ? (
                      <EyeOff
                        className="absolute right-3 top-3 text-emerald-400 cursor-pointer"
                        size={20}
                        onClick={() => setShowConfirmPassword(false)}
                      />
                    ) : (
                      <Eye
                        className="absolute right-3 top-3 text-emerald-400 cursor-pointer"
                        size={20}
                        onClick={() => setShowConfirmPassword(true)}
                      />
                    )}
                  </div>
                </div> */}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="phone">
              Work Phone
            </label>
            <div className="relative">
              <input
                id="phone"
                type="text"
                name="phone"
                placeholder="0123456789"
                onChange={handleChange} required
                className="w-full px-4 py-3 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:border-emerald-500"
              />
              <Phone className="absolute right-3 top-3 text-emerald-400" size={20} />
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
                type="text"
                placeholder="••••••••"
                onChange={handleChange} required
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
            <a href="#" className="text-sm text-emerald-600 hover:underline mt-2 block">
              Forgot password?
            </a>
          </div>
          <p className="mt-4 text-sm text-emerald-700">{message}</p>
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 rounded-lg font-bold hover:bg-emerald-600 transition"

          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        {/* <div className="mt-6 flex justify-center space-x-4">
          <button className="flex items-center bg-white border border-emerald-300 px-4 py-2 rounded-lg hover:bg-emerald-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5 mr-2" />
            Log in with Google
          </button>
          <button className="flex items-center bg-white border border-emerald-300 px-4 py-2 rounded-lg hover:bg-emerald-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Microsoft_Logo.svg" alt="Microsoft" className="w-5 h-5 mr-2" />
            Log in with Microsoft
          </button>
        </div>
        <button className="mt-4 bg-white border border-emerald-300 px-4 py-2 rounded-lg hover:bg-emerald-50 w-full max-w-md">
          Log in with SSO
        </button> */}
        <p className="mt-4 text-sm text-emerald-700">
          <button className="text-emerald-600 hover:underline" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Need an account? Register" : "Already have an account? Login"}</button>
        </p>
      </div>

      {/* Right Side: Creative Facts */}
      <div className="w-1/2 bg-gradient-to-br from-emerald-100 to-emerald-200 flex flex-col justify-center items-center p-12 text-emerald-800">
        <div className="max-w-lg">
          <h3 className="text-2xl font-bold mb-4">Did You Know?</h3>
          <p className="mb-4">
            Your heart beats around 100,000 times a day, pumping about 2,000 gallons of blood through your body – that's like filling a swimming pool every week!
          </p>
          <p className="mb-4">
            Meanwhile, your lungs inhale over 11,000 liters of air daily, equivalent to the volume of a small hot air balloon, filtering oxygen to keep you alive and thriving.
          </p>
          <p className="mb-4">
            With Respiscope, monitor these vital rhythms effortlessly, turning everyday health checks into a symphony of well-being.
          </p>
          <div className="bg-emerald-300 text-white p-4 rounded-lg mt-6 inline-block">
            <p className="font-semibold">Dr. Elena Vasquez, Pulmonologist</p>
            <p>"Respiscope revolutionized how I listen to the body's whispers – precise, smart, and life-saving."</p>
          </div>
          <p className="mt-8 text-lg font-bold">Join 500,000+ Health Professionals</p>
        </div>
      </div>
    </div>
  );
};
