import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AudioWaveform from "../../ui/AudioWaveform";
import {Button} from "../../ui/Button";

const PatientDetails = () => {
  const { patientId } = useParams();
  const token = localStorage.getItem("accessToken");

  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [audioMessages, setAudioMessages] = useState([]);

  /* ---------------- FETCH PATIENT ---------------- */
  useEffect(() => {
    fetch(`http://localhost:5000/api/patients/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setPatient);
  }, [patientId, token]);

  /* ---------------- FETCH CONSULTATIONS ---------------- */
  useEffect(() => {
    fetch(
      `http://localhost:5000/api/consultations/doctor/patient/${patientId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((r) => r.json())
      .then(setConsultations);
  }, [patientId, token]);

  /* ---------------- FETCH AUDIO FILES ---------------- */
  useEffect(() => {
    if (!selectedConsultation) return;

    fetch(
      `http://localhost:5000/message/consultation/${selectedConsultation._id}/audio`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((r) => r.json())
      .then(setAudioMessages);
  }, [selectedConsultation, token]);

  const processAudio = async (messageId) => {
    await fetch(
      `http://localhost:5000/api/audio/process/${messageId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    alert("Processing started. Refresh in a moment.");
  };  

  const rawAudio = audioMessages.find(
    (m) => m.messageType === "audio"
  );
  
  const processedAudio = rawAudio
    ? audioMessages.find(
        (m) =>
          m.messageType === "audio_processed" &&
          String(m.parentFileId) === String(rawAudio.fileId)
      )
    : null;
  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ---------- SIDEBAR ---------- */}
      <div className="w-80 bg-white border-r p-6 overflow-y-auto">
        {patient && (
          <>
            <h2 className="text-xl font-bold">{patient.name}</h2>
            <p className="text-sm text-gray-600">
              Age: {patient.age} | Phone: {patient.phone}
            </p>
          </>
        )}

        <h3 className="mt-6 mb-3 font-semibold text-gray-700">
          Consultations
        </h3>

        <div className="space-y-2">
          {consultations.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedConsultation(c)}
              className={`w-full text-left p-3 rounded-lg border ${
                selectedConsultation?._id === c._id
                  ? "bg-teal-100 border-teal-400"
                  : "hover:bg-gray-100"
              }`}
            >
              <p className="text-sm font-medium">
                Consultation #{c._id.slice(-6)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="flex-1 p-8 overflow-y-auto">
        {!selectedConsultation ? (
          <p className="text-gray-500">
            Select a consultation to view audio files
          </p>
        ) : audioMessages.length === 0 ? (
          <p className="text-gray-500">
            No audio recordings shared in this consultation
          </p>
        ) : (
          <div className="space-y-6">
            {audioMessages.map((msg) => (
              <div
                key={msg._id}
                className="bg-white p-4 rounded-xl shadow"
              >
                <p className="text-sm font-medium mb-2">
                  Audio recorded on{" "}
                  {new Date(msg.createdAt).toLocaleString()}
                </p>

                {rawAudio && (
                  <>
                    <h4 className="font-semibold">Raw Audio</h4>
                    <AudioWaveform fileId={rawAudio.fileId} />
                  </>
                )}

                {processedAudio && (
                  <>
                    <h4 className="font-semibold mt-6">Processed Audio</h4>
                    <AudioWaveform fileId={processedAudio.fileId} />
                  </>
                )}


                <audio
                  controls
                  src={`http://localhost:5000/message/file/${msg.fileId}`}
                  className="w-full mt-2"
                />

                <a
                  href={`http://localhost:5000/message/file/${msg.fileId}`}
                  download
                  className="text-xs text-teal-600 hover:underline mt-2 inline-block"
                >
                  Download audio
                </a>
                <Button
                  onClick={() => processAudio(msg._id)}
                  className="bg-indigo-600 text-white mt-3"
                >
                  Process Audio (MATLAB)
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
