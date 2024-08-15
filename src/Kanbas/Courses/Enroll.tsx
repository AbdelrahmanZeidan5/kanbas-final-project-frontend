// Kanbas/Courses/Enroll.tsx
import React, { useEffect, useState } from "react";

export default function Enroll() {
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await fetch("/api/courses");
            const data = await response.json();
            setCourses(data);
        };
        fetchCourses();
    }, []);

    const enroll = async (courseId: string) => {
        await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
        alert("Enrolled successfully");
    };

    return (
        <div>
            <h1>Enroll in a Course</h1>
            <ul>
                {courses.map(course => (
                    <li key={course._id}>
                        {course.name} - {course.description}
                        <button onClick={() => enroll(course._id)}>Enroll</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
