"use client"

import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { User, Calendar, FileText } from "lucide-react"

const PatientCard = ({ patient }) => {
  return (
    <Card className="hover:shadow-lg transition cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {/* Patient name */}
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">{patient.name}</CardTitle>
          </div>

          {/* Status badge */}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              patient.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {patient.status}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <p>
            <span className="font-medium">Age:</span> {patient.age} years
          </p>
          <p>
            <span className="font-medium">Gender:</span> {patient.gender}
          </p>
          <p>
            <span className="font-medium">Condition:</span> {patient.condition}
          </p>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Last visit: {patient.lastVisit}</span>
          </div>
        </div>

        <Link to={`/patients/chat/${patient.userId}`}>
          <Button className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default PatientCard
