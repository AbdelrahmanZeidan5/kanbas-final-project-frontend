import { IoMdSettings } from "react-icons/io";
import { LuFileOutput, LuFileInput } from "react-icons/lu";

export default function GradesControls() {
  return (
    <div id="wd-grades-controls" className="text-nowrap">
      
        <button id="wd-settings-btn" className="btn btn-lg  me-1 btn-secondary float-end">
            <IoMdSettings className="fs-3"  />
        </button>

        <button id="wd-export-btn" className="btn btn-lg btn-secondary me-1 float-end dropdown-toggle">
          <LuFileOutput className="fs-4 me-2"/>
          Export
        </button>

        <button id="wd-import-btn" className="btn btn-lg btn-secondary me-1 float-end">
            <LuFileInput className="fs-4 me-2"/>
            Import
        </button>
    </div>
  );
}
