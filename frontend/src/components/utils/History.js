import { Button } from "../ui/Button";
import { Heart, Mic, User, Users, Clock, LogOut } from "lucide-react";

const History = () => (
    <main className="px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Consultation History</h2>
          <p className="text-gray-600">View your past consultations and recordings</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-teal-700 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 text-lg mb-8">No consultations yet</p>
          <Button className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2">
            Start First Recording
          </Button>
        </div>
      </div>
    </main>
  );

export default History;