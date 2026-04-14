import { useContext, useState } from "react";
import CourseCard from "./CourseCard";
import { SessionContext } from "./SessionContext";

export default function Home() {
  const [toastMessage, setToastMessage] = useState("");
  const { courses, loading } = useContext(SessionContext);

  return (
    <div className="max-w-7xl pt-6 mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl text-center font-bold text-gray-900 dark:text-white mb-8">
        All Courses
      </h1>
      {loading ? (
        <div className="text-center text-white">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              setToastMessage={setToastMessage}
            />
          ))}
        </div>
      )}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
