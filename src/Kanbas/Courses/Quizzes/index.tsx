import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { fetchQuestionsByQuizId, fetchQuizzesForCourse } from "./client";
import { Link, useParams } from "react-router-dom";
import {
  QuizControlButtons,
  QuizzesControlButtons,
} from "./QuizzesControlButtons";
// import { QuizDetails } from "./QuizDetails";
import * as client from "./client";
import { useDispatch, useSelector } from "react-redux";
import QuizDetails from "./QuizDetails";
import { setQuizzes, deleteQuiz } from "./reducer";
import QuizControls from "./QuizControls";
import { IoRocketOutline } from "react-icons/io5";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import DeleteQuizModal from "./DeleteQuizModal";

const Quizzes = () => {
  const dispatch = useDispatch();

  const { cid } = useParams();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const { assignments } = useSelector((state: any) => state.quizzesReducer);

  const [selectedQuiz, setSelectedQuiz] = useState<{
    id: string;
    title: string;
  } | null>(null);

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

  const QuizzesComponent = ({ courseId }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [questionCounts, setQuestionCounts] = useState({});

  useEffect(() => {
    // Fetch quizzes for the specific course
    const loadQuizzes = async () => {
      try {
        const quizzesData = await fetchQuizzesForCourse(courseId);
        setQuizzes(quizzesData);

        // Fetch questions for each quiz to count them
        const counts = [];
        for (const quiz of quizzesData) {
          const questions = await fetchQuestionsByQuizId(quiz._id); 
          counts[quiz._id] = questions.length;
        }
        setQuestionCounts(counts);
      } catch (error) {
        console.error("Error loading quizzes or questions", error);
      }
    };

    loadQuizzes();
  }, [courseId]);

  const handleDeleteClick = (quizId: string, quizTitle: string) => {
    setSelectedQuiz({ id: quizId, title: quizTitle });
  };

  const confirmDelete = async () => {
    if (setSelectedQuiz) {
      await client.removeQuiz(selectedQuiz.id);
      dispatch(deleteQuiz(selectedQuiz.id));
      setSelectedQuiz(null);
    }
  };

  const getAvailabilityStatus = (availableDate: string, availableUntilDate: string): string => {
    const now = new Date();
    const available = new Date(availableDate);
    const until = new Date(availableUntilDate);

    if (now < available) {
      return `Not available until ${available.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}`;
    } else if (now > until) {
      return "Closed";
    } else {
      return "Available";
    }
  };

  return (
    <div id="wd-quizzes">
      <QuizControls />
      <br />
      <br />
      <br />
      <br />

      <ul id="wd-quiz-list" className="list-group rounded-0">
        <li className="wd-quiz-list-item list-group-item p-0 mb-5 fs-5 border-gra">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
            <div className="d-flex align-items-center">
              <span className="dropdown-toggle me-1"></span>
              Assignment Quizzes
            </div>
          </div>

          <ul className="wd-quiz-items list-group rounded-0">
            {quizzes.map((quiz: any) => (
              <li
                key={quiz._id}
                className="wd-quiz-item list-group-item d-flex align-items-center p-3 ps-1"
              >
                <div className="d-flex align-items-center">
                  <IoRocketOutline />
                </div>

                <div className="flex-grow-1">
                  <a
                    className="wd-quiz-link text-decoration-none text-dark"
                    href={`#/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
                  >
                    <strong>{quiz.title}</strong>
                  </a>
                  <div className="quiz-details">
                    
                    <div>
                  {getAvailabilityStatus(quiz.availableDate, quiz.availableUntilDate)}
                </div>
                    | <span>
                      <strong>Due</strong>{" "}
                      {new Date(quiz.dueDate).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at 11:59pm
                    </span>{" "}
                    |<span>{quiz.points} pts</span>
                    <span> | {questionCounts[quiz._id]} Questions</span>
                  </div>
                </div>
                <QuizControlButtons
                  quizId={quiz._id}
                  quizTitle={quiz.title}
                  onDeleteClick={handleDeleteClick}
                  isPublished={quiz.published}
                />
              </li>
            ))}
          </ul>
        </li>
      </ul>

      <DeleteQuizModal
        dialogTitle="Confirm Deletion"
        quizTitle={selectedQuiz?.title || ""}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

//     <Container>
//       <Row className="align-items-center mb-3">
//         <Col>
//           <h2>Quizzes for the Course:</h2>
//         </Col>
//         <Col xs="auto">
//           <QuizzesControlButtons />
//         </Col>
//       </Row>
//       <Card>
//         <ListGroup variant="flush">
//           {quizzes.map(
//             (quiz: {
//               _id: any;
//               title: any;
//               published: any;
//               dueDate: string | number | Date;
//               points: number;
//             }) => (
//               <ListGroup.Item
//                 key={quiz._id}
//                 className="d-flex justify-content-between align-items-center"
//               >
//                 <div>
//                   <Link to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}>
//                     <strong>{quiz.title}</strong>
//                   </Link>
//                   <div className="text-muted">
//                     {quiz.published ? "Published" : "Unpublished"} |
//                     {quiz.dueDate
//                       ? ` Due: ${new Date(quiz.dueDate).toLocaleDateString()}`
//                       : " No due date"}
//                   </div>
//                   <div className="quiz-points">{quiz.points}</div>
//                 </div>
//                 <div>
//                   <Button variant="outline-primary" size="sm">
//                     Details
//                   </Button>
//                 </div>
//                 <QuizDetails />
//               </ListGroup.Item>
//             )
//           )}
//         </ListGroup>
//       </Card>
//     </Container>
//   );
// };
export default Quizzes;
