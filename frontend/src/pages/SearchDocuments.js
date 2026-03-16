import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Search, Eye, Trash2, Download, FileText } from "lucide-react";
import axios from "axios";

const SearchDocuments = () => {

  const [filters, setFilters] = useState({
    department: "",
    year: "",
    date: "",
    kode_bantex: "",
  });

  const [bantexList, setBantexList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);

  // ===============================
  // FETCH DATA
  // ===============================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      setLoading(true);

      const [bantexRes, deptRes] = await Promise.all([
        axios.get("http://localhost:5000/api/bantex"),
        axios.get("http://localhost:5000/api/departments")
      ]);

      setBantexList(bantexRes.data || []);
      setDepartments(deptRes.data || []);

    } catch (error) {

      console.log("Fetch error:", error);

    } finally {

      setLoading(false);

    }
  };

  // ===============================
  // FILTER CHANGE
  // ===============================
  const handleFilterChange = (e) => {

    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // SEARCH
  // ===============================
  const handleSearch = (e) => {

    e.preventDefault();

    const filtered = bantexList.filter((item) => {

      let match = true;

      if (
        filters.department &&
        Number(item.department_id) !== Number(filters.department)
      )
        match = false;

      if (
        filters.kode_bantex &&
        !item.kode_bantex
          ?.toLowerCase()
          .includes(filters.kode_bantex.toLowerCase())
      )
        match = false;

      if (filters.year && item.document_date) {

        const year = new Date(item.document_date)
          .getFullYear()
          .toString();

        if (year !== filters.year)
          match = false;
      }

      if (filters.date && item.document_date) {

        const date = new Date(item.document_date)
          .toISOString()
          .split("T")[0];

        if (date !== filters.date)
          match = false;
      }

      return match;
    });

    setFilteredList(filtered);
  };

  // ===============================
  // RESET
  // ===============================
  const handleReset = () => {

    setFilters({
      department: "",
      year: "",
      date: "",
      kode_bantex: "",
    });

    setFilteredList([]);

  };

  // ===============================
  // VIEW FILES
  // ===============================
  const handleViewFiles = async (bantex_id) => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/bantex/${bantex_id}/files`
      );

      setSelectedFiles(res.data || []);
      setShowFiles(true);

    } catch (error) {

      console.log("File fetch error:", error);

    }
  };

  // ===============================
  // DELETE BANTEX
  // ===============================
  const handleDelete = async (id) => {

    if (!window.confirm("Delete this bantex?")) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/bantex/${id}`
      );

      fetchData();

      setFilteredList(
        filteredList.filter((b) => b.id !== id)
      );

    } catch (error) {

      console.log("Delete error:", error);

    }
  };

  const data = filteredList.length ? filteredList : bantexList;

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <div className="flex-1">

        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">

          <h1 className="text-2xl font-bold text-gray-900">
            Search Bantex
          </h1>

        </div>

        <div className="p-8">

          {/* FILTER */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            <form
              onSubmit={handleSearch}
              className="space-y-4"
            >

              <div className="grid grid-cols-4 gap-4">

                <select
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  className="border p-3 rounded-lg"
                >

                  <option value="">
                    All Department
                  </option>

                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}

                </select>

                <input
                  type="text"
                  name="year"
                  placeholder="Year"
                  value={filters.year}
                  onChange={handleFilterChange}
                  className="border p-3 rounded-lg"
                />

                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  name="kode_bantex"
                  placeholder="Kode Bantex"
                  value={filters.kode_bantex}
                  onChange={handleFilterChange}
                  className="border p-3 rounded-lg"
                />

              </div>

              <div className="flex space-x-4">

                <button
                  type="submit"
                  className="bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
                >
                  <Search size={18} />
                  <span>Search</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="border px-6 py-3 rounded-lg"
                >
                  Reset
                </button>

              </div>

            </form>

          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">

            {loading ? (

              <div className="p-10 text-center text-gray-500">
                Loading documents...
              </div>

            ) : data.length === 0 ? (

              <div className="p-10 text-center text-gray-500">
                No documents found
              </div>

            ) : (

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left">
                      Bantex Name
                    </th>

                    <th className="px-6 py-4 text-left">
                      Department
                    </th>

                    <th className="px-6 py-4 text-left">
                      Kode Bantex
                    </th>

                    <th className="px-6 py-4 text-left">
                      Files
                    </th>

                    <th className="px-6 py-4 text-left">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {data.map((item) => (

                    <tr key={item.id} className="border-b">

                      <td className="px-6 py-4">
                        {item.nama_bantex}
                      </td>

                      <td className="px-6 py-4">
                        {item.department_name}
                      </td>

                      <td className="px-6 py-4">
                        {item.kode_bantex}
                      </td>

                      <td className="px-6 py-4">
                        {item.total_files} files
                      </td>

                      <td className="px-6 py-4 flex space-x-2">

                        <button
                          onClick={() =>
                            handleViewFiles(item.id)
                          }
                          className="p-2 text-blue-900 hover:bg-blue-50 rounded"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(item.id)
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

          {/* FILE MODAL */}
          {showFiles && (

            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

              <div className="bg-white rounded-xl shadow-xl w-[650px] max-h-[500px] flex flex-col">

                <div className="flex justify-between items-center px-6 py-4 border-b">

                  <h2 className="text-lg font-semibold">
                    Bantex Files
                  </h2>

                  <button
                    onClick={() => setShowFiles(false)}
                  >
                    ✕
                  </button>

                </div>

                <div className="p-6 overflow-y-auto">

                  {selectedFiles.length === 0 ? (

                    <p className="text-gray-500 text-center">
                      No files found
                    </p>

                  ) : (

                    selectedFiles.map((file) => (

                      <div
                        key={file.id}
                        className="flex items-center justify-between border rounded-lg px-4 py-3 mb-3"
                      >

                        <div className="flex items-center space-x-3">

                          <FileText size={20} />

                          <span className="text-sm truncate max-w-[350px]">
                            {file.file_name}
                          </span>

                        </div>

                        <div className="flex space-x-2">

                          <button
                            onClick={() =>
                              window.open(
                                `http://localhost:5000/${file.file_path}`,
                                "_blank"
                              )
                            }
                            className="p-2 text-blue-900"
                          >
                            <Eye size={18} />
                          </button>

                          <a
                            href={`http://localhost:5000/${file.file_path}`}
                            download
                            className="p-2 text-green-700"
                          >
                            <Download size={18} />
                          </a>

                          <button
                            onClick={async () => {

                              if (
                                !window.confirm(
                                  "Delete this file?"
                                )
                              )
                                return;

                              await axios.delete(
                                `http://localhost:5000/api/files/${file.id}`
                              );

                              setSelectedFiles(
                                selectedFiles.filter(
                                  (f) => f.id !== file.id
                                )
                              );

                            }}
                            className="p-2 text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>

                      </div>

                    ))

                  )}

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default SearchDocuments;