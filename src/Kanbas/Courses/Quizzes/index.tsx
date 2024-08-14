import { useParams } from "react-router";
import QuizDetailsScreen from "./QuizDetails";

export default function Quizzes() {
    const { cid } = useParams();
    return (
        <div>
            <h2> Quizzes</h2>
            <QuizDetailsScreen />
        </div>
    );
}