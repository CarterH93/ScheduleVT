import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { getClass } from "../Backend/VTTimetableAPI";
import { currentTerm } from "../Backend/HokieScheduler";
import { VTClass, VTCourse } from "../Backend/VTClasses";
import { VTCourseStructure, VTSubject } from "../Backend/Types";
import { set } from "immutable";
import { setCommentRange } from "typescript";

export const useFetchClass = (
  subject: VTSubject,
  courseNumber: number,
  setClassList: Dispatch<SetStateAction<VTClass[]>>
) => {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setDone(false);

      try {
        const ClassResponse = await getClass(
          currentTerm.year,
          currentTerm.semester,
          subject,
          courseNumber
        );
        if (ClassResponse.courses.length === 0) {
          throw new Error("Class not found");
        }

        setClassList((prevClassList) => {
          const updatedClassList = [...prevClassList, ClassResponse];
          return updatedClassList;
        });

        setDone(false);
        setError(null);
        setDone(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setDone(false);
          setError("Class Not Found");
        }
      }
    }

    if (courseNumber !== 0) {
      fetchData();
    }

    return () => {
      controller.abort();
    };
  }, [subject, courseNumber, setClassList]);

  return { done, error };
};
