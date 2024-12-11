import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SidebarLayout from "./layouts/SidebarLayout";
import ProductHandler from "./pages/ProductHandler";
import CreateTournament from "./pages/CreateTournament";
import Kioskmanager from "./pages/Kioskmanager";
import SettingsPage from "./pages/SettingsPage";
import ProductListHandler from "./pages/ProductListHandler";
import InventoryStatus from "./pages/InventoryStatus";
import InventoryStorage from "./pages/InventoryStorage";
import ContactPerson from "./pages/ContactPerson";



function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="createtournament">
            <Route path="/createtournament" element={<CreateTournament />} />
          </Route>
          <Route element={<SidebarLayout />}>
            <Route path="tournaments">
              <Route index element={<p>Not found</p>} />
              <Route path="new" element={<p>New item</p>} />
            </Route>
            <Route path="dashboard">
              <Route path=":id" element={<Dashboard />} />{" "}
            </Route>
            <Route path="producthandler">
              <Route path=":id" element={<ProductHandler />} />
            </Route>
            <Route path="settings">
              <Route path=":id" element={<SettingsPage />} />
            </Route>
            <Route path="kioskmanager">
              <Route path=":id" element={<Kioskmanager />} />
            </Route>
            <Route path="productlisthandler">
              <Route path=":id" element={<ProductListHandler />} />
            </Route>
            <Route path="inventorystatus">
              <Route path=":id" element={<InventoryStatus />} />
            </Route>
            <Route path="inventorystorage">
              <Route path=":id" element={<InventoryStorage />} />
            </Route>
            <Route path="contactperson">
              <Route path=":id" element={<ContactPerson />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
