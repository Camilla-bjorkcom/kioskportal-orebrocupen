import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import Topbar from "@/components/Topbar";
import { useGetTournament } from "@/hooks/use-query";


function SideBarLayout() {
  const { id } = useParams<{ id: string }>();
  const { isLoading, error, data, isSuccess } = useGetTournament(id!);

  if (isLoading) {
    return (
      <div className="container mx-auto px-5 py-10 flex justify-center items-center">
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          ></div>
          <p className="mt-4 text-gray-500">Laddar turneringsdata...</p>
        </div>
      </div>
    );
  }

  if (!isSuccess) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar id={data.id} />
      <main className="w-full ">
      <Topbar
        leftComponent={<SidebarTrigger className="sm:hidden" />}
          tournamentName={data.tournamentName}
        />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default SideBarLayout;
