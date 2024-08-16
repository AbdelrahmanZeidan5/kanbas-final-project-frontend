import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import "./index.css";
import { fetchAllCourses } from "../client";
import { useEffect, useState } from "react";


export default function CoursesNavigation() {
  const { cid } = useParams<{ cid: string }>();
  const { pathname } = useLocation();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await fetchAllCourses();
        setCourses(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch courses', error);
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const course = courses.find((course) => course._id === cid);
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

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
