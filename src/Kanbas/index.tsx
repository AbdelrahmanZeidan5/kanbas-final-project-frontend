import store from "./store";
import { Provider } from "react-redux";
import { Navigate, Route, Routes } from "react-router";
import Courses from "./Courses";
import Dashboard from "./Dashboard";
import KanbasNavigation from "./Navigation";
import "./styles.css";
import Account from "./Account";
import ProtectedRoute from "./ProtectedRoute";

export default function Kanbas() {
  return (
    <Provider store={store}>
      <div id="wd-kanbas" className="h-100">
        <div className="d-flex h-100">
          <div className="d-none d-md-block bg-black">
            <KanbasNavigation />
          </div>
          <div className="flex-fill p-4">
            <Routes>
              <Route path="/" element={<Navigate to="Dashboard" />} />
              <Route path="/Account/*" element={<Account />} />
              <Route
                path="Dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="Courses/:cid/*"
                element={
                  <ProtectedRoute>
                    <Courses courses={[]} /> {/* Pass an empty array for now */}
                  </ProtectedRoute>
                }
              />
              <Route path="Calendar" element={<h1>Calendar</h1>} />
              <Route path="Inbox" element={<h1>Inbox</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </Provider>
  );
}
