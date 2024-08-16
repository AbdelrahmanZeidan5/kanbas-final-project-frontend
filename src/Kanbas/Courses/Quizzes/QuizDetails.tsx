import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuizById } from './client';  // Function to fetch quiz details

const QuizDetails = () => {
    const { quizId, cid } = useParams<{ quizId: string; cid: string }>();
    const [quiz, setQuiz] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const fetchedQuiz = await fetchQuizById(quizId as string);
                setQuiz(fetchedQuiz);
            } catch (error) {
                console.error("Failed to load quiz:", error);
            }
        };
        loadQuiz();
    }, [quizId]);

    if (!quiz) return <div>Loading...</div>;


    return (
        <div>
            <button type="button" className='btn btn-outline-secondary me-2 disabled' onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}/preview`)}>Preview</button>
            <button type="button" className='btn btn-outline-secondary' onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}/edit`)}>Edit</button>
            <hr />
            <h2>Quiz Details: {quiz.title}</h2>
            {
                quiz.map((key: any, value: any) => {
                    <div className="row">
                        <div className="d-flex col justify-content-end fw-bold">{key}</div>
                        <div className="d-flex col">{value}</div>
                    </div>
            })
            }
            <p><strong>Description:</strong> {quiz.description}</p>
            <p><strong>Points:</strong> {quiz.points}</p>
            <p><strong>Type:</strong> {quiz.type}</p>

        </div>
    );
};

export default QuizDetails;
