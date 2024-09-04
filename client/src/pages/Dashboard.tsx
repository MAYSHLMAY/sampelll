import React from "react";
import AdminApplications from "../components/AdminApplications";
import AdminAppointments from "../components/AdminAppointments";
import AdminDoctors from "../components/AdminDoctors";
import Sidebar from "../components/Sidebar";
import Users from "../components/Users";
import Home from "../components/Home";
import Aprofile from "../components/Aprofile";
import ContactMessages from "../components/ContactMessages"; // Import the new component

interface DashboardProps {
  type: "home" | "users" | "doctors" | "applications" | "appointments" | "aprofile" | "contactMessages";
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { type } = props;

  return (
    <>
      <section className="layout-section">
        <div className="layout-container">
          <Sidebar />
          {
            type === "home" ? (
              <Home />
            ) : type === "users" ? (
              <Users />
            ) : type === "doctors" ? (
              <AdminDoctors />
            ) : type === "applications" ? (
              <AdminApplications />
            ) : type === "appointments" ? (
              <AdminAppointments />
            ) : type === "aprofile" ? (
              <Aprofile />
            ) : type === "contactMessages" ? (
              <ContactMessages />
            ) : (
              <></>
            )
          }
        </div>
      </section>
    </>
  );
};

export default Dashboard;