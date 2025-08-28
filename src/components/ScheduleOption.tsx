import { VTCourseStructure } from "../Backend/Types";
import { stringSchedule, VTCourse } from "../Backend/VTClasses";
import styles from "./ScheduleOption.module.css";

import React from "react";

//TODO Implement showing the popup calendar view

export default function ScheduleOption({
  schedule,
}: {
  schedule: VTCourseStructure[];
}) {
  return (
    <div className={styles.scheduleContainer}>
      {schedule.map((course: VTCourseStructure, index: number) => (
        <div key={index} className={styles.courseItem}>
          <p className={styles.courseName}>{course.name}</p>
          <p className={styles.courseId}>CRN: {course.id}</p>
          <p className={styles.courseId}>Schedule: {stringSchedule(course)}</p>
        </div>
      ))}
      <button >Show Calendar View</button>
    </div>
  );
}
