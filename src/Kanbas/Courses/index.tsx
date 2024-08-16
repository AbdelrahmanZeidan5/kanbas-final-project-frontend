import { Navigate, Route, Routes, useLocation, useParams } from "react-router";
import Modules from "./Modules";
import CoursesNavigation from "./Navigation";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { FaAlignJustify } from "react-icons/fa6";
import Grades from "./Grades";
import PeopleTable from "./People/Table";
import Quizzes from "./Quizzes";
import QuizDetails from "./Quizzes/QuizDetails";
import QuizEditor from "./Quizzes/QuizEditor";

export default function Courses({ courses }: { courses: any[]; }) {
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name} &gt; {pathname.split("/")[4]}
      </h2>
      
      <hr />
      
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CoursesNavigation />
        </div>
        <div className="flex-fill p-3">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Modules" element={<Modules/>} />
            <Route path="/Piazza" element={<h2>Piazza</h2>} />
            <Route path="/Zoom" element={<h2>Zoom</h2>} />
            <Route path="/Assignments" element={<Assignments />} />
            <Route path="/Assignments/:id" element={<AssignmentEditor />} />
            <Route path="/Quizzes" element={<Quizzes />} />
            <Route path="/Quizzes/:quizId" element={<QuizDetails />} />
            <Route path="/Quizzes/:quizId/edit" element={<QuizEditor />} />
            <Route path="/Grades" element={<Grades />} />
            <Route path="People" element={<PeopleTable />} />
            <Route path="People/:uid" element={<PeopleTable />} />

          </Routes>
        </div>
      </div>
    
    </div>
);}
