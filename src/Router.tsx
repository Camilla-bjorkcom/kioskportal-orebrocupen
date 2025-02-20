import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SidebarLayout from "./layouts/SidebarLayout";
import ProductHandler from "./pages/ProductHandler";
import SettingsPage from "./pages/SettingsPage";
import InventoryStatus from "./pages/InventoryStatus";
import InventoryStorage from "./pages/InventoryStorage";
import InventoryStatusStorage from "./pages/InventoryStatusStorage";
import FacilitiesAndKiosks from "./pages/FacilitiesAndKiosks";
import Tournaments from "./pages/Tournaments";
import OverviewInventories from "./pages/OverviewInventories";
import FacilityOverview from "./pages/FacilityOverview";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="settings">
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="tournaments">
            <Route path="/tournaments" element={<Tournaments />} />
          </Route>
          <Route element={<SidebarLayout />}>
            <Route path="dashboard/:id" element={<Dashboard />} />
            <Route path="producthandler/:id" element={<ProductHandler />} />

            <Route
              path="facilitiesandkiosks/:id"
              element={<FacilitiesAndKiosks />}
            />

            <Route path="inventorystatus/:id" element={<InventoryStatus />} />
            <Route path="inventorystorage/:id" element={<InventoryStorage />} />
            <Route
              path="inventorystatusstorage/:id"
              element={<InventoryStatusStorage />}
            />
            <Route
              path="overviewinventories/:id"
              element={<OverviewInventories />}
            />
            <Route
              path="facilityinventory/:id/:fid"
              element={<FacilityOverview />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
