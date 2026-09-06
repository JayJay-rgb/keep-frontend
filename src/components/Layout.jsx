import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;