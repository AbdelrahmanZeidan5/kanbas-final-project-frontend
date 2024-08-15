import store from "./store";
import { Provider } from "react-redux";
import { Navigate, Route, Routes } from "react-router";
import Courses from "./Courses";
import Dashboard from "./Dashboard";
import KanbasNavigation from "./Navigation";
import "./styles.css";
import { useEffect, useState } from "react";
import * as client from "./Courses/client";
import Account from "./Account";
import ProtectedRoute from "./ProtectedRoute";
import Enroll from "./Courses/Enroll";

interface Course {
    _id: string;
    name: string;
    number: string;
    startDate: string;
    endDate: string;
    image: string;
    description: string;
}

// Corrected generateRandomCourseNumber function
const generateRandomCourseNumber = () => {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    return `RS${randomDigits}`;  // Use backticks for template literals
};

export default function Kanbas() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [course, setCourse] = useState<Course>({
        _id: '',
        name: "New Course",
        number: generateRandomCourseNumber(),  // Now generateRandomCourseNumber is defined above this line
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        image: "reactjs.jpg",
        description: "New Description",
    });
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = async () => {
        try {
            const courses = await client.fetchAllCourses();
            setCourses(courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to fetch courses.');
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const addNewCourse = async () => {
        const newCourse = { ...course, number: generateRandomCourseNumber() };
        const createdCourse = await client.createCourse(newCourse);
        setCourses([...courses, createdCourse]);
    };

    const deleteCourse = async (courseId: string) => {
        const result = await client.deleteCourse(courseId);
        if (result.deletedCount === 1) {
            setCourses(courses.filter(c => c._id !== courseId));
        }
    };

    const updateCourse = async () => {
        await client.updateCourse(course);
        setCourses(
            courses.map(c => c._id === course._id ? course : c)
        );
    };

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
                            <Route path="Dashboard" element={
                                <ProtectedRoute>
                                    <Dashboard
                                        courses={courses}
                                        course={course}
                                        setCourse={setCourse}
                                        addNewCourse={addNewCourse}
                                        deleteCourse={deleteCourse}
                                        updateCourse={updateCourse}
                                    />
                                </ProtectedRoute>
                            } />
                            <Route path="Courses/Enroll" element={<ProtectedRoute><Enroll /></ProtectedRoute>} />
                            <Route path="Courses/:cid/*" element={<ProtectedRoute><Courses courses={courses} /></ProtectedRoute>} />
                            <Route path="Calendar" element={<h1>Calendar</h1>} />
                            <Route path="Inbox" element={<h1>Inbox</h1>} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Provider>
    );
}
