import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchQuizById, fetchQuestionsByQuizId, createQuizAttempt } from './client';
import * as client from "./client";
import { useNavigate } from "react-router-dom";

const QuizTaker = () => { //todo change to create QA on load, and then update when things change, some kind of default for answers?
    const { cid, quizId } = useParams(); 
    const [questions, setQuestions] = useState<any[]>([]);
    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<any>({});
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const navigate = useNavigate();
    const [quizExpireTime, setQuizExpireTime] = useState<any>(null);


    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const fetchedQuiz = await fetchQuizById(quizId as string);
                setQuiz(fetchedQuiz);
            } catch (error) {
                console.error("Failed to load quiz:", error);
            }
        };
        const loadQuestions = async () => {
            try {
                const fetchedQuestions = await fetchQuestionsByQuizId(quizId as string);
                setQuestions(fetchedQuestions);
            } catch (error) {
                console.error("Failed to load questions:", error);
            }
        };

        loadQuiz();
        loadQuestions();

        if (quizExpireTime == null && quiz) {
            const timeLimitInMinutes = quiz.timeLimit;
            const millisecondsPerMinute = 60000;
            setQuizExpireTime(new Date(new Date().getTime() + (timeLimitInMinutes * millisecondsPerMinute)));
        }

    }, [quizId]);

    const submitQuiz = async () => {
        const quizAttempt = {quizId: quizId, attempteeUsername: currentUser.username, answers: answers, date: Date.now()};
        await client.createQuizAttempt(quizId as string, quizAttempt);
        navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}`);
        alert("Submitted quiz");
    };

    function questionDisplay (question: any){
        return (<div id={question._id} className="border-thin border-solid margin-all-around">
        <div id="question-title" className="underline-content pad-left-small">
            <span>{question.title}</span> <span className={`float-end pad-right-small`}>
            {(`${question.points} points`)}
            </span></div>
        <div id="question-text" className="pad-left-small">{question.questionText}</div>
        {switchDisplay(question)}
        </div>);
    }
    
    function switchDisplay(question: any) {
        switch (question.type) {
            case "MULTIPLE_CHOICE": //maybe combine first two cases, both record id of selected answer
                return (
                    question.choices.map((choice: any) => <div className="pad-left-small">
                        <input id={choice._id}
                            type="radio"
                            name={"mc_choice".concat(question._id)}
                            value={choice.text}
                            onChange = {() => setAnswers({...answers, [question._id]: choice._id})}
                        />
                        <label htmlFor={choice._id}>{choice.text}</label>
                        <br/>
                    </div>) 
                  );
            case "TRUE_FALSE":
                return (
                    question.choices.map((choice: any) => <div className="pad-left-small">
                        <input id={choice._id}
                            type="radio"
                            name={"tf_choice".concat(question._id)}
                            value={choice.text}
                            onChange = {() => setAnswers({...answers, [question._id]: choice._id})}
                        />
                        <label htmlFor={choice._id}>{choice.text}</label>
                        <br/>
                    </div>) 
                  );
            case "FILL_IN_BLANK": //store response in string form
                return (<div className="pad-left-small pad-right-small">
                    <input
                        type="text"
                        className="form-control"
                        value={answers[question._id]}
                        placeholder={"Answer Here"}
                        onChange={(e) => setAnswers({...answers, [question._id]: e.target.value})}
                    />
                </div>);
            default:
              return <div>BROKEN QUESTION TYPE</div>
          }
    }

    if (!quiz) return <div>Loading...</div>;
    /*if (quiz.shuffleAnswers) { //todo broken, move this to happen before this page loads
        questions.map((question) => {
            //found a neat js array shuffle algorithm here
            //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

            question.choices = question.choices.map((choice: any) => ({value: choice, sort: Math.random() }))
            .sort((a: any, b: any) => a.sort - b.sort)
            .map((object: any) => object.value)

        });
    }*/

    return(<div className="quiz-taker p-4">
        
        <h2>QUIZ TAKER</h2>
        <hr/>
        <h5>{quiz.title}</h5>
        <hr/>

        <div id="questions">
            
            {questions.map((question) => <div>                
                
                {questionDisplay(question)} <br/>
                
                </div>)}

        </div>

        <div >
        <button className="btn btn-danger me-2" onClick={submitQuiz}>Submit</button>
        {currentUser.role !== "STUDENT" && <button className="btn btn-danger me-2" onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}/edit`)}>Edit Quiz</button>}

        </div>    
    
    </div>);

};


export default QuizTaker;