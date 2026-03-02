import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AudioWaveform from "../../ui/AudioWaveform";
import LiveAudioStream from "../../ui/LiveAudioStream";
import { Button } from "../../ui/Button";

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

  // Get only raw audio messages
  const rawAudioMessages = audioMessages.filter((m) => m.messageType === "audio");

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
              className={`w-full text-left p-3 rounded-lg border ${selectedConsultation?._id === c._id
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
      <div className="flex-1 p-8 overflow-y-auto w-full">

        <div className="border-2 bg-black rounded-lg p-4 mb-6 relative">
          <h3 className="text-green-400 font-bold mb-2 z-10 relative neon-text">Live Vitals Stream</h3>
          <LiveAudioStream />
        </div>

        {!selectedConsultation ? (
          <p className="text-gray-500">
            Select a consultation to view audio files
          </p>
        ) : rawAudioMessages.length === 0 ? (
          <p className="text-gray-500">
            No audio recordings shared in this consultation
          </p>
        ) : (
          <div className="space-y-6">
            {rawAudioMessages.map((rawMsg) => {
              // Find the processed counterpart for this specific raw message
              const processedMsg = audioMessages.find(
                (m) =>
                  m.messageType === "audio_processed" &&
                  String(m.parentFileId) === String(rawMsg.fileId)
              );

              return (
                <div
                  key={rawMsg._id}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-medium text-gray-600">
                      Audio recorded on{" "}
                      {new Date(rawMsg.createdAt).toLocaleString()}
                    </p>
                    <a
                      href={`http://localhost:5000/message/file/${rawMsg.fileId}`}
                      download
                      className="text-sm bg-teal-50 text-teal-700 px-3 py-1 rounded hover:bg-teal-100 transition"
                    >
                      Download Raw
                    </a>
                  </div>

                  <h4 className="font-semibold text-gray-800 mb-2">Raw Heart Sound</h4>
                  <div className="bg-black p-2 rounded-lg shadow-inner">
                    <AudioWaveform fileId={rawMsg.fileId} />
                  </div>
                  <audio
                    controls
                    src={`http://localhost:5000/message/file/${rawMsg.fileId}`}
                    className="w-full mt-3 h-10"
                  />

                  {processedMsg ? (
                    <div className="mt-8 border-t border-gray-100 pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-800">Processed Sound</h4>
                        <a
                          href={`http://localhost:5000/message/file/${processedMsg.fileId}`}
                          download
                          className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-100 transition"
                        >
                          Download Processed
                        </a>
                      </div>
                      <div className="bg-black p-2 rounded-lg shadow-inner">
                        <AudioWaveform fileId={processedMsg.fileId} />
                      </div>
                      <audio
                        controls
                        src={`http://localhost:5000/message/file/${processedMsg.fileId}`}
                        className="w-full mt-3 h-10"
                      />
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <Button
                        onClick={() => processAudio(rawMsg._id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
                      >
                        Run Filter Processing
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">
                        Processing executes standard DSP filters on the backend to isolate heart sounds.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
