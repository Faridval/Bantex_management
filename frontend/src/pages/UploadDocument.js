import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Upload } from "lucide-react";
import Swal from "sweetalert2";

const UploadDocument = () => {

  const [departments, setDepartments] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama_bantex: "",
    department_id: "",
    document_date: "",
    kode_bantex: "",
  });

  // =========================
  // FETCH DEPARTMENTS
  // =========================
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/departments"
      );

      setDepartments(res.data || []);

    } catch (error) {

      console.error("Department fetch error:", error);

    }
  };

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  // =========================
  // HANDLE FILE SELECT
  // =========================
  const handleFileChange = (e) => {

    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

  };

  // =========================
  // REMOVE FILE
  // =========================
  const removeFile = (index) => {

    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

  };

  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!files.length) {
      alert("Please select file(s)");
      return;
    }

    try {

      setLoading(true);

      const data = new FormData();

      data.append("nama_bantex", formData.nama_bantex);
      data.append("department_id", formData.department_id);
      data.append("document_date", formData.document_date);
      data.append("kode_bantex", formData.kode_bantex);

      const user = JSON.parse(localStorage.getItem("user"));
      data.append("created_by", user?.id || 1);

      files.forEach((file) => {
        data.append("files", file);
      });

      const res = await axios.post(
        "http://localhost:5000/api/bantex",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {

Swal.fire({
  icon: "success",
  title: "Upload Successful",
  text: "Bantex uploaded successfully",
  confirmButtonColor: "#1e3a8a",
});

        setFormData({
          nama_bantex: "",
          department_id: "",
          document_date: "",
          kode_bantex: "",
        });

        setFiles([]);

      }

    } catch (error) {

      console.error("Upload error:", error);
      alert("Upload failed");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <div className="flex-1">

        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">

          <h1 className="text-2xl font-bold text-gray-900">
            Upload Bantex
          </h1>

        </div>

        {/* CONTENT */}
        <div className="p-8">

          <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* BANTEX NAME */}
              <input
                type="text"
                name="nama_bantex"
                placeholder="Bantex Name"
                value={formData.nama_bantex}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              {/* DEPARTMENT */}
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              >

                <option value="">Select Department</option>

                {departments.map((dept) => (

                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>

                ))}

              </select>

              {/* DATE */}
              <input
                type="date"
                name="document_date"
                value={formData.document_date}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />

              {/* KODE BANTEX */}
              <input
                type="text"
                name="kode_bantex"
                placeholder="Kode Bantex"
                value={formData.kode_bantex}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />

              {/* FILE UPLOAD */}
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full border p-3 rounded-lg"
              />

              {/* FILE LIST */}
              {files.length > 0 && (

                <div className="bg-gray-50 p-3 rounded-lg">

                  <p className="text-sm font-semibold mb-2">
                    Selected Files:
                  </p>

                  {files.map((file, index) => (

                    <div
                      key={index}
                      className="flex justify-between text-sm mb-1"
                    >

                      <span>{file.name}</span>

                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>

                    </div>

                  ))}

                </div>

              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-900 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-800 transition"
              >

                <Upload size={18} />

                <span>
                  {loading ? "Uploading..." : "Upload Bantex"}
                </span>

              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UploadDocument;