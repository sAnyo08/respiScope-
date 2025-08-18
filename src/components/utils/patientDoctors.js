import { Button } from "../ui/Button";
import { Heart, Mic, User, Users, Clock, LogOut } from "lucide-react";
import { DoctorCard } from "./DoctorCard";
import { useState } from "react";

const doctors = [
    { id: "1", name: "1234", credentials: "MD", experience: 3, location: "daefrgt", phone: "asdfgh", doctorId: "DOC913337", avatar: "1" },
    { id: "2", name: "1234", credentials: "yuvu", experience: 5, location: "ychgvjbk", phone: "1234567890", doctorId: "DOC698293", avatar: "1" },
    { id: "3", name: "sanyo", credentials: "md", experience: 12, location: "123456", phone: "1234567890", doctorId: "DOC579789", avatar: "S" },
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