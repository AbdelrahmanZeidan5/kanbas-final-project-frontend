import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchQuizById, getQuizAttemptByID, fetchQuestionsByQuizId } from "./client";

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
        return (<div id={question._id}>
        <br/>
        <div id="question-title">{question.title}</div>
        <div id="question-text">{question.questionText}</div>
        {switchDisplay(question)}
        {String(gradeQuestion(question, attemptAnswer)).concat(`/${question.points} points`)}
        
        </div>);
    }

    function switchDisplay(question: any) {
        switch (question.type) {
            case "MULTIPLE_CHOICE": //maybe combine first two cases, both record id of selected answer
                return (
                    question.choices.map((choice: any) => <div>

                    </div>) 
                  );
            case "TRUE_FALSE":
                return (
                    question.choices.map((choice: any) => <div>

                    </div>) 
                  );
            case "FILL_IN_BLANK": //store response in string form
                return (<div>

                </div>);
            default:
              return <div>BROKEN QUESTION TYPE</div>
          }
    }

    if (!quiz) return <div>Loading...</div>;
    if (!attempt) return <div>Loading...</div>;

    return (<div>
        QUIZ ATTEMPT VIEWER <br/>
        {"Attempted by ".concat(attempt.attempteeUsername, " on ", attempt.date.toLocaleString('en-US', { month: 'long', day: 'numeric' }))}
        
        {questions.map((question: any) => <div>

            {questionDisplay(question, quiz.showCorrectAnswers)}

        </div>)}
    
    </div>);

};
export default QuizAttemptViewer;

