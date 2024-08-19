import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const ENROLL_API = `${REMOTE_SERVER}/api/enroll`;


export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API, {withCredentials: true});
  return data;
};


export const findCourseById = async (id: string) => {
    const response = await axios.get(`${COURSES_API}/${id}`);
    return response.data;
};

export const createCourse = async (course: any) => {
    const response = await axios.post(COURSES_API, course);
    return response.data;
};

export const deleteCourse = async (id: string) => {
    const response = await axios.delete(`${COURSES_API}/${id}`);
    return response.data;
};


export const updateCourse = async (course: any) => {
    const response = await axios.put(`${COURSES_API}/${course._id}`, course);
    return response.data;
};

export const loadAllCourses = async () =>{
   const { data } = await axios.get(`${COURSES_API}/all`);
     return data;
 };

 // New function to enroll in a course
 export const enrollInCourse = async (courseId: string) => {
   const response = await axios.post(`${ENROLL_API}`, { courseId }, { withCredentials: true });
   return response.data;
 };