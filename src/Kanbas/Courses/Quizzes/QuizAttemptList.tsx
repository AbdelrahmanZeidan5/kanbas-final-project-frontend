import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchQuizById, getQuizAttempts } from "./client";
import { useSelector } from "react-redux";

const QuizAttemptsList = () => {

    const { cid, quizId } = useParams(); 
    const [quiz, setQuiz] = useState<any>(null);
    const [attempts, setAttempts] = useState<any[]>([]);
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    function sortAttempts(a: any, b: any) {
        let a_ = a.date;
        let b_ = b.date;
        return(new Date(a_).getTime() - new Date(b_).getTime());
    };
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
                    fetchedAttempts.filter(isAttemptByCurrentUser).sort(sortAttempts);
                    fetchedAttempts = [fetchedAttempts[fetchedAttempts.length - 1]]; // take last (most recent attempt)
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

    return (<div>
        
        <h2>QUIZ ATTEMPTS LIST</h2>
        <hr/>

        <h5>{String(quiz.title)}</h5>
        <hr/>

        {attempts.map((attempt) => <div id="attempts-list">
            <br/>
            <a className="quiz-attempt-link text-decoration-none text-dark" href={`#/Kanbas/Courses/${cid}/Quizzes/${quizId}/attempts/${attempt._id}`}>
                <strong>{"Attempted by ".concat(attempt.attempteeUsername, " on ", attempt.date.toLocaleString('en-US', { month: 'long', day: 'numeric' }))}</strong>
            </a>
        </div>)}
    </div>);

};
export default QuizAttemptsList;

