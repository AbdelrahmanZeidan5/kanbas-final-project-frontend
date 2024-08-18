import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as client from "../Courses/client";

interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  image: string;
  description: string;
}

// Define the function before using it
const generateRandomCourseNumber = () => {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `RS${randomDigits}`;
};

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course>({
    _id: "",
    name: "New Course",
    number: generateRandomCourseNumber(), // Now the function is defined before use
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const fetchCourses = async () => {
    try {
      console.log("Fetching courses for the current user...");

      const courses = await client.fetchAllCourses(); // Fetch relevant courses
      console.log("Fetched courses:", courses);

      setCourses(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const addNewCourse = async () => {
    const newCourse = {
      ...course,
      number: generateRandomCourseNumber(),
    };
    const createdCourse = await client.createCourse(newCourse);
    setCourses([...courses, createdCourse]);
  };

  const deleteCourse = async (courseId: string) => {
    const result = await client.deleteCourse(courseId);
    if (result.deletedCount === 1) {
      setCourses((courses) => courses.filter((c) => c._id !== courseId));
    }
  };

  const updateCourse = async () => {
    await client.updateCourse(course);
    setCourses(
      courses.map((c) => {
        if (c._id === course._id) {
          return course;
        } else {
          return c;
        }
      })
    );
  };

  useEffect(() => {
    fetchCourses(); // Fetch courses on component mount
  }, []);

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h5>
        New Course
        <button className="btn btn-primary float-end" onClick={addNewCourse}>
          Add
        </button>
        <button className="btn btn-warning float-end me-2" onClick={updateCourse}>
          Update
        </button>
      </h5>
      <br />
      <input
        value={course.name}
        className="form-control mb-2"
        onChange={(e) => setCourse({ ...course, name: e.target.value })}
      />
      <textarea
        value={course.description}
        className="form-control"
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
      />
      <hr />

      <h2>Courses ({courses.length})</h2>
      <hr />
      <div className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {courses.map((course) => (
            <div className="col" key={course._id}>
              <Link to={`/Kanbas/Courses/${course._id}/Home`} className="text-decoration-none">
                <div className="card rounded-3 overflow-hidden">
                  <img src={`/images/reactjs.jpg`} height="160" alt={course.image} />
                  <div className="card-body">
                    <span className="wd-dashboard-course-link" style={{ color: "navy", fontWeight: "bold" }}>
                      {course.name}
                    </span>
                    <p className="card-text" style={{ minHeight: 53, maxHeight: 53, overflow: "hidden" }}>
                      {course.description}
                    </p>
                    <Link to={`/Kanbas/Courses/${course._id}/Home`} className="btn btn-primary">
                      Go
                    </Link>
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        deleteCourse(course._id);
                      }}
                      className="btn btn-danger float-end"
                    >
                      Delete
                    </button>
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        setCourse(course);
                      }}
                      className="btn btn-warning me-2 float-end"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
