import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchQuizById, getQuizAttemptByID, fetchQuestionsByQuizId } from "./client";
import "./index.css";
import { BiLeftArrow } from "react-icons/bi";

const QuizAttemptViewer = () => {

    const { cid, quizId, qaid } = useParams(); 
    const [quiz, setQuiz] = useState<any>(null);
    const [attempt, setAttempt] = useState<any>();
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const fetchedQuiz = await fetchQuizById(quizId as string);
                setQuiz(fetchedQuiz);
            } catch (error) {
                console.error("Failed to load quiz:", error);
            }
        };
        const loadAttempt = async () => {
            try {
                const fetchedAttempt = await getQuizAttemptByID(quizId as string, qaid as string);
                setAttempt(fetchedAttempt);
            } catch (error) {
                console.error("Failed to load quiz attempt:", error);
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
        loadAttempt();
    }, [quizId]);

    function gradeQuiz() {
        let totalPoints = 0;
        let earnedPoints = 0;
        for (const question of questions) {
            totalPoints += question.points;
            earnedPoints += gradeQuestion(question, attempt.answers[question._id]);
        }
        return String(earnedPoints).concat("/", String(totalPoints), " points");
    }

    function gradeQuestion(question: any, answer: any){
        let correct = false;
        switch (question.type) {
            case "MULTIPLE_CHOICE":
                for (const choice of question.choices) {
                    if (choice.isCorrect && answer === choice._id) {
                        correct = true;
                    }
                }
                break;

            case "TRUE_FALSE":
                for (const choice of question.choices) {
                    if (choice.isCorrect && answer === choice._id) {
                        correct = true;
                    }
                }
                break;

            case "FILL_IN_BLANK":
                for (const choice of question.choices) {
                    if (answer === choice.text) {
                        correct = true;
                    }
                }
                break;
            default:
              return 0;
          }
          return correct ? question.points : 0;
    }

    function questionDisplay (question: any, showCorrectAnswers: Boolean){
        const attemptAnswer = attempt.answers[question._id];
        const pointsAwarded = gradeQuestion(question, attemptAnswer);
        return (<div className="border-thin border-solid margin-all-around" id={question._id}>
        <div id="question-title" className="underline-content">
            <span className={`pad-left-small ${pointsAwarded > 0 ? "correct-answer-color" : "incorrect-answer-color"}`}>{question.title}</span>
            <span className={`${pointsAwarded > 0 ? "correct-answer-color" : "incorrect-answer-color"} float-end pad-right-small`}>
            {String(pointsAwarded).concat(`/${question.points} points`)}
            </span>
            
        </div>
        <div id="question-text">
            <span className="pad-left-small">{question.questionText} </span>
        </div>
        {switchDisplay(question, attemptAnswer, showCorrectAnswers)}
        
        
        </div>);
    }

    function switchDisplay(question: any, answer: any, showCorrectAnswers: Boolean) {

        function showYourAnswer(choice: any, answer: any) {
            if (choice._id === answer) {
                return (<span> <BiLeftArrow/> SELECTED </span>);
            }
            return;
        }

        switch (question.type) {
            case "MULTIPLE_CHOICE":
                return (
                    question.choices.map((choice: any) => <div className="pad-left-small">
                        {choice.text}{showYourAnswer(choice, answer)} {showCorrectAnswers && choice.isCorrect && <span className="correct-answer-color"> <BiLeftArrow/> CORRECT</span>}
                        
                    </div>) 
                  );
            case "TRUE_FALSE":
                return (
                    question.choices.map((choice: any) => <div className="pad-left-small">
                        {choice.text}{showYourAnswer(choice, answer)} {showCorrectAnswers && choice.isCorrect && <span className="correct-answer-color"> <BiLeftArrow/> CORRECT</span>}
                    </div>) 
                  );
            case "FILL_IN_BLANK":
                return (<div>
                    {!showCorrectAnswers && <span className="pad-left-small">SUBMITTED: {answer}</span>}
                    {showCorrectAnswers && <table>
                        <tr><td className="qa-table qa-table-border-right qa-table-border-bottom">SUBMITTED ANSWER</td><td className="qa-table qa-table-border-bottom">ACCEPTED ANSWERS</td></tr>
                        <tr><td className="qa-table qa-table-border-right">{String(answer)}</td><td className="qa-table">{question.choices.map((choice: any) => <span>| &nbsp; {choice.text} &nbsp; </span>)}|</td></tr>
                    </table>}
                </div>);
            default:
              return <div>BROKEN QUESTION TYPE</div>
          }
    }

    if (!quiz) return <div>Loading...</div>;
    if (!attempt) return <div>Loading...</div>;

    return (<div>
        <h2>QUIZ ATTEMPT VIEWER </h2>
        <hr/>
        <h5>{quiz.title}</h5>
        <hr/>
        <span>{"Attempted by ".concat(attempt.attempteeUsername, " on ", attempt.date.toLocaleString('en-US', { month: 'long', day: 'numeric' }))}</span>
        <span className="float-end pad-right-small">{gradeQuiz()}</span>
        
        {questions.map((question: any) => <div>

            {questionDisplay(question, quiz.showCorrectAnswers)}

        </div>)}
    
    </div>);

};
export default QuizAttemptViewer;

