import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { getCRN } from "../Backend/VTTimetableAPI";
import { currentTerm } from "../Backend/HokieScheduler";
import { VTCourse } from "../Backend/VTClasses";
import { VTCourseStructure } from "../Backend/Types";
import { set } from "immutable";
import { setCommentRange } from "typescript";

export const useFetchCRN = (
  setCurrentSchedule: Dispatch<SetStateAction<VTCourseStructure[]>>,
  crn: number
) => {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setDone(false);

      try {
        const CRNResponse = await getCRN(
          currentTerm.year,
          currentTerm.semester,
          crn
        );

        setDone(false);
        setCurrentSchedule((prevSchedule) => {
          const updatedSchedule = [...prevSchedule, CRNResponse];
          return updatedSchedule;
        });
        setError(null);
        setDone(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setDone(false);
          setError("Invalid CRN");
        }
      }
      
    }

    if (crn !== 0) {
      fetchData();
    }

    return () => {
      controller.abort();
    };
  }, [crn, setCurrentSchedule]);

  return { done, error };
};
