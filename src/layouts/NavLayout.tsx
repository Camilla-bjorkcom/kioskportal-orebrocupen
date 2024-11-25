import Footer from "@/components/footer";
import Header from "@/components/header";
import { Outlet } from "react-router-dom";

function NavLayout() {
  return (
    <>
      <div className="wrapper">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default NavLayout;
