import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SidebarLayout from "./layouts/SidebarLayout";
import ProductHandler from "./pages/ProductHandler";
import SettingsPage from "./pages/SettingsPage";
import InventoryStatus from "./pages/InventoryStatusKiosks";
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
            <Route path=":id/dashboard" element={<Dashboard />} />
            <Route path=":id/producthandler" element={<ProductHandler />} />

            <Route
              path=":id/facilitiesandkiosks"
              element={<FacilitiesAndKiosks />}
            />

            <Route path=":id/inventorystatus" element={<InventoryStatus />} />
            <Route path=":id/inventorystorage" element={<InventoryStorage />} />
            <Route
              path=":id/inventorystatusstorage"
              element={<InventoryStatusStorage />}
            />
            <Route
              path=":id/overviewinventories"
              element={<OverviewInventories />}
            />
            <Route
              path=":id/:fid/facilityinventory"
              element={<FacilityOverview />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
