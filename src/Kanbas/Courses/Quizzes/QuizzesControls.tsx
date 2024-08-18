import { useState } from 'react';
import { FaPlus, FaSearch } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux'; // Import useSelector to access the Redux store
import { createQuiz } from './client';

export default function QuizzesControls({ onSearch }: { onSearch: (query: string) => void }) { // Add onSearch prop
  const { cid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer); // Access the current user's role
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddQuiz = async () => {
    try {
      const newQuiz = {
        title: "New Quiz",
        course: cid,
        published: false,
        availableFrom: new Date(),
        availableUntil: new Date(),
        points: 0,
      };
      const createdQuiz = await createQuiz(cid as string, newQuiz);
      navigate(`/Kanbas/Courses/${cid}/Quizzes/${createdQuiz._id}/edit`);
    } catch (error) {
      console.error("Failed to create quiz:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Pass the query to the parent component
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
              id="wd-search-quiz"
              className="form-control form-control-lg"
              placeholder="Search for Quiz"
              value={searchQuery}
              onChange={handleSearchChange} // Call handleSearchChange on input change
            />
          </div>
        </div>

        {/* Conditionally render the buttons based on the user's role */}
        {currentUser.role !== 'STUDENT' && (
          <div className="col-12 col-md-6 text-md-end">
              <button id="wd-add-quiz" className="btn btn-lg btn-danger me-1" onClick={handleAddQuiz}>
                  <FaPlus className="me-2" />
                  Quiz
              </button>
              <button id="wd-quiz-options" className="btn btn-lg btn-secondary px-2">
                  <IoEllipsisVertical />
              </button>
          </div>
        )}
      </div>
    </div>
  );
}
