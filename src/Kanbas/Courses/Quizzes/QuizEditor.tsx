import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import QuestionTypeEditor from './QuestionTypeEditor';
import { createQuiz, updateQuiz, createQuestion, updateQuestion, fetchQuizById, fetchQuestionsByQuizId, deleteQuestion } from './client';
import { IoCalendarOutline, IoEllipsisVertical } from 'react-icons/io5';
import { FcCancel } from "react-icons/fc";
import { MdPublishedWithChanges } from "react-icons/md";

const QuizEditor = () => {
    const { cid, quizId } = useParams();
    const [activeTab, setActiveTab] = useState<'details' | 'questions'>('details');
    const [questions, setQuestions] = useState<any[]>([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [haveTimeLimit, setTimeLimit] = useState(false);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
    const [quizData, setQuizData] = useState<any>({
        title: '',
        description: '',
        type: 'GRADED_QUIZ',
        points: 0,
    });

    useEffect(() => {
        const loadQuizData = async () => {
            if (quizId) {
                const fetchedQuiz = await fetchQuizById(quizId);
                setQuizData(fetchedQuiz);
                const fetchedQuestions = await fetchQuestionsByQuizId(quizId);
                setQuestions(fetchedQuestions);
                updateTotalPoints(fetchedQuestions);
            }
        };
        loadQuizData();
    }, [quizId]);

    const handleAddQuestion = () => {
        const newQuestion = {
            title: 'Unnamed Quiz',
            type: 'MULTIPLE_CHOICE',
            points: 0,
            questionText: '',
            choices: [{ text: '', isCorrect: false }]
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleEditQuestion = (index: number) => {
        setEditingQuestionIndex(index);
    };

    const handleSaveQuestion = (updatedQuestion: any) => {
        const updatedQuestions = [...questions];
        if (editingQuestionIndex !== null) {
            updatedQuestions[editingQuestionIndex] = updatedQuestion;
            setQuestions(updatedQuestions);
            updateTotalPoints(updatedQuestions);
        }
        setEditingQuestionIndex(null);
    };

    const handleCancelEdit = async () => {
        setEditingQuestionIndex(null);
        if (quizId) {
            // Refetch the questions from the server to discard unsaved changes
            const fetchedQuestions = await fetchQuestionsByQuizId(quizId);
            setQuestions(fetchedQuestions);
            updateTotalPoints(fetchedQuestions);
        }
    };

    const handleDeleteQuestion = async (index: number, questionId: string) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            try {
                if (questionId) {
                    await deleteQuestion(questionId);
                }
                const updatedQuestions = questions.filter((_, i) => i !== index);
                setQuestions(updatedQuestions);
                updateTotalPoints(updatedQuestions);
            } catch (error) {
                console.error('Failed to delete question:', error);
                alert('Failed to delete question');
            }
        }
    };

    const updateTotalPoints = (updatedQuestions: any[]) => {
        const total = updatedQuestions.reduce((sum, q) => sum + q.points, 0);
        setTotalPoints(total);
    };

    const handleSaveQuiz = async () => {
        try {
            let savedQuiz;
            if (quizId) {
                savedQuiz = await updateQuiz(quizId, { ...quizData, points: totalPoints });
            } else {
                savedQuiz = await createQuiz(cid!, { ...quizData, points: totalPoints });
            }

            const quizIdToUse = quizId || savedQuiz._id;

            // Save or update each question
            for (const question of questions) {
                if (question._id) {
                    await updateQuestion(quizIdToUse, question._id, question);
                } else {
                    await createQuestion(quizIdToUse, question);
                }
            }

            alert('Quiz and questions saved successfully!');
        } catch (error) {
            console.error('Error saving quiz:', error);
            alert('Failed to save quiz');
        }
    };

    console.log("TT: ", quizData)
    return (
        <div className="quiz-editor p-4">
            <div className=''>
                <IoEllipsisVertical className='d-flex float-end ms-3 fs-5 border-secondary border rounded-1 bg-secondary text-secondary' />
                <div className='d-flex float-end ms-3 '>
                    {!quizData.published &&
                        (<div className='d-flex'>
                            <FcCancel className='fs-5 text-secondary' />
                            <span className='text-secondary ms-1'>Not Published</span>
                        </div>)}
                    {quizData.published && (
                        <div>
                            <MdPublishedWithChanges className='fs-5 text-success ' />
                            <span className='ms-1'>Published</span>
                        </div>
                    )}

                </div>
                <h5 className='d-flex float-end'>Points {quizData.points}</h5>
            </div>
            <br />
            <hr />
            <div>
                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button
                            className={`nav-link text-dark ${activeTab === 'details' ? 'active' : ''}`}
                            onClick={() => setActiveTab('details')}
                        >
                            Details
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link text-dark ${activeTab === 'questions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('questions')}
                        >
                            Questions
                        </button>
                    </li>
                </ul>
            </div>
            <div>
                {activeTab === 'details' && (
                    <div>
                        <input type="text" value={quizData.title} placeholder={quizData.title} className='form-control mb-2'
                            onChange={(e) => setQuizData({ ...quizData, title: e.target.value })} />

                        <input type="text" value={quizData.description} placeholder={quizData.description} className='form-control mb-2'
                            onChange={(e) => setQuizData({ ...quizData, description: e.target.value })} />
                        <div id='wd-quiz-instructions' className='mb-2 mt-3'>
                            Quiz Instructions:
                            <div id='wd-quiz-edit-tools'>
                                <span></span>

                            </div>
                        </div>

                        <div id='quiz-editors'>
                            <div className='row mb-2'>
                                <div className='d-flex col-3 justify-content-end'>
                                    Quiz Type
                                </div>
                                <div className='col-7'>
                                    <select className='form-select' onChange={(e) => setQuizData({ ...quizData, type: e.target.value })}>
                                        <option value="GRADED_QUIZ" selected={quizData.type === "GRADED_QUIZ"}>Graded Quiz</option>
                                        <option value="PRACTICE_QUIZ" selected={quizData.type === "PRACTICE_QUIZ"}>Practice Quiz</option>
                                        <option value="GRADE_SURVEY" selected={quizData.type === "GRADE_SURVEY"}>Graded Survey</option>
                                        <option value="UNGRADED_SURVEY" selected={quizData.type === "UNGRADED_SURVEY"}>Ungraded Survey</option>
                                    </select>
                                </div>
                            </div>
                            <div className='row mb-2'>
                                <div className='d-flex col-3 justify-content-end'>
                                    Assignment Group
                                </div>
                                <div className='col-8'>
                                    <select className='form-select' onChange={(e) => setQuizData({ ...quizData, assignmentGroup: e.target.value })}>
                                        <option value="Quizzes" selected={quizData.assignmentGroup === "Quizzes"}>Quizzes</option>
                                        <option value="Exams" selected={quizData.assignmentGroup === "Exams"}>Exams</option>
                                        <option value="Assignments" selected={quizData.assignmentGroup === "Assignments"}>Assignments</option>
                                        <option value="Project" selected={quizData.assignmentGroup === "Project"}>Project</option>
                                    </select>
                                </div>
                            </div>
                            <div className='row mb-2 mt-4'>
                                <div className='col-3'>
                                </div>
                                <div className='col-7'>
                                    <span className='fw-bold mb-2'>Options</span><br />
                                    <input type="checkbox" id='shuffle' checked={quizData.shuffleAnswers} style={{ zoom: 1.25 }}
                                        onChange={(e) => setQuizData({ ...quizData, shuffleAnswers: e.target.checked })} />
                                    <label htmlFor="shuffle" className='p-2 mb-3'>Shuffle Answers</label> <br />

                                    <div className='row mb-2'>
                                        <div className='col d-flex'>
                                            <input type="checkbox" id='time-limit' checked={quizData.timeLimit > 0} style={{ zoom: 1.25 }} 
                                                onChange={(e) => {
                                                    !e.target.checked && setQuizData({ ...quizData, timeLimit: 0 });
                                                    setTimeLimit(!haveTimeLimit);
                                                }} />
                                            <label htmlFor="time-limit" className='ms-2 pb-2'>Time Limit</label>
                                        </div>
                                        {
                                            haveTimeLimit && (
                                                <div className='col d-flex'>
                                                    <input type='number' className='form-control' id='minutes' placeholder={quizData.timeLimit} min={0}
                                                        onChange={(e) => haveTimeLimit && setQuizData({ ...quizData, timeLimit: e.target.value })} />
                                                    <label htmlFor="minutes" className='p-2'>Minutes</label>
                                                </div>
                                            )

                                        }
                                        
                                    </div>

                                    <div className='form-control'>
                                        <input type="checkbox" id='attempts' checked={quizData.multipleAttempts} style={{ zoom: 1.25 }} className='mt-3'
                                            onChange={(e) => setQuizData({ ...quizData, multipleAttempts: e.target.checked })} />
                                        <label htmlFor="attempts" className='p-1 ms-2'>Allow Multiple Attempts</label>
                                        <br />
                                        <input type="checkbox" id='lockQuestionsAfterAnswering' checked={quizData.lockQuestionsAfterAnswering} style={{ zoom: 1.25 }} className='mt-3'
                                            onChange={(e) => setQuizData({ ...quizData, lockQuestionsAfterAnswering: e.target.checked })} />
                                        <label htmlFor="lockQuestionsAfterAnswering" className='p-1 ms-2'>Lock Questions After Answering</label>
                                        <br />
                                        <input type="checkbox" id='oneQuestionAtATime' checked={quizData.oneQuestionAtATime} style={{ zoom: 1.25 }} className='mt-3'
                                            onChange={(e) => setQuizData({ ...quizData, oneQuestionAtATime: e.target.checked })} />
                                        <label htmlFor="oneQuestionAtATime" className='p-1 ms-2'>One Question at a Time</label>
                                        <br />
                                        <input type="checkbox" id='showCorrectAnswers' checked={quizData.showCorrectAnswers} style={{ zoom: 1.25 }} className='mt-3'
                                            onChange={(e) => setQuizData({ ...quizData, showCorrectAnswers: e.target.checked })} />
                                        <label htmlFor="showCorrectAnswers" className='p-1 ms-2'>Show Correct Answers</label>
                                        
                                        
                                        
                                    </div>
                                </div>
                            </div>

                            <div className='row mb-2'>
                                <div className='d-flex col-3 justify-content-end'>
                                    Assign
                                </div>
                                <div className='col-7'>
                                    <div className='form-control'>
                                        <div id='wd-due-editor' className='mb-2 mt-2'>
                                            <span className='fw-bold'>Due</span><br />

                                            <div className='input-group'>
                                                <input type="date" className='form-control' value={quizData.dueDate ? quizData.dueDate.slice(0, 10) : ""}
                                                    onChange={(e) => setQuizData({ ...quizData, dueDate: e.target.value })} />
                                                <span className='input-group-text fs-5'><IoCalendarOutline /></span>
                                            </div>
                                        </div>
                                        <div id='wd-dates-editor'>
                                            <div className='row mt-4'>
                                                <div className='col mb-4'>
                                                    <span className='fw-bold'>Available from</span><br />

                                                    <div className='input-group'>
                                                        <input type="date" className='form-control' value={quizData.availableFrom ? quizData.availableFrom.slice(0, 10) : ""}
                                                            onChange={(e) => setQuizData({ ...quizData, availableFrom: e.target.value })} />
                                                        <span className='input-group-text fs-5'><IoCalendarOutline /></span>
                                                    </div>
                                                </div>
                                                <div className='col mb-4'>
                                                    <span className='fw-bold'>Until</span><br />

                                                    <div className='input-group'>
                                                        <input type="date" className='form-control' value={quizData.availableUntil ? quizData.availableUntil.slice(0, 10) : ""}
                                                            onChange={(e) => setQuizData({ ...quizData, availableUntil: e.target.value })} />
                                                        <span className='input-group-text fs-5'><IoCalendarOutline /></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row mb-2'>
                                <div className='col-3 d-flex justify-content-end'>
                                    Requirements
                                </div>
                                <div className='col-7'>
                                    <div className='form-control'>
                                        <input type="checkbox" id='webcamRequired' checked={quizData.webcamRequired} style={{ zoom: 1.25 }} className='mt-3'
                                            onChange={(e) => setQuizData({ ...quizData, webcamRequired: e.target.checked })} />
                                        <label htmlFor="webcamRequired" className='p-1 ms-2'>Webcam Required</label>
                                        <br />

                                        <div className='row mt-3'>
                                            <label htmlFor="access-code" className='col'>Access Code</label>
                                            <input id="access-code" type="text" className='form-control col me-3' placeholder={quizData.accessCode}
                                            onChange={(e) => setQuizData({...quizData, accessCode: e.target.value})}/>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <button className="btn btn-lg btn-secondary me-2" onClick={handleCancelEdit}>Cancel</button>
                            <button className="btn btn-lg btn-danger" onClick={handleSaveQuiz}>Save</button>
                        </div>
                    </div>
                )}

                {activeTab === 'questions' && (
                    <div>
                        {editingQuestionIndex === null ? (
                            <div>
                                <div className="mb-3">
                                    <button className="btn btn-outline-dark" onClick={handleAddQuestion}>
                                        + New Question
                                    </button>
                                </div>
                                <ul className="list-group">
                                    {questions.map((question, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <div className="me-2 d-flex align-items-center justify-content-center border-end pe-3">
                                                    <strong>{index + 1}</strong>
                                                </div>
                                                <div>
                                                    {question.title || `Question ${index + 1}`} - {question.type}
                                                </div>
                                            </div>
                                            <div>
                                                <span>{question.points} pts</span>
                                                <button className="btn btn-link ms-3" onClick={() => handleEditQuestion(index)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-link text-danger ms-3" onClick={() => handleDeleteQuestion(index, question._id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-3">
                                    <strong>Total Points: {totalPoints}</strong>
                                </div>
                                <div className="d-flex justify-content-end mt-3">
                                    <button className="btn btn-secondary me-2" onClick={handleCancelEdit}>Cancel</button>
                                    <button className="btn btn-danger" onClick={handleSaveQuiz}>Save</button>
                                </div>
                            </div>
                        ) : (
                            <QuestionTypeEditor
                                question={questions[editingQuestionIndex]}
                                onSave={handleSaveQuestion}
                                onCancel={handleCancelEdit}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizEditor;
