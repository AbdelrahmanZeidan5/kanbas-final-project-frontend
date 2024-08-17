import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuizById, getQuizAttempts } from './client';  // Function to fetch quiz details
import { useSelector } from 'react-redux';

const QuizDetails = () => {
    const { quizId, cid } = useParams<{ quizId: string; cid: string }>();
    const [quiz, setQuiz] = useState<any>(null);
    const [attempts, setAttempts] = useState<any[]>([]);
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    function isAttemptByCurrentUser(attempt: any) {
        return(attempt.attempteeUsername === currentUser.username);
    };


    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const fetchedQuiz = await fetchQuizById(quizId as string);
                setQuiz(fetchedQuiz);
            } catch (error) {
                console.error("Failed to load quiz:", error);
            }
        };
        const loadAttempts = async () => {
            try {
                let fetchedAttempts = await getQuizAttempts(quizId as string);

                if (currentUser.role === "STUDENT") {
                    fetchedAttempts = fetchedAttempts.filter(isAttemptByCurrentUser);
                }
                setAttempts(fetchedAttempts);
            } catch (error) {
                console.error("Failed to load attempts:", error);
            }
        };
        loadQuiz();
        loadAttempts();
    }, [quizId]);

    if (!quiz) return <div>Loading...</div>;

    let canTake = true;
    if (currentUser.role === "STUDENT" && ((!quiz.multipleAttempts && attempts.length >= 1)|| attempts.length >= quiz.maxAttempts)) { //not allowed to take it again
        canTake = false;
    }

    return (
        <div>
            
            <button type="button" className={`btn btn-outline-secondary me-2 ${canTake? "":"disabled"}`} onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}/preview`)}>{currentUser.role === "STUDENT" ? `${canTake? "Take":"Cannot Take - Attempt Limit Reached"}` : "Preview"}</button>
            {currentUser.role !== "STUDENT" && <button type="button" className='btn btn-outline-secondary me-2' onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}/edit`)}>Edit</button>}
            <button type="button" className='btn btn-outline-secondary me-2' onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}/attempts`)}>View Attempts</button>
            <hr />
            <h2>Quiz Details: {quiz.title}</h2>
            <p><strong>Description:</strong> {quiz.description}</p>
            <p><strong>Points:</strong> {quiz.points}</p>
            <p><strong>Type:</strong> {quiz.type}</p>

        </div>
    );
};

export default QuizDetails;
