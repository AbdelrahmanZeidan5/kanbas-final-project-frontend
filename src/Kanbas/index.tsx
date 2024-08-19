import store from "./store";
import { Provider } from "react-redux";
import { Route, Routes, Navigate } from "react-router";
import Courses from "./Courses";
import Dashboard from "./Dashboard";
import KanbasNavigation from "./Navigation";
import "./styles.css";
import Account from "./Account";
import ProtectedRoute from "./ProtectedRoute";
import EnrollInCourses from "./Courses/EnrollInCourses";

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
              <Route path="Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="Dashboard/Enroll" element={<ProtectedRoute><EnrollInCourses /></ProtectedRoute>} />
              <Route path="Courses/:cid/*" element={<ProtectedRoute><Courses courses={[]} /></ProtectedRoute>} />
              <Route path="Calendar" element={<h1>Calendar</h1>} />
              <Route path="Inbox" element={<h1>Inbox</h1>} />
              <Route path="Node" element={<h1>Node Repo</h1>} />
              <Route path="React" element={<h1>React Repo</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </Provider>
  );
}
