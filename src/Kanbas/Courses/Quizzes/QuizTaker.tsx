import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchQuizById, fetchQuestionsByQuizId, createQuizAttempt } from './client';
import * as client from "./client";

const QuizTaker = () => {
    const { cid, quizId } = useParams(); 
    const [questions, setQuestions] = useState<any[]>([]);
    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<any>({});


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
    }, [quizId]);


    const submitQuiz = async () => {
        const quizAttempt = {quizId: quizId, attempteeUsername: "iron_man", answers: answers, date: Date.now()}; //TODO CHANGE THIS TO BE CORRECT LOGIC
        await client.createQuizAttempt(quizId as string, quizAttempt);
        alert("Submitted quiz");
    };

    function questionDisplay (question: any){
        return (<div id={question._id}>
        <div id="question-title">{question.title}</div>
        <div id="question-text">{question.questionText}</div>
        {switchDisplay(question)}
        </div>);
    }
    
    function switchDisplay(question: any) {
        switch (question.type) {
            case "MULTIPLE_CHOICE": //maybe combine first two cases, both record id of selected answer
                return (
                    question.choices.map((choice: any) => <div>
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
                    question.choices.map((choice: any) => <div>
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
                return (<div>
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


    return(<div className="quiz-taker p-4">
        
        QUIZ TAKER

        <div id="questions">
            {questions.map((question) => <div>                
                
                {questionDisplay(question)} <br/>
                
                </div>)}

        </div>

        <div >
        <button className="btn btn-danger" onClick={submitQuiz}>Submit</button>

        </div>    
    
    </div>);

};


export default QuizTaker;