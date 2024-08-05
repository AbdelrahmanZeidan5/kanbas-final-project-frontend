import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import "./index.css";
import { courses } from "../../Database";



export default function CoursesNavigation() {
  const { cid } = useParams();
  const { pathname } = useLocation();
  const course = courses.find((course) => course._id === cid);
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades"];

  const getLinkPath = (link: string) => `/Kanbas/Courses/${course?._id}/${link}`;
  
  return (
    <div id="wd-courses-navigation" className="list-group fs-5 rounded-0">
      {links.map((link) => {
        const linkPath = getLinkPath(link);
        const isActive = pathname.startsWith(linkPath);
        return (
          <Link 
            to={linkPath} 
            className={`list-group-item ${isActive ? 'active' : 'text-danger'} border border-0`}
            key={link}
          >
            {link}
          </Link>
        );
      })}
    </div>
  );
}