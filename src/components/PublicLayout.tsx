import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrerenderReady from "@/components/PrerenderReady";

export default function PublicLayout() {
  return (
    <>
      <PrerenderReady />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
