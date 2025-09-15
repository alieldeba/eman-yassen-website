import { Route, Routes as Routers } from "react-router-dom";
import React from "react";
import Admin from "./pages/Admin";

const Groups = React.lazy(() => import("./pages/Groups"));
const GroupDetails = React.lazy(() => import("./pages/GroupDetails"));
const AddGroup = React.lazy(() => import("./pages/AddGroup"));
const EditGroup = React.lazy(() => import("./pages/EditGroup"));
const AddStudent = React.lazy(() => import("./pages/AddStudent"));
const EditStudent = React.lazy(() => import("./pages/EditStudent"));
const StudentMarks = React.lazy(() => import("./pages/StudentMarks"));
const AddMark = React.lazy(() => import("./pages/AddMark"));
const EditMark = React.lazy(() => import("./pages/EditMark"));
const Login = React.lazy(() => import("./pages/Login"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const BarCode = React.lazy(() => import("./pages/BarCode"));

import RequireAuth from "./middlewares/RequireAuth";
import RequireNonAuth from "./middlewares/RequireNonAuth";

function Routes() {
  return (
    <>
      <Routers>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Groups />
            </RequireAuth>
          }
        />
        <Route
          path="/groups/:id"
          element={
            <RequireAuth>
              <GroupDetails />
            </RequireAuth>
          }
        />
        <Route
          path="/groups/new"
          element={
            <RequireAuth>
              <AddGroup />
            </RequireAuth>
          }
        />
        <Route
          path="/groups/:id/edit"
          element={
            <RequireAuth>
              <EditGroup />
            </RequireAuth>
          }
        />
        <Route
          path="/groups/:id/new"
          element={
            <RequireAuth>
              <AddStudent />
            </RequireAuth>
          }
        />
        <Route
          path="/students/:id/edit"
          element={
            <RequireAuth>
              <EditStudent />
            </RequireAuth>
          }
        />
        <Route
          path="/students/:id/marks"
          element={
            <RequireAuth>
              <StudentMarks />
            </RequireAuth>
          }
        />
        <Route
          path="/students/:id/marks/new"
          element={
            <RequireAuth>
              <AddMark />
            </RequireAuth>
          }
        />
        <Route
          path="/students/:id/marks/:id"
          element={
            <RequireAuth>
              <EditMark />
            </RequireAuth>
          }
        />
        <Route
          path="/change-password"
          element={
            <RequireAuth>
              <Admin />
            </RequireAuth>
          }
        />
        <Route
          path="/login"
          element={
            <RequireNonAuth>
              <Login />
            </RequireNonAuth>
          }
        />
        <Route
          path="/barcode"
          element={
            <RequireAuth>
              <BarCode />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routers>
    </>
  );
}

export default React.memo(Routes);
