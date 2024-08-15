import React from "react";
import { Link } from "react-router-dom";

interface Course {
    _id: string;
    name: string;
    number: string;
    startDate: string;
    endDate: string;
    image: string;
    description: string;
}

interface DashboardProps {
    courses: Course[];
    course: Course;
    setCourse: React.Dispatch<React.SetStateAction<Course>>;
    addNewCourse: () => void;
    deleteCourse: (courseId: string) => void;
    updateCourse: () => void;
}

export default function Dashboard({
    courses,
    course,
    setCourse,
    addNewCourse,
    deleteCourse,
    updateCourse
}: DashboardProps) {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1>
            <hr />
            <h5>
                New Course
                <button className="btn btn-primary float-end" onClick={addNewCourse}>Add</button>
                <button className="btn btn-warning float-end me-2" onClick={updateCourse}>Update</button>
            </h5>
            <br />
            <input value={course.name} className="form-control mb-2" onChange={(e) => setCourse({ ...course, name: e.target.value })} />
            <textarea value={course.description} className="form-control" onChange={(e) => setCourse({ ...course, description: e.target.value })} />
            <hr />

            <h2>Courses ({courses.length})</h2>
            <hr />
            <div className="row">
                <div className="row row-cols-1 row-cols-md-5 g-4">
                    {courses.map((course) => (
                        <div className="col" key={course._id}>
                            <Link to={`/Kanbas/Courses/${course._id}/Home`} className="text-decoration-none">
                                <div className="card rounded-3 overflow-hidden">
                                    <img src={`/images/${course.image}`} height="160" alt={course.image} />
                                    <div className="card-body">
                                        <span className="wd-dashboard-course-link" style={{ color: "navy", fontWeight: "bold" }}>
                                            {course.name}
                                        </span>
                                        <p className="card-text" style={{ minHeight: 53, maxHeight: 53, overflow: "hidden" }}>
                                            {course.description}
                                        </p>
                                        <Link to={`/Kanbas/Courses/${course._id}/Home`} className="btn btn-primary">Go</Link>
                                        <button onClick={(event) => { event.preventDefault(); deleteCourse(course._id); }} className="btn btn-danger float-end">
                                            Delete
                                        </button>
                                        <button onClick={(event) => { event.preventDefault(); setCourse(course); }} className="btn btn-warning me-2 float-end">
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
