import { setModules, addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from 'react-icons/bs';
import * as client from "./client";
import "./index.css"

export default function Modules() {
    const { cid } = useParams();
    const [moduleName, setModuleName] = useState("");
    const { modules } = useSelector((state: any) => state.modulesReducer);
    const dispatch = useDispatch();

    const createModule = async (module: any) => {
      const newModule = await client.createModule(cid as string, module);
      console.log("New module received with ID:", newModule._id);
      dispatch(addModule(newModule));
    };
  
    const fetchModules = async () => {
      const modules = await client.findModulesForCourse(cid as string);
      dispatch(setModules(modules));
    };

    const removeModule = async (moduleId: string) => {
      await client.deleteModule(moduleId);
      dispatch(deleteModule(moduleId));
    };

    const saveModule = async (module: any) => {
      const status = await client.updateModule(module);
      dispatch(updateModule(module));
    };
  
    
    useEffect(() => {
      fetchModules();
    }, []);

    
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const faculty = currentUser.role === "FACULTY";
  
    return (
      <div>
        {
          faculty && 
          <div>
              <ModulesControls
                setModuleName={setModuleName}
                moduleName={moduleName}
                addModule={() => {
                  createModule({ name: moduleName });
                  setModuleName("");
                }}
              />
              <br /><br /><br /><br />
          </div>
        }
        
        
        <ul id="wd-modules" className="list-group rounded-0">
          {modules
            .map((module: any) => (
            <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />
                
                {!module.editing && module.name}
                { module.editing && (
                  <input className="form-control w-50 d-inline-block"
                      onChange={(e) => saveModule({ ...module, name: e.target.value }) }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveModule({ ...module, editing: false });
                        }
                      }}
                      value={module.name}
                  />
                )}

                  {
                    faculty && 
                    <ModuleControlButtons
                      moduleId={module._id}
                      deleteModule={(moduleId) => { removeModule(moduleId); }}
                      editModule={(moduleId) => dispatch(editModule(moduleId))}
                    />
                }
                

              </div>
              {module.lessons && (
                <ul className="wd-lessons list-group rounded-0">
                  {module.lessons.map((lesson: any) => (
                    <li className="wd-lesson list-group-item p-3 ps-1">
                      <BsGripVertical className="me-2 fs-3" />
                      {lesson.name}
                      <LessonControlButtons />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
  );}
  