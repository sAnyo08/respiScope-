"use client"

import { useState , useEffect} from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card"
import { Button } from "../../ui/Button"
import { Input } from "../../ui/Input"
import { Search, User } from "lucide-react"
import PatientCard from "../../utils/PatientCard"
import { getPatients } from "../../../services/api/patientService.js";

// const patients = [
//   { id: 1, name: "John Smith", age: 45, gender: "Male", lastVisit: "2024-01-15", condition: "Hypertension", status: "Active" },
//   { id: 2, name: "Sarah Johnson", age: 32, gender: "Female", lastVisit: "2024-01-14", condition: "Asthma", status: "Active" },
//   { id: 3, name: "Michael Brown", age: 58, gender: "Male", lastVisit: "2024-01-13", condition: "Diabetes", status: "Follow-up" },
//   { id: 4, name: "Emily Davis", age: 28, gender: "Female", lastVisit: "2024-01-12", condition: "Migraine", status: "Active" },
// ]

const DrPatients = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error("Failed to load patients", error);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      <Card className="w-full max-w-6xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Patient Management System
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Manage patient records and medical data
            </p>
          </div>
          <Link to="/doctor-login">
            <Button variant="destructive">Logout</Button>
          </Link>
        </CardHeader>

        <CardContent>
          {/* Search bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search patients by name or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Patients grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>

          {/* No results */}
          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DrPatients
