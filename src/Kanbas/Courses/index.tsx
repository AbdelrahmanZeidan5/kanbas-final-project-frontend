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
import { useEffect, useState } from "react";
import * as quizClient from "./Quizzes/client";
import QuizTaker from "./Quizzes/QuizTaker";
import QuizAttemptsList from "./Quizzes/QuizAttemptList";
import QuizAttemptViewer from "./Quizzes/QuizAttemptViewer";

export default function Courses({ courses }: { courses: any[]; }) {
  const { cid, qid } = useParams();
  const course = courses.find((course) => course._id === cid);

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const fetchQuizzes = async () => {
    const quizzes = await quizClient.fetchQuizzesForCourse(cid as string);
    setQuizzes(quizzes);
  };
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const { pathname } = useLocation();

  const ind = pathname.split("/").indexOf("edit") - 1;
  const locQuiz = quizzes.find((quiz) => quiz._id === pathname.split("/")[ind]);
  const quizName = locQuiz ? locQuiz.title : "Unnamed Quiz";


  return (
<div id="wd-courses">
<h2 className="text-danger">
<FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name} &gt; {pathname.split("/")[4]} {pathname.includes("edit") && `> ${quizName}`}
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
<Route path="/Quizzes/:quizId/preview" element={<QuizTaker />} />
<Route path="/Quizzes/:quizId/attempts" element={<QuizAttemptsList />}/>
<Route path="/Quizzes/:quizId/attempts/:qaid" element={<QuizAttemptViewer />}/>
<Route path="/Grades" element={<Grades />} />
<Route path="People" element={<PeopleTable />} />
<Route path="People/:uid" element={<PeopleTable />} />

          </Routes>
</div>
</div>
</div>
);}