import { VTClass } from "../Backend/VTClasses";
import styles from "./NewClassList.module.css";

import React from "react";

export default function NewClassList({ classList }: { classList: VTClass[] }) {
  return (
    <div>
      {classList.length > 0 &&
        classList.map((vtClass, index) => (
          <div key={index} className={styles.classCard}>
            <h3>
              {vtClass.subject} {vtClass.courseNumber}
            </h3>
            {vtClass.courses.map((course, courseIndex) => (
              <div key={courseIndex} className={styles.courseCard}>
                <p>CRN: {course.id}</p>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
