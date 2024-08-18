import axios from "axios";

// Define the base API URL
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

// Fetch all quizzes for a specific course
export const fetchQuizzesForCourse = async (courseId: string) => {
  try {
    const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    throw error;
  }
};

export const removeQuiz = async (quizId: string) => {
  const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

// Fetch a specific quiz by its ID
export const fetchQuizById = async (quizId: string) => {
  try {
    const response = await axios.get(`${QUIZZES_API}/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch quiz:", error);
    throw error;
  }
};

// Create a new quiz for a specific course
export const createQuiz = async (courseId: string, quizData: any) => {
  try {
    const response = await axios.post(
      `${COURSES_API}/${courseId}/quizzes`,
      quizData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create quiz:", error);
    throw error;
  }
};

// Update an existing quiz
export const updateQuiz = async (quizId: string, quizData: any) => {
  try {
    const response = await axios.put(`${QUIZZES_API}/${quizId}`, quizData);
    return response.data;
  } catch (error) {
    console.error("Failed to update quiz:", error);
    throw error;
  }
};

// Create a new question for a specific quiz
export const createQuestion = async (quizId: string, questionData: any) => {
  try {
    const response = await axios.post(
      `${QUIZZES_API}/${quizId}/questions`,
      questionData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create question:", error);
    throw error;
  }
};

// Update an existing question
export const updateQuestion = async (
  quizId: string,
  questionId: string,
  questionData: any
) => {
  try {
    const response = await axios.put(
      `${QUIZZES_API}/${quizId}/questions/${questionId}`,
      questionData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update question:", error);
    throw error;
  }
};

// Fetch all questions for a specific quiz
export const fetchQuestionsByQuizId = async (quizId: string) => {
  try {
    const response = await axios.get(`${QUIZZES_API}/${quizId}/questions`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    throw error;
  }
};

// Delete a specific question by its ID
export const deleteQuestion = async (questionId: string) => {
  try {
    const response = await axios.delete(
      `${REMOTE_SERVER}/api/questions/${questionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete question:", error);
    throw error;
  }
};
