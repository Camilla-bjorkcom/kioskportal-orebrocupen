import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavLayout from "./layouts/NavLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavLayout />}>
          <Route index element={<Home />} />
          <Route path="tournaments">
            <Route index element={<p>Not found</p>} />
            <Route path="new" element={<p>New item</p>} />
            <Route path=":id" element={<NavLayout />}>
              <Route index element={<Home />} />
            </Route>
          </Route>
          <Route path="dashboard" >
            <Route index element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
