import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

const QuestionTypeEditor = ({
  question,
  onSave,
  onCancel,
}: {
  question: any;
  onSave: (question: any) => void;
  onCancel: () => void;
}) => {
  const [type, setType] = useState(question.type);
  const [title, setTitle] = useState(question.title);
  const [points, setPoints] = useState(question.points);
  const [questionText, setQuestionText] = useState(question.questionText);
  const [choices, setChoices] = useState(question.choices || []);

  useEffect(() => {
    setType(question.type);
    setTitle(question.title);
    setPoints(question.points);
    setQuestionText(question.questionText);
    setChoices(question.choices || []);
  }, [question]);

  const handleAddChoice = () => {
    setChoices([...choices, { text: "", isCorrect: false }]);
  };

  const handleChoiceChange = (index: number, text: string) => {
    const updatedChoices = [...choices];
    updatedChoices[index].text = text;
    setChoices(updatedChoices);
  };

  const handleCorrectChange = (index: number) => {
    const updatedChoices = choices.map((choice: any, i: number) => ({
      ...choice,
      isCorrect: i === index,
    }));
    setChoices(updatedChoices);
  };

  const handleRemoveChoice = (index: number) => {
    const updatedChoices = choices.filter((_: any, i: number) => i !== index);
    setChoices(updatedChoices);
  };

  const handleAddBlankAnswer = () => {
    setChoices([...choices, { text: "" }]);
  };

  const handleBlankAnswerChange = (index: number, text: string) => {
    const updatedChoices = [...choices];
    updatedChoices[index].text = text;
    setChoices(updatedChoices);
  };

  const handleRemoveBlankAnswer = (index: number) => {
    const updatedChoices = choices.filter((_: any, i: number) => i !== index);
    setChoices(updatedChoices);
  };

  const handleSave = () => {
    // Validate that the question text is not empty
    if (!questionText.trim()) {
      alert("Question text cannot be empty.");
      return;
    }

    // Validate that each choice text is not empty (only for MULTIPLE_CHOICE and FILL_IN_BLANK types)
    if (
      (type === "MULTIPLE_CHOICE" || type === "FILL_IN_BLANK") &&
      choices.some((choice: any) => !choice.text.trim())
    ) {
      alert("All answer choices must be filled.");
      return;
    }

    // Validate that a correct answer is selected for TRUE_FALSE questions
    if (
      type === "TRUE_FALSE" &&
      !choices.some((choice: any) => choice.isCorrect)
    ) {
      alert("Please select either 'True' or 'False' as the correct answer.");
      return;
    }

    // Ensure that FILL_IN_BLANK only sends the 'text' field
    const sanitizedChoices =
      type === "FILL_IN_BLANK"
        ? choices.map((choice: any) => ({ text: choice.text }))
        : choices;

    onSave({
      ...question,
      type,
      title,
      points,
      questionText,
      choices: sanitizedChoices,
    });
  };

  return (
    <div className="question-editor p-3">
      <div className="mb-3 d-flex align-items-center">
        <select
          className="form-select me-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="TRUE_FALSE">True/False</option>
          <option value="FILL_IN_BLANK">Fill in the Blank</option>
        </select>
        <input
          type="text"
          className="form-control me-3"
          placeholder="Question Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <span className="me-2">pts:</span>
        <input
          type="number"
          className="form-control"
          min="0"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Question:</label>
        <textarea
          className="form-control"
          rows={3}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </div>

      {type === "MULTIPLE_CHOICE" && (
        <div className="mb-3">
          <label className="form-label">Answers:</label>
          {choices.map((choice: any, index: number) => (
            <div className="input-group mb-2" key={index}>
              <div className="input-group-text">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={choice.isCorrect}
                  onChange={() => handleCorrectChange(index)}
                />
              </div>
              <input
                type="text"
                className="form-control"
                value={choice.text}
                placeholder={`Possible Answer ${index + 1}`}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => handleRemoveChoice(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-link text-danger"
            onClick={handleAddChoice}
          >
            + Add Another Answer
          </button>
        </div>
      )}

      {type === "TRUE_FALSE" && (
        <div className="mb-3">
          <label className="form-label">Select Correct Answer:</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="correctAnswer"
              id="trueOption"
              checked={choices[0]?.isCorrect}
              onChange={() =>
                setChoices([
                  { text: "True", isCorrect: true },
                  { text: "False", isCorrect: false },
                ])
              }
            />
            <label className="form-check-label" htmlFor="trueOption">
              True
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="correctAnswer"
              id="falseOption"
              checked={choices[1]?.isCorrect}
              onChange={() =>
                setChoices([
                  { text: "True", isCorrect: false },
                  { text: "False", isCorrect: true },
                ])
              }
            />
            <label className="form-check-label" htmlFor="falseOption">
              False
            </label>
          </div>
        </div>
      )}

      {type === "FILL_IN_BLANK" && (
        <div className="mb-3">
          <label className="form-label">Possible Correct Answers:</label>
          {choices.map((choice: any, index: number) => (
            <div className="input-group mb-2" key={index}>
              <input
                type="text"
                className="form-control"
                value={choice.text}
                placeholder={`Correct Answer ${index + 1}`}
                onChange={(e) => handleBlankAnswerChange(index, e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => handleRemoveBlankAnswer(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-link text-danger"
            onClick={handleAddBlankAnswer}
          >
            + Add Another Correct Answer
          </button>
        </div>
      )}

      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={handleSave}>
          Update Question
        </button>
      </div>
    </div>
  );
};

export default QuestionTypeEditor;
