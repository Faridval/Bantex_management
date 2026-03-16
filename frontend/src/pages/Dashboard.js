import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { FileText, Building2, Calendar } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalDepartments: 0,
    documentsToday: 0
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/dashboard"
      );

      setStats({
        totalDocuments: res.data.totalDocuments || 0,
        totalDepartments: res.data.totalDepartments || 0,
        documentsToday: res.data.documentsToday || 0
      });

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  const statCards = [
    {
      icon: FileText,
      label: 'Total Documents',
      value: stats.totalDocuments,
      color: 'bg-blue-100',
      iconColor: 'text-blue-900'
    },
    {
      icon: Building2,
      label: 'Active Departments',
      value: stats.totalDepartments,
      color: 'bg-green-100',
      iconColor: 'text-green-900'
    },
    {
      icon: Calendar,
      label: 'Documents Uploaded Today',
      value: stats.documentsToday,
      color: 'bg-purple-100',
      iconColor: 'text-purple-900'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <div className="flex-1">

        {/* TOP BAR */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">

          <div className="flex items-center justify-between">

            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard
            </h1>

            <div className="flex items-center space-x-3">

              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Welcome back,
                </p>

                <p className="font-semibold text-gray-900">
                  {user?.name}
                </p>
              </div>

              <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

            </div>
          </div>
        </div>


        {/* MAIN CONTENT */}
        <div className="p-8">

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {statCards.map((stat, index) => {

              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
                >

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {stat.label}
                      </p>

                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>

                    <div className={`${stat.color} w-14 h-14 rounded-lg flex items-center justify-center`}>
                      <Icon className={stat.iconColor} size={28} />
                    </div>

                  </div>

                </div>
              );

            })}

          </div>


          {/* WELCOME SECTION */}
          <div className="mt-8 bg-gradient-to-r from-green-900 to-green-700 rounded-xl shadow-lg p-8 text-white">

            <h2 className="text-2xl font-bold mb-2">
              Welcome to Sakura Document Management
            </h2>

            <p className="text-green-100">
              Manage your company documents efficiently.
              Upload new documents, search archives,
              and keep everything organized in one place.
            </p>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;