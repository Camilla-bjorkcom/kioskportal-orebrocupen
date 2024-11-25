import Footer from "@/components/footer";
import Header from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

function NavLayout() {
  return (
    <SidebarInset>
      <div className="flex flex-col">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </SidebarInset>
  );
}

export default NavLayout;
