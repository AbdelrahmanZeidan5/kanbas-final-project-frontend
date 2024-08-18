import React from "react";

export default function DeleteQuizModal({
  dialogTitle,
  quizTitle,
  confirmDelete,
}: {
  dialogTitle: string;
  quizTitle: string;
  confirmDelete: () => void;
}) {
  return (
    <div
      id="wd-delete-quiz-dialog"
      className="modal fade"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{dialogTitle}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            Are you sure you want to delete the quiz "{quizTitle}"?
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              No
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={confirmDelete}
              data-bs-dismiss="modal"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
