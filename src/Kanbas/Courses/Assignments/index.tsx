import { BsGripVertical } from "react-icons/bs";
import AssignmentControls from "./AssignmentControls";
import { AssignmentsControlButtons, AssignmentControlButtons } from "./AssignmentControlButtons";
import { FaRegEdit } from "react-icons/fa";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { setAssignments, deleteAssignment } from "./reducer";
import { useState, useEffect } from "react";
import DeleteAssignmentModal from "./DeleteAssignmentModal";
import * as client from "./client";

export default function Assignments() {
    const { cid } = useParams();
    const dispatch = useDispatch();
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const [selectedAssignment, setSelectedAssignment] = useState<{ id: string, title: string } | null>(null);


    const fetchAssignments = async () => {
      const assignments = await client.findAssignmentsForCourse(cid as string);
      dispatch(setAssignments(assignments));
    };

    useEffect(() => {
      fetchAssignments();
    }, []);

    const handleDeleteClick = (assignmentId: string, assignmentTitle: string) => {
        setSelectedAssignment({ id: assignmentId, title: assignmentTitle });
    };

    const confirmDelete = async () => {
        if (selectedAssignment) {
            await client.removeAssignment(selectedAssignment.id);
            dispatch(deleteAssignment(selectedAssignment.id));
            setSelectedAssignment(null);
        }
    };

    return (
      <div id="wd-assignments">
        <AssignmentControls /><br /><br /><br /><br />
      
        <ul id="wd-assignment-list" className="list-group rounded-0">
          <li className="wd-assignment-list-item list-group-item p-0 mb-5 fs-5 border-gra">
            <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <span className="dropdown-toggle me-1"></span>
                ASSIGNMENTS
              </div>
              <AssignmentsControlButtons />
            </div>

            <ul className="wd-assignment-items list-group rounded-0">
              {assignments.filter((assignment: any) => assignment.course === cid).map((assignment: any) => (
                <li key={assignment._id} className="wd-assignment-item list-group-item d-flex align-items-center p-3 ps-1">
                  <div className="d-flex align-items-center">
                    <BsGripVertical className="me-2 fs-3" />
                    <FaRegEdit className="me-2 fs-3 assignment-icon" />
                  </div>
                  <div className="flex-grow-1">
                    <a className="wd-assignment-link text-decoration-none text-dark" href={`#/Kanbas/Courses/${assignment.course}/Assignments/${assignment._id}`}>
                      <strong>{assignment.title}</strong>
                    </a>
                    <div className="assignment-details">
                      <span className="text-danger">Multiple Modules </span>| 
                      <span><strong> Not available until </strong> {new Date(assignment.availableFrom).toLocaleString('en-US', { month: 'long', day: 'numeric' })} at 12:00am</span> |
                      <span><strong>Due</strong> {new Date(assignment.dueDate).toLocaleString('en-US', { month: 'long', day: 'numeric' })} at 11:59pm</span> |
                      <span>{assignment.points} pts</span>
                    </div>
                  </div>
                  <AssignmentControlButtons assignmentId={assignment._id} assignmentTitle={assignment.title} onDeleteClick={handleDeleteClick} />
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <DeleteAssignmentModal
          dialogTitle="Confirm Deletion"
          assignmentTitle={selectedAssignment?.title || ''}
          confirmDelete={confirmDelete}
        />
      </div>
    );
}
