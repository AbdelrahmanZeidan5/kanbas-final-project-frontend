// Example Control Buttons for Quizzes
import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { FaTrash } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

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
}: {
  quizId: string;
  quizTitle: string;
  onDeleteClick: (quizId: string, quizTitle: string) => void;
  isPublished: boolean;
}) {
  return (
    <div className="float-end">
      <FaTrash
        className="text-danger me-2 mb-1"
        onClick={() => onDeleteClick(quizId, quizTitle)}
        data-bs-toggle="modal"
        data-bs-target="#wd-delete-quiz-dialog"
      />
      {isPublished ? <GreenCheckmark /> : <IoIosCheckmarkCircleOutline />}
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
