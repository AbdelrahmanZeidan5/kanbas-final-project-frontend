import React, { useEffect, useState } from "react";
import * as client from "../Courses/client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  image: string;
  description: string;
}

export default function EnrollInCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    console.log("entered enroll");
    try {
      const courses = await client.loadAllCourses();
      setCourses(courses);
      console.log("Entering fetch all courses", courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    try {
      await client.enrollInCourse(courseId);
      alert("Successfully enrolled in the course!");
      navigate("/Kanbas/Dashboard"); // Redirect to the Dashboard after enrolling
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  return (
    <div id="wd-enroll-courses">
      <h1>Enroll in Courses</h1>
      <div className="row">
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {courses.map((course) => (
            <div className="col" key={course._id}>
              <div className="card rounded-3 overflow-hidden">
                <img src={`/images/reactjs.jpg`} height="160" alt={course.image} />
                <div className="card-body">
                  <h5 className="card-title">{course.name}</h5>
                  <p className="card-text" style={{ minHeight: 53, maxHeight: 53, overflow: "hidden" }}>
                    {course.description}
                  </p>
                  <button className="btn btn-primary" onClick={() => enrollInCourse(course._id)}>
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
