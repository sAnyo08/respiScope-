// import { Button } from "../ui/Button";
//import { Heart, Mic, User, Users, Clock, LogOut, Doctor } from "lucide-react";
import { DoctorCard } from "./DoctorCard";
//import { useState } from "react";

const doctors = [
    { id: "1", name: "Dr. Adarsh Gupta", credentials: "MD", experience: 25, location: "Mumbai", phone: "3456255565", doctorId: "DOC913337", avatar: "AD" },
    { id: "2", name: "Dr. Allan Monis", credentials: "BHMS", experience: 5, location: "Chennai", phone: "1234567890", doctorId: "DOC698293", avatar: "AL" },
    { id: "3", name: "Dr. Sanyo Fonseca", credentials: "MBBS", experience: 12, location: "Bangalore", phone: "1234567890", doctorId: "DOC579789", avatar: "SA" },
    { id: "4", name: "Dr. Vatsal C", credentials: "MBBS", experience: 12, location: "Delhi", phone: "1234567890", doctorId: "DOC577258", avatar: "VA" },
  ]

// const [activeTab, setActiveTab] = useState("doctors")
// const [selectedDoctorId, setSelectedDoctorId] = useState("")

//   const handleConsult = (doctorId) => {
//       setSelectedDoctorId(doctorId)
//       setActiveTab("record")
//     }



const PaitentDoctors = () => (
    <main className="px-6 py-8">
      <div className="bg-teal-50 rounded-lg p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Available Doctors</h2>
                <p className="text-gray-600">Choose a doctor for your consultation</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} /> 
                //   onsubmit={handleConsult}
                ))}
              </div>
            </div>
    </main>
  );

export default PaitentDoctors;