import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchQuizById, getQuizAttempts } from "./client";

const QuizAttemptsList = () => {

    const { cid, quizId } = useParams(); 
    const [quiz, setQuiz] = useState<any>(null);
    const [attempts, setAttempts] = useState<any[]>([]);

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
                const fetchedAttempts = await getQuizAttempts(quizId as string);
                setAttempts(fetchedAttempts);
            } catch (error) {
                console.error("Failed to load questions:", error);
            }
        };

        loadQuiz();
        loadAttempts();
    }, [quizId]);

    return (<div>
        QUIZ ATTEMPTS LIST
        {attempts.map((attempt) => <div id="attempts-list">
            <br/>
            <a className="quiz-attempt-link text-decoration-none text-dark" href={`#/Kanbas/Courses/${cid}/Quizzes/${quizId}/attempts/${attempt._id}`}>
                <strong>{"Attempted by ".concat(attempt.attempteeUsername, " on ", attempt.date.toLocaleString('en-US', { month: 'long', day: 'numeric' }))}</strong>
            </a>
        </div>)}
    </div>);

};
export default QuizAttemptsList;

