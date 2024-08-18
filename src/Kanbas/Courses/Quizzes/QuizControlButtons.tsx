import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import GreenCheckmark from "../Modules/GreenCheckmark";
import "./index.css";

export function QuizzessControlButtons() {
  return (
    <div className="d-flex align-items-center ms-auto">
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}

export function QuizControlButtons({
  quizId,
  quizTitle,
  onDeleteClick,
}: {
  quizId: string;
  quizTitle: string;
  onDeleteClick: (quizId: string, quizTitle: string) => void;
}) {
  return (
    <div className="float-end">
      {/* <FaTrash
        className="text-danger me-2 mb-1"
        onClick={() => onDeleteClick(assignmentId, assignmentTitle)}
        data-bs-toggle="modal"
        data-bs-target="#wd-delete-assignment-dialog"
      /> */}
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
