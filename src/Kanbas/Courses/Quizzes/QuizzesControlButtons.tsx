// Example Control Buttons for Quizzes
import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { FaTrash } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { updateQuiz } from "./client";

const { cid } = useParams();

export function QuizzesControlButtons() {
  return (
    <div className="d-flex align-items-center ms-auto">
      <span className="quizzes-control-buttons-text me-2">Quizzes</span>
      <BsPlus className="me-3" />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}

export function QuizControlButtons({
  quizId,
  quizTitle,
  onDeleteClick,
  isPublished,
  onPublishToggle,
}: {
  quizId: string;
  quizTitle: string;
  onDeleteClick: (quizId: string, quizTitle: string) => void;
  isPublished: boolean;
  onPublishToggle: (quizId: string, isPublished: boolean) => void;
}) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => setMenuOpen(!isMenuOpen);

  const handleEditClick = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}`);
  };

  const handlePublishClick = async () => {
    try {
      await updateQuiz(quizId, { published: !isPublished }); // Toggle the published status
      onPublishToggle(quizId, !isPublished); // Notify parent component about the change
    } catch (error) {
      console.error("Failed to update quiz:", error);
    }
  };
  return (
    <div className="float-end position-relative">
      {/* <FaTrash
        className="text-danger me-2 mb-1"
        onClick={() => onDeleteClick(quizId, quizTitle)}
        data-bs-toggle="modal"
        data-bs-target="#wd-delete-quiz-dialog"
      /> */}
      {isPublished ? <GreenCheckmark /> : <IoIosCheckmarkCircleOutline />}
      <IoEllipsisVertical className="fs-4" onClick={handleMenuToggle} />

      {isMenuOpen && (
        <div className="position-absolute end-0 bg-white border rounded shadow-sm p-2">
          <button className="dropdown-item" onClick={handleEditClick}>
            Edit
          </button>
          <button className="dropdown-item" onClick={handlePublishClick}>
            {isPublished ? "Unpublish" : "Publish"}
          </button>
          <button
            className="dropdown-item text-danger"
            onClick={() => onDeleteClick(quizId, quizTitle)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
