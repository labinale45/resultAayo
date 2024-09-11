import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Copyright from "@/components/Mini Component/Copyright";

export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen dark:bg-[#253553] ">
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
      <Copyright />
    </div>
  );
}
