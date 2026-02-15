import React from "react";
import { Mic, Share2, Clock, Calendar } from "lucide-react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
//import { Label } from "../../ui/Label";

export default function RecentRecordings({ recordings }) {
  return (
    <div className="bg-teal-50 rounded-lg p-6 mt-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Recordings</h3>
        <p className="text-gray-600">Your recorded heart and lung sounds</p>
      </div>

      {recordings.length > 0 ? (
        <div className="space-y-4">
          {recordings.map((recording) => (
            <div key={recording.id} className="bg-white rounded-lg p-4 border border-teal-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{recording.stepName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(recording.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{recording.duration}s</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                  Step {recording.step}
                </span>
              </div>
            </div>
          ))}

          <div className="mt-6 pt-4 border-t border-teal-200">
            <div className="space-y-4">
              <div className="space-y-2">
                <p htmlFor="doctor-code" className="text-sm font-medium text-gray-700">
                  Doctor Code
                </p>
                <Input id="doctor-code" type="text" placeholder="Enter doctor's code to share" className="w-full" />
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                <Share2 className="w-4 h-4 mr-2" />
                Share with Doctor
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mb-4">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 text-lg mb-6">No recordings yet</p>

          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <p htmlFor="doctor-code" className="text-sm font-medium text-gray-700">
                Doctor Code
              </p>
              <Input id="doctor-code" type="text" placeholder="Enter doctor's code to share" className="w-full" />
            </div>
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share with Doctor
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
