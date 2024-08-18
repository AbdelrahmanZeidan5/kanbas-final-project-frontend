import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";

export default function QuizControls() {
  const { cid } = useParams();

  const navigate = useNavigate();

  const handleAddQuiz = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/new`);
  };

  return (
    <div id="wd-quiz-controls" className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-6 mb-2 mb-md-0">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              id="wd-search-assignment"
              className="form-control form-control-lg"
              placeholder="Search for Quiz"
            />
          </div>
        </div>

        <div className="col-12 col-md-6 text-md-end">
          <button
            id="wd-add-assignment"
            className="btn btn-lg btn-danger"
            onClick={handleAddQuiz}
          ></button>
          <button
            id="wd-add-assignment"
            className="btn btn-lg btn-danger"
            onClick={handleAddQuiz}
          >
            <FaPlus className="me-2" />
            Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
