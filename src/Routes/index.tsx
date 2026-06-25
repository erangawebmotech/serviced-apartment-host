import { Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import PropertyRoutes from "../Routes/Routes"; // Your array of route objects
import HostHomePage from "../pages/HostHomePage"; // Your array of route objects
import NotFoundPage from "../pages/NotFoundPage";
import { AdminPanelRouteEnum } from "../common/enums/adminPanelRouteEnum";
import AdminPanelRouteHandler from "../components/propertyListingSteps/AdminPanelRouteHandler";

const Index = () => {
  return (
    <Suspense>
      <Routes>
        {PropertyRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}
        <Route path="/admin-edit-property/:propertyId" element={<AdminPanelRouteHandler purpose={AdminPanelRouteEnum.ADMIN_PROPERTY_EDIT} />} />
        <Route path="/admin-calendar/:propertyId" element={<AdminPanelRouteHandler purpose={AdminPanelRouteEnum.ADMIN_CALENDAR_REDIRECT} />} />
        <Route path="/admin-listings" element={<AdminPanelRouteHandler purpose={AdminPanelRouteEnum.ADMIN_PROPERTY_LISTING} />} />
        <Route key={"2323"} path={"/"} element={<HostHomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default Index;
