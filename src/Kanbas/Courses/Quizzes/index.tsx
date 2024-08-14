import React, { useEffect, useState } from 'react';
import { fetchQuizzesForCourse } from './client';
import { Link, useParams } from 'react-router-dom';

const Quizzes = () => {
    const { cid } = useParams();
    const [quizzes, setQuizzes] = useState<any[]>([]);


    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                const quizzesData = await fetchQuizzesForCourse(cid as string);
                console.log("Fetched Quizzes Data:", quizzesData); // Log the fetched data
                setQuizzes(quizzesData);
            } catch (error) {
                console.error("Failed to load quizzes:", error);
            }
        };
        loadQuizzes();
    }, [cid]);
    

    return (
        <div>
            <h2>Quizzes for the Course:</h2>
            <ul>
                {quizzes.map((quiz) => (
                    <li key={quiz._id}>
                        <Link to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`} >
                            {quiz.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Quizzes;


