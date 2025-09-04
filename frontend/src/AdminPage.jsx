
import AdminNavbar from "./components/AdminNavbar";
import FloatingIcons from "./components/FloatingIcons";


const AdminPage = () => {

 
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      {/* Floating background */}
      <FloatingIcons />

      {/* Navbar */}
      <AdminNavbar />

     
    </div>
  );
};

export default AdminPage;
