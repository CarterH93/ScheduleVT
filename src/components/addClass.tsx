import { VTCourseStructure, VTSubject } from "../Backend/Types";
import { VTClass } from "../Backend/VTClasses";
import { useFetchClass } from "../hooks/useFetchClass";
import styles from "./AddClass.module.css";
import Select from "react-select";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

const subjectOptions = Object.values(VTSubject).map((subject) => ({
  value: subject,
  label: subject,
}));

export default function AddClass({
  setShowAddClassModal,
  setClassList,
}: {
  setShowAddClassModal: React.Dispatch<React.SetStateAction<boolean>>;
  setClassList: Dispatch<SetStateAction<VTClass[]>>;
}) {
  const [subject, setSubject] = useState<VTSubject | null>(null);
  const [finalSubject, setFinalSubject] = useState<VTSubject>(VTSubject.AAD);
  const [courseNumber, setCourseNumber] = useState<string>("");
  const [finalCourseNumber, setFinalCourseNumber] = useState<number>(0);
  const [tempClassList, setTempClassList] = useState<VTClass[]>([]);
  const { done, error } = useFetchClass(
    finalSubject,
    finalCourseNumber,
    setTempClassList
  );

  function handleAddClassClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setFinalCourseNumber(parseInt(courseNumber));
    setFinalSubject(subject ?? VTSubject.AAD);
  }

  //TODO Add ability to select which CRNs to add to final selection

  return (
    <div>
      <h2>Add New Class</h2>
      <label className={styles.limitWidth}>
        <span>Course Number</span>
        <input
          type="number"
          required
          onChange={(e) => setCourseNumber(e.target.value)}
          value={courseNumber}
        />
      </label>
      <label className={styles.limitWidth}>
        <span>Subject</span>
        <Select
          options={subjectOptions}
          onChange={(option) => setSubject(option?.value ?? null)}
        />
      </label>
      {tempClassList.length > 0 &&
        tempClassList.map((vtClass, index) => (
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
      {!done && (
        <button className="btn" onClick={handleAddClassClick}>
          {" "}
          Find Class
        </button>
      )}
      {done && <button className="btn"> Add Selections</button>}

      {error && <div className="error">{error}</div>}
    </div>
  );
}
