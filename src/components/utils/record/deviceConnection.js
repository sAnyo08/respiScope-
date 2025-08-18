import React from "react";
import { Button } from "../../ui/Button";
import { Bluetooth, Wifi } from "lucide-react";

export default function DeviceConnection() {
  return (
    <div className="bg-teal-50 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Bluetooth className="w-5 h-5 text-teal-700" />
            <h3 className="text-lg font-semibold text-gray-800">IoT Stethoscope Device</h3>
          </div>
          <p className="text-gray-600 mb-4">Connect your IoT stethoscope device to start recording</p>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600">Device Disconnected</span>
          </div>
        </div>

        <Button className="bg-teal-700 hover:bg-teal-800 text-white px-6">
          <Wifi className="w-4 h-4 mr-2" />
          Connect Device
        </Button>
      </div>
    </div>
  );
}
