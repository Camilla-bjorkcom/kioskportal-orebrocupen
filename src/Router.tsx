import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavLayout from "./layouts/NavLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SidebarLayout from "./layouts/SidebarLayout";
import ProductHandler from "./pages/ProductHandler";
import CreateTournament from "./pages/CreateTournament";
import Kioskmanager from "./pages/Kioskmanager";
import SettingsPage from "./pages/SettingsPage";
import ProductListHandler from "./pages/ProductListHandler";
import InventoryStatus from "./pages/InventoryStatus";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="createtournament">
              <Route path="/createtournament" element={<CreateTournament />} />
            </Route>
          <Route  element={<SidebarLayout />}>
            <Route path="tournaments" >
              <Route index element={<p>Not found</p>} />
              <Route path="new" element={<p>New item</p>} />
              <Route path=":id" element={<NavLayout />}>
                <Route index element={<Home />} />
              </Route>
            </Route>
            <Route path="dashboard">
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="producthandler">
              <Route path="/producthandler" element={<ProductHandler />} />
            </Route>
            <Route path="settings">
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="kioskmanager">
              <Route path="/kioskmanager" element={<Kioskmanager />} />
            </Route>
            <Route path="productlisthandler">
              <Route path="/productlisthandler" element={<ProductListHandler />} />
            </Route>
            <Route path="inventorystatus">
              <Route path="/inventorystatus" element={<InventoryStatus />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
