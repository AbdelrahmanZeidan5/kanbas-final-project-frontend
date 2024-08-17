import React, { useState } from 'react';
import QuestionTypeEditor from './QuestionTypeEditor';

const QuizEditor = () => {
    const [quiz, setQuiz] = useState<any>();
    const [activeTab, setActiveTab] = useState<'details' | 'questions'>('details');
    const [questions, setQuestions] = useState<any[]>([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

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

    const handleCancelEdit = () => {
        setEditingQuestionIndex(null);
    };

    const updateTotalPoints = (updatedQuestions: any[]) => {
        const total = updatedQuestions.reduce((sum, q) => sum + q.points, 0);
        setTotalPoints(total);
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
                        <input type="text" placeholder="Unamed Quiz" className='form-control'
                            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
                        
                        <div id='wd-quiz-instructions'>
                            Quiz Instructions
                            <div id='wd-quiz-edit-tools'>
                                <span></span>

                            </div>
                        </div>

                        <div id='quiz-editors'>
                            <div className='row'>
                                <div className='col-2'>
                                    Quiz Type
                                </div>
                                <div className='col-8'>
                                    <select className='form-select'>
                                        <option value="Graded Quiz" selected>Graded Quiz</option>
                                        <option value="Practice Quiz">Practice Quiz</option>
                                        <option value="Graded Survey">Graded Survey</option>
                                        <option value="Ungraded Survey">Ungraded Survey</option>
                                    </select>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-2'>
                                    Assignment Group
                                </div>
                                <div className='col-8'>
                                    <select className='form-select'>
                                        <option value="Quizzes" selected>Quizzes</option>
                                        <option value="Exams">Exams</option>
                                        <option value="Assignments">Assignments</option>
                                        <option value="Project">Project</option>
                                    </select>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-2'>
                                </div>
                                <div className='col-8'>
                                    <span className='fw-bold'>Options</span>
                                    <input type="checkbox" id='shuffle' />
                                    <label htmlFor="shuffle">Shuffle Answers</label>

                                    <input type="checkbox" id='time-limit' />
                                    <label htmlFor="time-limit">Time Limit</label>

                                    <input type='text' className='w-10 form-control' id='minutes'/>
                                    <label htmlFor="minutes">Minutes</label>

                                    <div className='form-control'>
                                        <input type="checkbox" id='attempts' />
                                        <label htmlFor="attempts">Allow Multiple Attempts</label>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-2'>
                                    Assign
                                </div>
                                <div className='col-8 form-control'>
                                    <span className='fw-bold'>Assign to</span>
                                    
                                </div>
                            </div>
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
                                            <div>
                                                {question.title || `Question ${index + 1}`} - {question.type}
                                            </div>
                                            <div>
                                                <span>{question.points} pts</span>
                                                <button className="btn btn-link ms-3" onClick={() => handleEditQuestion(index)}>
                                                    Edit
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
                                    <button className="btn btn-danger" onClick={handleSaveQuestion}>Save</button>
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
