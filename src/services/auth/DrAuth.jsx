"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { AuthContext } from "../../context/authContext"

export default function DoctorAuth() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext);
  const [authMode, setAuthMode] = useState("login")
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    degree: "",
    experience: "",
    phone: "",
    address: "",
    hospital: "",
    password: "",
  })
  const [doctorCode, setDoctorCode] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setDoctorForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (authMode === "signup") {
      const code = "DOC-" + Math.floor(1000 + Math.random() * 9000)
      setDoctorCode(code)
      alert(`Signup successful! Your Doctor Code is: ${code}`)
      navigate("/doctor-dashboard") // redirect after signup
    } else {
      alert("Login successful!")
      navigate("/doctor-dashboard") // redirect after login
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mint-100 to-mint-200 p-6">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-mint-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-mint-800">
            {authMode === "login" ? "Doctor Login" : "Doctor Sign Up"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Toggle buttons */}
          <div className="flex justify-center mb-6 space-x-2">
            <Button
              variant={authMode === "login" ? "default" : "outline"}
              onClick={() => setAuthMode("login")}
              className={`w-1/2 ${
                authMode === "login"
                  ? "bg-mint-600 text-white hover:bg-mint-700"
                  : "border-mint-400 text-mint-600 hover:bg-mint-100"
              }`}
            >
              Login
            </Button>
            <Button
              variant={authMode === "signup" ? "destructive" : "outline"}
              onClick={() => setAuthMode("signup")}
              className={`w-1/2 ${
                authMode === "signup"
                  ? "bg-mint-600 text-white hover:bg-mint-700"
                  : "border-mint-400 text-mint-600 hover:bg-mint-100"
              }`}
            >
              Sign Up
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "login" ? (
              <>
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={doctorForm.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={doctorForm.password}
                  onChange={handleChange}
                  required
                />
              </>
            ) : (
              <>
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={doctorForm.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="degree"
                  placeholder="Degree"
                  value={doctorForm.degree}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="number"
                  name="experience"
                  placeholder="Experience (Years)"
                  value={doctorForm.experience}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={doctorForm.phone}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={doctorForm.address}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="hospital"
                  placeholder="Hospital / Clinic"
                  value={doctorForm.hospital}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={doctorForm.password}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-mint-600 text-white hover:bg-mint-700"
            >
              {authMode === "login" ? "Login" : "Sign Up"}
            </Button>
          </form>

          {doctorCode && (
            <div className="mt-4 p-3 bg-mint-100 text-mint-800 rounded-lg text-center border border-mint-300">
              <p>
                Your Doctor Code: <b>{doctorCode}</b>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
