import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GiPencil } from "react-icons/gi";
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

            <div id="wd-quiz-details-header" className="d-flex justify-content-center">
                <Link to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/preview`} className="btn btn-lg btn-secondary mb-3 me-2">Preview</Link>
                <Link to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/edit`} className="btn btn-lg btn-secondary mb-3 me-2"><GiPencil className="me-2" />Edit</Link>
            </div>
            <hr />
            <h2>Quiz Details: {quiz.title}</h2>

            <div className="m-5">
                <div className="row m-1">
                    <div className="d-flex col-3 justify-content-end fw-bold">Quiz Type</div>
                    <div className="d-flex col-7">{quiz.type}</div>
                </div>
                <div className="row m-1">
                    <div className="d-flex col-3 justify-content-end fw-bold">Points</div>
                    <div className="d-flex col-7">{quiz.points}</div>
                </div>
                <div className="row m-1">
                    <div className="d-flex col-3 justify-content-end fw-bold">Assignment Group</div>
                    <div className="d-flex col-7">{quiz.assignmentGroup}</div>
                </div>
                <div className="row m-1">
                    <div className="d-flex col-3 justify-content-end fw-bold">Shuffle Answers</div>
                    <div className="d-flex col-7">{quiz.shuffleAnswers ? "Yes" : "No"}</div>
                </div>
                <div className="row m-1">
                    <div className="d-flex col-3 justify-content-end fw-bold">Time Limit</div>
                    <div className="d-flex col-7">{quiz.timeLimit} Minutes</div>
                </div>
                <div className="row m-1">
                    <div className="d-flex col-3 justify-content-end fw-bold">Multiple Attempts</div>
                    <div className="d-flex col-7">{quiz.multipleAttempts ? "Yes" : "No"}</div>
                </div>
                <div className="row m-1">
                    <div className="d-flex col-3 justify-content-end fw-bold">How Many Attempts</div>
                    <div className="d-flex col-7">{quiz.maxAttempts}</div>
                </div>
                <div className="row m-1">
                    <div className="d-flex col-3 justify-content-end fw-bold">Show Correct Answers</div>
                    <div className="d-flex col-7">{quiz.showCorrectAnswers ? "Yes" : "No"} </div>
                </div>
                <div className="row m-1">
                    <div className="d-flex col-3 justify-content-end fw-bold">Access Code</div>
                    <div className="d-flex col-7">{quiz.accessCode}</div>
                </div>
                <div className="row m-1">
                    <div className="d-flex col-3 justify-content-end fw-bold">One Question at a Time</div>
                    <div className="d-flex col-7">{quiz.oneQuestionAtATime ? "Yes" : "No"}</div>
                </div>
                <div className="row m-1">
                    <div className="d-flex col-3 justify-content-end fw-bold">Webcam Required</div>
                    <div className="d-flex col-7">{quiz.webcamRequired ? "Yes" : "No"}</div>
                </div>
                <div className="row m-1">
                    <div className="d-flex col-3 justify-content-end fw-bold">Lock Questions After Answering</div>
                    <div className="d-flex col-7">{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</div>
                </div>
            </div>


            <div className="">
                <div className="row m-2">
                    <div className="col fw-bold">Due</div>
                    <div className="col fw-bold">For</div>
                    <div className="col fw-bold">Available from</div>
                    <div className="col fw-bold">Until</div>
                </div>
                <hr />
                <div className="row m-2">
                    <div className="col">{quiz.dueDate}</div>
                    <div className="col">Everyone</div>
                    <div className="col">{quiz.availableFrom}</div>
                    <div className="col">{quiz.availableUntil}</div>
                </div>
            </div>
            <hr />

        </div>
    );
};

export default QuizDetails;
