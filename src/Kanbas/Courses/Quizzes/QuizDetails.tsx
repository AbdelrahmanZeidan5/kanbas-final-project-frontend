import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuizById } from "./client"; // Function to fetch quiz details
import { Card, ListGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

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
    // <div>
    //     <button type="button" className='btn btn-outline-secondary me-2 disabled' onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}/preview`)}>Preview</button>
    //     <button type="button" className='btn btn-outline-secondary' onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}/edit`)}>Edit</button>
    //     <hr />
    //     <h2>Quiz Details: {quiz.title}</h2>
    // <p><strong>Description:</strong> {quiz.description}</p>
    // <p><strong>Points:</strong> {quiz.points}</p>
    // <p><strong>Type:</strong> {quiz.type}</p>

    // </div>
    <div>
      <h2>Quizzes for the Course:</h2>
      <Card>
        <ListGroup variant="flush">
          {quizzes.map((quiz) => (
            <ListGroup.Item
              key={quiz._id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <Link to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}>
                  <strong>{quiz.title}</strong>
                  <p>
                    <strong>Description:</strong> {quiz.description}
                  </p>
                  <p>
                    <strong>Points:</strong> {quiz.points}
                  </p>
                  <p>
                    <strong>Type:</strong> {quiz.type}
                  </p>
                </Link>
                <div className="text-muted">
                  {quiz.published ? "Published" : "Unpublished"} |
                  {quiz.dueDate
                    ? ` Due: ${new Date(quiz.dueDate).toLocaleDateString()}`
                    : " No due date"}
                </div>
              </div>
              <div>
                <Button variant="outline-primary" size="sm">
                  Details
                </Button>
                <Button variant="outline-secondary" size="sm">
                  Edit
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
};

export default QuizDetails;
