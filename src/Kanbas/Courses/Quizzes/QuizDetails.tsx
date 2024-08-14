import { useParams } from "react-router";
import { GiPencil } from "react-icons/gi";

export default function QuizDetailsScreen() {
    const quiz = {
        quizName: "name",
        points: "30"
    }
    return (
        <div id="wd-quiz-detail-screen">
            <div id="wd-quiz-details-header" className="d-flex justify-content-center">
                <button className="btn btn-lg btn-secondary m-2">Preview</button>
                <button className="btn btn-lg btn-secondary m-2"><GiPencil className="me-2"/>Edit</button>
            </div>
            <hr />
            <div id="wd-quiz-details">

                <h1>Q1 - HTML</h1>

                <div className="m-5">
                    <div className="row">
                        <div className="d-flex col-4 justify-content-end fw-bold">Quiz Type</div>
                        <div className="d-flex col-6">Graded Quiz</div>
                    </div>
                    <div className="row">
                        <div className="d-flex col-4 justify-content-end fw-bold">Points</div>
                        <div className="d-flex col-6">100</div>
                    </div>
                    <div className="row">
                        <div className="d-flex col-4 justify-content-end fw-bold">Assignment Group</div>
                        <div className="d-flex col-6">Quizzes</div>
                    </div>
                    <div className="row">
                        <div className="d-flex col-4 justify-content-end fw-bold">Shuffle Answers</div>
                        <div className="d-flex col-6">No</div>
                    </div>
                    <div className="row">
                        <div className="d-flex col-4 justify-content-end fw-bold">Time Limit</div>
                        <div className="d-flex col-6">20 Minutes</div>
                    </div>
                    <div className="row">
                        <div className="d-flex col-4 justify-content-end fw-bold">Multiple Attempts</div>
                        <div className="d-flex col-6">No</div>
                    </div>
                    <div className="row">
                        <div className="d-flex col-4 justify-content-end fw-bold">How Many Attempts</div>
                        <div className="d-flex col-6">1</div>
                    </div>
                    <div className="row">
                        <div className="d-flex col-4 justify-content-end fw-bold">Show Correct Answers</div>
                        <div className="d-flex col-6">Immediately</div>
                    </div>
                    <div className="row">
                        <div className="d-flex col-4 justify-content-end fw-bold">Access Code</div>
                        <div className="d-flex col-6">1032</div>
                    </div>
                    <div className="row">
                        <div className="d-flex col-4 justify-content-end fw-bold">One Question at a Time</div>
                        <div className="d-flex col-6">Yes</div>
                    </div>
                    <div className="row">
                        <div className="d-flex col-4 justify-content-end fw-bold">Webcam Required</div>
                        <div className="d-flex col-6">No</div>
                    </div>
                    <div className="row">
                        <div className="d-flex col-4 justify-content-end fw-bold">Lock Questions After Answering</div>
                        <div className="d-flex col-6">No</div>
                    </div>
                </div>
                

                {/* {
                        for (const [key, value] of Object.entries(quiz)) {
                            <div className="row">
                                <div className="d-flex col justify-content-end fw-bold">{key}</div>
                                <div className="d-flex col">{value}</div>
                            </div>
                        }
                    } */}
                <div className="">
                    <div className="row m-2">
                        <div className="col fw-bold">Due</div>
                        <div className="col fw-bold">For</div>
                        <div className="col fw-bold">Available from</div>
                        <div className="col fw-bold">Until</div>
                    </div>
                    <hr />
                    <div className="row m-2">
                        <div className="col">Sep 21 at 1pm</div>
                        <div className="col">Everyone</div>
                        <div className="col">Sep 21 at 11:40am</div>
                        <div className="col">Sep 21 at 1pm</div>
                    </div>
                </div>
                <hr />
                
            </div>
        </div>
    );
}