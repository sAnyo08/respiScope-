import { Card, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Calendar, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export function DoctorCard({ doctor, onConsult }) {
  return (
    <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-lg">{doctor.name ? doctor.name[0] : 'D'}</span>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <CardTitle className="text-lg">{doctor.name}</CardTitle>
            <p className="text-sm text-gray-600">{doctor.degree || 'Not specified'}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{doctor.experience || 'N/A'} years experience</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{doctor.address || 'Not specified'}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{doctor.phone || 'Not specified'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
              ID: {doctor.doctorId || 'N/A'}
            </span>

            <Button 
              onClick={() => onConsult(doctor._id)} 
              className="bg-teal-700 hover:bg-teal-800 text-white px-6"
            >
              Consult Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}