import { addAssignment, updateAssignment } from "./reducer";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import * as client from "./client";


export default function AssignmentEditor() {
    const { id, cid } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const assignment = assignments.find((assignment: any) => assignment._id === id);

    const [title, setTitle] = useState(assignment?.title || "");
    const [description, setDescription] = useState(assignment?.description || "");
    const [points, setPoints] = useState(assignment?.points || 100);
    const [dueDate, setDueDate] = useState(assignment?.dueDate || "");
    const [availableFrom, setAvailableFrom] = useState(assignment?.availableFrom || "");
    const [availableUntil, setAvailableUntil] = useState(assignment?.availableUntil || "");


    const createAssignment = async (assignment: any) => {
      const newAssignment = await client.createAssignment(cid as string, assignment);
      dispatch(addAssignment(newAssignment));
    };
  
    
    const saveAssignment = async (assignment: any) => {
      const status = await client.updateAssignment(assignment);
      dispatch(updateAssignment(assignment));
    }

    const handleSave = () => {
      const newAssignment: any = {
        title,
        description,
        points,
        dueDate,
        availableFrom,
        availableUntil,
      };


      if (id && id !== "new") {
        newAssignment._id = assignment._id; 
        saveAssignment(newAssignment);
      } else {
        createAssignment(newAssignment);
      }
      
      navigate(`/Kanbas/Courses/${cid}/Assignments`);
    };

    
    console.log("Rendering Link with cid:", cid);
    
    return (
      <div id="wd-assignments-editor" className="container">


        <div className="mb-4">
          <label htmlFor="wd-name" className="form-label">Assignment Name</label>
          <input id="wd-name" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" placeholder="New Assignment" />
        </div>

        <div className="mb-4">
          <label htmlFor="wd-description" className="form-label">Description</label>
          <textarea id="wd-description" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" placeholder="New Assignment Description"  style={{ height: 'auto' }} />
        </div>

        <div className="row mb-4 align-items-center">
          <div className="col-md-4 text-md-end">
              <label htmlFor="wd-points" className="form-label">Points</label>
          </div>
          <div className="col-md-8">
              <input id="wd-points" value={points} onChange={(e) => setPoints(parseInt(e.target.value))} className="form-control" />
          </div>
        </div>



        <div className="row mb-4 align-items-center">
          <div className="col-md-4 text-md-end">
            <label htmlFor="wd-group" className="form-label">Assignment Group</label>
          </div>
          <div className="col-md-8">
            <select id="wd-group" className="form-select">
              <option selected value="ASSIGNMENTS">ASSIGNMENTS</option>
            </select>
          </div>
        </div>


        <div className="row mb-4 align-items-center">
          <div className="col-md-4 text-md-end">
            <label htmlFor="wd-display-grade-as" className="form-label">Display Grade as</label>
          </div>
          <div className="col-md-8">
            <select id="wd-display-grade-as" className="form-select">
              <option selected value="Percentage">Percentage</option>
            </select>
          </div>
        </div>

        <div className="row mb-4 align-items-center">
          <div className="col-md-4 text-md-end align-self-start">
            <label htmlFor="wd-submission-type" className="form-label">Submission Type</label>
          </div>
          <div className="col-md-8">
            <div className="p-3 border">
              <select id="wd-submission-type" className="form-select mb-3">
                <option selected value="Online">Online</option>
              </select> 

              <label className="form-label fw-semibold">Online Entry Options</label>
              <div className="form-check">
                <input id="wd-text-entry" type="checkbox" name="check-online-option" className="form-check-input" />
                <label htmlFor="wd-text-entry" className="form-check-label">Text Entry</label>
              </div>
              <div className="form-check">
                <input id="wd-website-url" type="checkbox" name="check-online-option" className="form-check-input" checked/>
                <label htmlFor="wd-website-url" className="form-check-label">Website URL</label>
              </div>
              <div className="form-check">
                <input id="wd-media-recordings" type="checkbox" name="check-online-option" className="form-check-input" />
                <label htmlFor="wd-media-recordings" className="form-check-label">Media Recordings</label>
              </div>
              <div className="form-check">
                <input id="wd-student-annotation" type="checkbox" name="check-online-option" className="form-check-input" />
                <label htmlFor="wd-student-annotation" className="form-check-label">Student Annotation</label>
              </div>
              <div className="form-check">
                <input id="wd-file-upload" type="checkbox" name="check-online-option" className="form-check-input" />
                <label htmlFor="wd-file-upload" className="form-check-label">File Uploads</label>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4 align-items-center">
          <div className="col-md-4 text-md-end align-self-start">
            <label htmlFor="wd-assign" className="form-label">Assign</label>
          </div>
          <div className="col-md-8">
            <div className="p-3 border">

              <div className="row mb-4 align-items-center">
                <div className="col-md-4">
                  <label htmlFor="wd-assign-to" className="form-label">Assign to</label>
                </div>
                <div className="col-md-8">
                  <input id="wd-assign-to" value="Everyone" className="form-control" />
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <div className="col-md-4">
                  <label htmlFor="wd-due-date" className="form-label">Due</label>
                </div>
                <div className="col-md-8">
                  <input type="date" id="wd-due-date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="form-control" />
                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <div className="col-md-4">
                  <label htmlFor="wd-available-from" className="form-label">Available from</label>
                </div>
                <div className="col-md-8">
                  <input type="date" id="wd-available-from" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} className="form-control" />

                </div>
              </div>

              <div className="row mb-4 align-items-center">
                <div className="col-md-4">
                  <label htmlFor="wd-available-until" className="form-label">Until</label>
                </div>
                <div className="col-md-8">
                  <input type="date" id="wd-available-until" value={availableUntil} onChange={(e) => setAvailableUntil(e.target.value)} className="form-control" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <Link to={`/Kanbas/Courses/${cid}/Assignments`} id="wd-cancel" className="btn btn-secondary me-2">Cancel</Link>
          <Link to={`/Kanbas/Courses/${cid}/Assignments`} id="wd-save" className="btn btn-success" onClick={handleSave}>Save</Link>
        </div>

      </div>
    );
}
