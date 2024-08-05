import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router';


export default function AssignmentControls() {
  const { cid } = useParams();
  
  const navigate = useNavigate();

  const handleAddAssignment = () => {
    navigate(`/Kanbas/Courses/${cid}/Assignments/new`);
  };

  return (
    <div id="wd-assignment-controls" className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-6 mb-2 mb-md-0">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              id="wd-search-assignment"
              className="form-control form-control-lg"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="col-12 col-md-6 text-md-end">
          <button id="wd-add-assignment-group" className="btn btn-lg btn-secondary me-1">
            <FaPlus className="me-2" />
            Group
          </button>

          <button id="wd-add-assignment" className="btn btn-lg btn-danger" onClick={handleAddAssignment}>
            <FaPlus className="me-2" />
            Assignment
          </button>
        </div>


      </div>
    </div>
  );
}


