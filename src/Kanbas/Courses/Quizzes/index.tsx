import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { IoEllipsisVertical, IoRocketOutline } from 'react-icons/io5';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { fetchQuizzesForCourse, fetchQuestionsByQuizId, updateQuiz, deleteQuiz } from './client';
import './index.css'; 
import QuizzesControls from './QuizzesControls';
import { useSelector } from 'react-redux'; 

const Quizzes = () => {
    const { cid } = useParams();
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: any) => state.accountReducer); 

    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                const quizzesData = await fetchQuizzesForCourse(cid as string);
                const quizzesWithQuestions = await Promise.all(
                    quizzesData.map(async (quiz: any) => {
                        const questions = await fetchQuestionsByQuizId(quiz._id);
                        return { ...quiz, questionsCount: questions.length };
                    })
                );
                setQuizzes(quizzesWithQuestions);
            } catch (error) {
                console.error("Failed to load quizzes:", error);
            }
        };
        loadQuizzes();
    }, [cid]);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            month: 'short', // Sep
            day: 'numeric', // 21
            hour: 'numeric', // 1 PM
            minute: 'numeric', // 00
            hour12: true // 12-hour format
        });
    };

    const handleEditQuiz = (quizId: string) => {
        navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}/edit`);
        setActiveMenu(null); // Close the menu
    };
  
    const handleDeleteQuiz = async (quizId: string) => {
        try {
            await deleteQuiz(quizId);
            setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
        } catch (error) {
            console.error("Failed to delete quiz:", error);
        } finally {
            setActiveMenu(null); // Close the menu
        }
    };
  
    const handleTogglePublish = async (quiz: any) => {
        try {
            const updatedQuiz = { ...quiz, published: !quiz.published };
            await updateQuiz(quiz._id, updatedQuiz);
            setQuizzes(quizzes.map(q => (q._id === quiz._id ? updatedQuiz : q)));
        } catch (error) {
            console.error("Failed to update quiz:", error);
        } finally {
            setActiveMenu(null); // Close the menu
        }
    };

    const getAvailabilityStatus = (availableFrom: string, availableUntil: string): string => {
        const now = new Date();
        const from = new Date(availableFrom);
        const until = new Date(availableUntil);
    
        if (now < from) {
            return `Not available until ${from.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
            })}`;
        } else if (now > until) {
            return 'Closed';
        } else {
            return 'Available';
        }
    };

    // Filter quizzes based on the search term
    const filteredQuizzes = quizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div id="wd-quizzes">
            <QuizzesControls onSearch={setSearchTerm} /> {/* Pass setSearchTerm as onSearch prop */}
            <br /><br />


            {/* Display a message if there are no quizzes */}
            {quizzes.length === 0 ? (
                <div className="text-center text-muted">
                    No quizzes available. Click <strong>+ Quiz</strong> to add a new quiz.
                </div>
            ) : (
              <>
                
                {/* Header Section */}
                <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
                    <div className="d-flex align-items-center" style={{ fontSize: '1.75rem' }}>
                        <span className="dropdown-toggle me-1 fs-3 ms-2"></span>
                        <span className="ms-2">Assignment Quizzes</span>
                    </div>
                </div>
                

                {/* Quiz List */}
                <ul className="wd-quiz-items list-group rounded-0">
                    {filteredQuizzes.map((quiz) => (
                        <li 
                            key={quiz._id} 
                            className="wd-quiz-item list-group-item d-flex align-items-center p-3"
                        >
                            <div className="d-flex align-items-center">
                                <IoRocketOutline className="me-3 ms-2 fs-3 quiz-icon" />
                            </div>
                            <div className="flex-grow-1 ms-2">
                                <Link to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`} className="wd-quiz-link text-decoration-none text-dark">
                                    <strong>{quiz.title}</strong>
                                </Link>
                                <div className="quiz-details">
                                    <span>
                                        {getAvailabilityStatus(quiz.availableFrom, quiz.availableUntil)}
                                    </span> | 
                                    <span className='ms-2'><strong>Due</strong> {quiz.dueDate ? formatDate(quiz.dueDate) : 'N/A'}</span> | 
                                    <span className='ms-2'>{quiz.points || 0} pts</span> | 
                                    <span className='ms-2'>{quiz.questionsCount || 0} Questions</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center position-relative">
                                {quiz.published ? (
                                    <FaCheckCircle className="text-success fs-4 me-3" />
                                ) : (
                                    <FaTimesCircle className="text-danger fs-4 me-3" />
                                )}
                                <button 
                                    className="btn btn-link text-secondary" 
                                    onClick={() => setActiveMenu(activeMenu === quiz._id ? null : quiz._id)}
                                    disabled={currentUser.role === 'STUDENT'} // Disable for students
                                >
                                    <IoEllipsisVertical className="fs-4 text-dark" />
                                </button>
                                {activeMenu === quiz._id && currentUser.role !== 'STUDENT' && (
                                    <div className="dropdown-menu show position-absolute" style={{ right: 0 }}>
                                        <button className="dropdown-item" onClick={() => handleEditQuiz(quiz._id)}>Edit</button>
                                        <button className="dropdown-item" onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
                                        <button className="dropdown-item" onClick={() => handleTogglePublish(quiz)}>
                                            {quiz.published ? 'Unpublish' : 'Publish'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
              </>
            )}
        </div>
    );
};

export default Quizzes;
