import { VTCourseStructure } from "../Backend/Types";
import { stringSchedule, VTCourse } from "../Backend/VTClasses";
import styles from "./ScheduleOption.module.css";
import { useFirestore } from "../hooks/useFirestore";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDocument } from "../hooks/useDocument";

import React from "react";

export default function ScheduleOption({
  schedule,
  setShowCalendarView,
  setCalendarViewToShow,
}: {
  schedule: VTCourseStructure[];
  setShowCalendarView: React.Dispatch<React.SetStateAction<boolean>>;
  setCalendarViewToShow: React.Dispatch<
    React.SetStateAction<VTCourseStructure[]>
  >;
}) {
  const { updateDocument } = useFirestore("users");
  const { user } = useAuthContext();
  const { document } = useDocument("users", String(user?.uid));

  function toStringFavorites(courses: VTCourseStructure[]) {
    let final = "";
    courses.forEach((course) => {
      final += `Name: ${course.name}    CRN: ${
        course.id
      } \n Schedule: ${stringSchedule(course)}`;
      final += "\n\n";
    });

    return final;
  }

  function onClickHandler() {
    if (document) {
      if (!document.favoriteSchedules) {
        document.favoriteSchedules = [];
      }
      updateDocument(user?.uid as string, {
        favoriteSchedules: [
          ...document.favoriteSchedules,
          toStringFavorites(schedule),
        ],
      });
      alert("Schedule Added to Favorites");
    }
  }

  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.favorite}>
        <button onClick={onClickHandler}>Favorite ❤️</button>
      </div>
      {schedule.map((course: VTCourseStructure, index: number) => (
        <div key={index} className={styles.courseItem}>
          <p className={styles.courseName}>{course.name}</p>
          <p className={styles.courseId}>CRN: {course.id}</p>
          <p className={styles.courseId}>Schedule: {stringSchedule(course)}</p>
        </div>
      ))}
      <button
        onClick={() => {
          setShowCalendarView(true);
          setCalendarViewToShow(schedule);
        }}
      >
        Show Calendar View
      </button>
    </div>
  );
}
