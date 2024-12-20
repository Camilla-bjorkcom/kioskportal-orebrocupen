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
import InventoryStatusStorage from "./pages/InventoryStatusStorage";
import PopulateKiosks from "./pages/PopulateKiosks";

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
            <Route path="dashboard/:id" element={<Dashboard />} />
            <Route path="producthandler/:id" element={<ProductHandler />} />
            <Route path="settings/:id" element={<SettingsPage />} />
            <Route path="kioskmanager/:id" element={<Kioskmanager />} />
            <Route
              path="productlisthandler/:id"
              element={<ProductListHandler />}
            />
            <Route path="inventorystatus/:id" element={<InventoryStatus />} />
            <Route path="inventorystorage/:id" element={<InventoryStorage />} />
            <Route path="inventorystatusstorage/:id" element={<InventoryStatusStorage />} />
            <Route path="contactperson/:id" element={<ContactPerson />} />
            <Route path="populatekiosks/:id" element={<PopulateKiosks />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
