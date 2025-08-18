"use client"

import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { Calendar, MapPin, Phone } from "lucide-react"

export function DoctorCard({ doctor, onConsult }) {
  return (
    <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-lg">{doctor.avatar}</span>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
            <p className="text-sm text-gray-600">{doctor.credentials}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{doctor.experience} years experience</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{doctor.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{doctor.phone}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
              ID: {doctor.doctorId}
            </span>

            <Button onClick={() => onConsult(doctor.id)} className="bg-teal-700 hover:bg-teal-800 text-white px-6">
              Consult Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
