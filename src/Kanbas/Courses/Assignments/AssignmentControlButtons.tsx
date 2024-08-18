import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { FaTrash } from "react-icons/fa";
import "./index.css";

export function AssignmentsControlButtons() {
  return (
    <div className="d-flex align-items-center ms-auto">
      <span className="assignment-control-buttons-text me-2">40% of Total</span>
      <BsPlus className="me-3" />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}

export function AssignmentControlButtons({
  assignmentId,
  assignmentTitle,
  onDeleteClick,
}: {
  assignmentId: string;
  assignmentTitle: string;
  onDeleteClick: (assignmentId: string, assignmentTitle: string) => void;
}) {
  return (
    <div className="float-end">
      <FaTrash
        className="text-danger me-2 mb-1"
        onClick={() => onDeleteClick(assignmentId, assignmentTitle)}
        data-bs-toggle="modal"
        data-bs-target="#wd-delete-assignment-dialog"
      />
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
