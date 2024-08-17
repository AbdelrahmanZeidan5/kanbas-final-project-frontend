import React, { useEffect, useState } from "react";
import { Row, Col, Container, ListGroup, Card } from "reactstrap";
import { Button } from "reactstrap";

import { fetchQuizzesForCourse } from "./client";
import { Link, useParams } from "react-router-dom";
import { QuizzesControlButtons } from "./QuizzesControlButtons";
import { QuizDetails } from "./QuizDetails";

const Quizzes = () => {
  const { cid } = useParams();
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const quizzesData = await fetchQuizzesForCourse(cid as string);
        console.log("Fetched Quizzes Data:", quizzesData); // Log the fetched data
        setQuizzes(quizzesData);
      } catch (error) {
        console.error("Failed to load quizzes:", error);
      }
    };
    loadQuizzes();
  }, [cid]);

  <QuizDetails />;

  return (
    <Container>
      <Row className="align-items-center mb-3">
        <Col>
          <h2>Quizzes for the Course:</h2>
        </Col>
        <Col xs="auto">
          <QuizzesControlButtons />
        </Col>
      </Row>
      <Card>
        <ListGroup variant="flush">
          {quizzes.map(
            (quiz: {
              _id: any;
              title: any;
              published: any;
              dueDate: string | number | Date;
            }) => (
              <ListGroup.Item
                key={quiz._id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <Link to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}>
                    <strong>{quiz.title}</strong>
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
                </div>
                <QuizDetails />
              </ListGroup.Item>
            )
          )}
        </ListGroup>
      </Card>
    </Container>
  );
};
export default Quizzes;
