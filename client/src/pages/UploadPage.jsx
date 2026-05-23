import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  Upload,
  FileText,
  Image,
  X,
  Sparkles,
  CheckCircle,
  Plane,
  Hotel,
  Train,
} from "lucide-react";

// what types of documents users can upload — shown as feature cards
const DOC_TYPES = [
  { icon: Plane, label: "Flight Tickets", desc: "Boarding passes, e-tickets" },
  {
    icon: Hotel,
    label: "Hotel Bookings",
    desc: "Confirmation emails, vouchers",
  },
  { icon: Train, label: "Train Tickets", desc: "Rail bookings, passes" },
  { icon: FileText, label: "Any Travel Doc", desc: "PDFs or images work" },
];

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [step, setStep] = useState("upload"); // upload → extracting → generating → done
  const navigate = useNavigate();

  const onDrop = useCallback((accepted) => {
    setFiles((prev) => [...prev, ...accepted].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
  });

  const removeFile = (index) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleGenerate = async () => {
    if (files.length === 0)
      return toast.error("Please upload at least one document");
    setStep("extracting");
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("documents", f));

      const { data: uploadData } = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStep("generating");

      const { data: itineraryData } = await api.post("/itineraries/generate", {
        extractedData: uploadData.extractedData,
        files: uploadData.files,
      });

      setStep("done");
      setTimeout(
        () => navigate(`/itinerary/${itineraryData.itinerary._id}`),
        1500
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      setStep("upload");
    }
  };

  // loading screen while AI processes
  if (step !== "upload") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6">
          {step === "done" ? (
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          ) : (
            // animated AI processing indicator
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 border-t-sky-500 animate-spin" />
              <div
                className="absolute inset-2 rounded-full border-4 border-indigo-500/20 border-b-indigo-500 animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-sky-400" />
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-white mb-3">
            {step === "extracting" && "Reading your documents..."}
            {step === "generating" && "Building your itinerary..."}
            {step === "done" && "Your itinerary is ready!"}
          </h2>
          <p className="text-gray-400">
            {step === "extracting" &&
              "Gemini AI is scanning your travel documents and extracting booking details"}
            {step === "generating" &&
              "Creating a personalized day-by-day plan based on your bookings"}
            {step === "done" && "Redirecting you to your new itinerary..."}
          </p>

          {/* progress dots */}
          {step !== "done" && (
            <div className="flex justify-center gap-1.5 mt-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-2xl mx-auto">
        {/* page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-indigo-500/20 
              flex items-center justify-center border border-sky-500/20"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-sky-400 text-sm font-medium">AI-Powered</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Upload Travel Documents
          </h1>
          <p className="text-gray-400">
            Upload your booking confirmations and our AI will instantly create a
            structured day-by-day itinerary for your trip.
          </p>
        </div>

        {/* document type cards — shows what can be uploaded */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {DOC_TYPES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
            ${
              isDragActive
                ? "border-sky-500 bg-sky-500/10 scale-[1.02]"
                : "border-white/20 hover:border-sky-500/50 hover:bg-white/5"
            }`}
        >
          <input {...getInputProps()} />
          <div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 
            flex items-center justify-center mx-auto mb-4 border border-sky-500/20"
          >
            <Upload className="w-6 h-6 text-sky-400" />
          </div>
          <p className="text-white font-semibold text-lg mb-1">
            {isDragActive
              ? "Drop your files here"
              : "Drag & drop your documents"}
          </p>
          <p className="text-gray-500 text-sm mb-3">or click to browse files</p>
          <span
            className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 
            text-gray-500 text-xs"
          >
            PDF, JPG, PNG, WEBP — max 10MB per file, up to 5 files
          </span>
        </div>

        {/* file list */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/5 rounded-xl border border-white/10 p-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  {file.type === "application/pdf" ? (
                    <FileText className="w-4 h-4 text-red-400" />
                  ) : (
                    <Image className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{file.name}</p>
                  <p className="text-gray-500 text-xs">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                {/* green checkmark shows file is ready */}
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <button
                  onClick={() => removeFile(i)}
                  className="text-gray-600 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* generate button */}
        <button
          onClick={handleGenerate}
          disabled={files.length === 0}
          className="btn-primary w-full mt-6 py-4 text-base flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Generate Itinerary with AI
        </button>

        {files.length === 0 && (
          <p className="text-center text-gray-600 text-sm mt-3">
            Upload at least one document to continue
          </p>
        )}
      </div>
    </div>
  );
}
