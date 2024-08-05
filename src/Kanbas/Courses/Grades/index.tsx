import { FaSearch } from "react-icons/fa";
import * as db from "../../Database";
import GradesControls from "./GradesControls";
import { CiFilter } from "react-icons/ci";
import { useParams } from "react-router";


export default function Grades() { 
    const { cid } = useParams();
    const grades = db.grades;
    const assignments = db.assignments;

    const courseAssignments = assignments.filter((assignment) => assignment.course === cid);
    const courseUsers = db.enrollments.filter((enrollment) => enrollment.course === cid);
    const students = db.users.filter((user) => courseUsers.some((enrollment) => enrollment.user === user._id));
    const courseGrades = grades.filter((grade) => courseUsers.some((user) => user.user === grade.student));

    return (
        <div id="wd-grades">
            <GradesControls /> <br /><br /><br /><br />

            <div className="row">
                <div className="col-12 col-md-6 mb-2">
                    <h4>Student Names</h4>
                    <div className="input-group">
                        <span className="input-group-text">
                            <FaSearch />
                        </span>
                        <input
                            id="wd-search-students"
                            className="form-control"
                            placeholder="Search Students"
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                    <h4>Assignments Names</h4>
                    <div className="input-group">
                        <span className="input-group-text">
                            <FaSearch />
                        </span>
                        <input
                            id="wd-search-assignments"
                            className="form-control"
                            placeholder="Search Assignments"
                        />
                    </div>
                </div>
            </div>

            <div className="row mb-2">
                <div className="col-12 col-md-3 mb-2">
                    <button id="wd-add-assignment" className="btn btn-secondary">
                        <CiFilter className="fs-3 me-2" />
                        Apply Filters
                    </button>
                </div>
            </div>

            <div id="wd-grades-tables">
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                {courseAssignments.length > 0 && (
                                    <>
                                        <th className="align-middle">Student Name</th>
                                        {courseAssignments.map((assignment) => (
                                            <th key={assignment._id}>{assignment.title}</th>
                                        ))}
                                    </>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((student) => (
                                <tr key={student._id}>
                                    <td className="text-danger">{student.firstName} {student.lastName}</td>
                                    {courseAssignments.map((assignment) => {
                                        const grade = courseGrades.find((grade) => grade.assignment === assignment._id && grade.student === student._id);
                                        return (
                                            <td key={assignment._id}>{grade ? `${grade.grade}%` : "N/A"}</td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}