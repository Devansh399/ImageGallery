import { useState } from "react";
import { File, Upload, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { UploadMultipleImage, uploadSingleImage } from "../services/app";
const ImageUpload = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState("single"); // single or multiple
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
    setMessage({ type: "", text: "" });
  };

  const executeUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await (uploadType === "single"
        ? uploadSingleImage(selectedFiles[0])
        : UploadMultipleImage(selectedFiles));

      setMessage({ type: "success", text: result.message });
      setSelectedFiles([]);
      setPreviews([]);

      setTimeout(() => {
        if (onUploadSuccess) onUploadSuccess();
      }, 400);
    } catch (error) {
      const backendMessage = error.response?.data.message ||
        error.response?.data.error ||
        error.message ||
        "Upload Failed";

      setMessage({ type: "error", text: backendMessage });
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex p-1 bg-slate-100 rounded-2xl">
        <button
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all hover:text-slate-700 ${uploadType === "single" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"} `}
          onClick={() => {
            setUploadType("single");
            handleClear();
          }}
        >
          <File className="w-4 h-4" /> Single
        </button>

        <button
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all hover:text-slate-700 ${uploadType === "multiple" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
          onClick={() => {
            setUploadType("multiple");
            handleClear();
          }}
        >
          <File className="w-4 h-4" /> Multiple
        </button>
      </div>

      {/* Dropzone */}

      <label
        className={`relative group cursor-pointer flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed transition-all`}
      >
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple={uploadType === "multiple"}
          onChange={handleFileSelect}
        />
        <div className="bg-white p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
          <Upload
            className={`w-6 h-6 ${selectedFiles.length > 0 ? "text-indigo-600" : "text-slate-400"}`}
          />
        </div>

        <p className="text-sm font-bold text-slate-700">
          {selectedFiles.length === 0
            ? "Choose Image"
            : `${selectedFiles.length} Selected`}
        </p>
      </label>

      {/* Previous grid */}
      {/* Conditional rendering */}

     {previews.length > 0 && (
       <div className="grid grid-cols-4 gap-2">
        {/* Map method */}
        {previews.map((url, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg overflow-hidden border border-slate-200"
          >
            <img src={url} alt={`preview-${i}`} className="w-full object-cover" />
          </div>
        ))}
      </div>

     )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button className="flex-2 p-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all" onClick={executeUpload} disabled={uploading || selectedFiles.length === 0}>
        
          {/* Condtitonal rendering  */}
          {uploading ? <Loader2 className="w-4 h-4 animate-spin"/>  : <Upload className="w-4 h-4"/>}
          
          {uploading ?  "Syncing...." : "Upload Now"}

        </button>

        <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* Status Message */}
      {/* Condtitonal Rendering */}
     {message.text && ( <div className={`flex items-center gap-3 p-4 rounded-2xl border ${message.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"}`}>
       
        
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5"/>
          ) : (
           <AlertCircle className="w-5 h-5"/> 
           
          )}
          <span className="text-xs font-bold uppercase tracking-tight">{message.text}</span>
        
      </div>)}
    </div>
  );
};

export default ImageUpload;
