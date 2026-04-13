import { useState } from "react";
import CourseCard from "./CourseCard";

const response = await fetch("http://localhost:4000");
const courses = await response.json();

export default function App() {
  const [toastMessage, setToastMessage] = useState("");
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <div className="max-w-7xl pt-6 mx-auto px-4 sm:px-6 lg:px-8 ">
        <h1 className="text-4xl  text-center font-bold text-gray-900 dark:text-white mb-8">
          All Courses
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              setToastMessage={setToastMessage}
            />
          ))}
        </div>
      </div>
      <p className="absolute top-0 text-white">{toastMessage}</p>
    </div>
  );
}
