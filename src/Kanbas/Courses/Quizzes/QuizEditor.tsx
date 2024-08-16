import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuestionTypeEditor from './QuestionTypeEditor';
import { createQuiz, updateQuiz, createQuestion, updateQuestion, fetchQuizById, fetchQuestionsByQuizId, deleteQuestion } from './client';

const QuizEditor = () => {
    const { cid, quizId } = useParams(); 
    const [activeTab, setActiveTab] = useState<'details' | 'questions'>('details');
    const [questions, setQuestions] = useState<any[]>([]);
    const [totalPoints, setTotalPoints] = useState(0);
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
            title: '',
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

    return (
        <div className="quiz-editor p-4">
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
                        {/* Add fields for editing quiz title, description, etc. */}
                        <p>Edit the quiz's details here...</p>
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
