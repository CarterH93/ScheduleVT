import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { getCRN } from "../Backend/VTTimetableAPI";
import { currentTerm, HokieScheduler } from "../Backend/HokieScheduler";
import { CurrentSchedule, VTClass, VTCourse } from "../Backend/VTClasses";
import { VTCourseStructure } from "../Backend/Types";
import { set } from "immutable";
import { setCommentRange } from "typescript";

export const useGenerateSchedule = (
  setGeneratedSchedules: Dispatch<SetStateAction<VTCourseStructure[][]>>,
  classList: VTClass[],
  currentSchedule: VTCourseStructure[],
  generate: boolean
) => {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setDone(false);

      try {
        const hokieScheduler = new HokieScheduler();
        const convertedCurrentSchedule = new CurrentSchedule();
        convertedCurrentSchedule.setCourses(currentSchedule);
        hokieScheduler.addCurrentSchedule(convertedCurrentSchedule);

        for (const vtClass of classList) {
          hokieScheduler.addClass(vtClass);
        }

        const schedulesResponse = await hokieScheduler.createSchedules();
        
        setDone(false);

        setGeneratedSchedules(schedulesResponse);
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

    if (generate) {
      fetchData();
    }

    return () => {
      controller.abort();
    };
  }, [generate, classList, currentSchedule, setGeneratedSchedules]);

  return { done, error };
};
