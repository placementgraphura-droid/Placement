import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UploadCloud, FileSpreadsheet, X } from "lucide-react";

const ImportInternPopup = ({ isOpen, onClose }) => {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an Excel file");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/admin/import-interns", formData);

      toast.success(res.data.message || "Import successful");

      setFile(null);
      onClose();

    } catch (err) {
      console.error(err);
      toast.error("Import failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10 relative">

        {/* Close Icon */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <FileSpreadsheet className="text-[#5B35CD]" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">
            Import Interns
          </h2>
        </div>

        {/* File Input */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-[#5B35CD] transition">

          <UploadCloud size={28} className="text-gray-400 mb-2" />

          <span className="text-sm text-gray-500">
            {file ? file.name : "Click to upload Excel file"}
          </span>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">

          <button
            onClick={handleUpload}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2
            bg-gradient-to-r from-[#5B35CD] to-[#7C5CFF]
            text-white py-3 rounded-2xl font-semibold
            hover:scale-[1.02] transition-all"
          >
            <UploadCloud size={18} />
            {loading ? "Importing..." : "Import"}
          </button>

          <button
            onClick={handleClose}
            className="px-4 py-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
};

export default ImportInternPopup;