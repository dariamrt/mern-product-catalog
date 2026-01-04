import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";

export default function GlobalLayout() {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="layout-content page-container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
