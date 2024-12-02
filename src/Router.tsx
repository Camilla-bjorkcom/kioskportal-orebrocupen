import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavLayout from "./layouts/NavLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SidebarLayout from "./layouts/SidebarLayout";
import ProductHandler from "./pages/ProductHandler";
import CreateTournament from "./pages/CreateTournament";
import SignUpPage from "./pages/SignUpPage";
import Kioskmanager from "./pages/Kioskmanager";

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
            <Route path="kioskmanager">
              <Route path="/kioskmanager" element={<Kioskmanager />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
