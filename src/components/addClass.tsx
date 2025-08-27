import { VTCourseStructure, VTSubject } from "../Backend/Types";
import { VTClass, VTCourse } from "../Backend/VTClasses";
import { useFetchClass } from "../hooks/useFetchClass";
import styles from "./AddClass.module.css";
import Select from "react-select";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import { currentTerm } from "../Backend/HokieScheduler";

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
  const [tempCourseList, setTempCourseList] = useState<VTCourse[]>([]);
  const { done, error } = useFetchClass(
    finalSubject,
    finalCourseNumber,
    setTempCourseList
  );

  function handleAddClassClick() {
    setFinalCourseNumber(parseInt(courseNumber));
    setFinalSubject(subject ?? VTSubject.AAD);
  }

  function handleAddSelectionClick() {
    const selectedCourses = tempCourseList.filter((course) => course.selected);

    const newClass = new VTClass(
      finalSubject,
      finalCourseNumber,
      currentTerm.year,
      currentTerm.semester
    );
    for (const course of selectedCourses) {
      newClass.addCourse(course);
    }

    setClassList((prevClasses) => {
      return [...prevClasses, newClass];
    });
    setShowAddClassModal(false);
  }

  //TODO Add ability to select which CRNs to add to final selection

  function updateCheckStatus(index: number) {
    setTempCourseList(
      tempCourseList.map((vtCourse, currentIndex) => {
        if (currentIndex === index) {
          vtCourse.selected = !vtCourse.selected;
          return vtCourse;
        } else {
          return vtCourse;
        }
      })
    );
  }

  const selectAll = () => {
    setTempCourseList(
      tempCourseList.map((vtCourse) => {
        vtCourse.selected = true;
        return vtCourse;
      })
    );
  };
  const unSelectAll = () => {
    setTempCourseList(
      tempCourseList.map((vtCourse) => {
        vtCourse.selected = false;
        return vtCourse;
      })
    );
  };

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

      {tempCourseList.length > 0 && (
        <>
          <p>
            <button onClick={selectAll}>Select All</button>
            <button onClick={unSelectAll}>Unselect All</button>
          </p>

          {tempCourseList.map((vtCourse, index) => (
            <div>
              <Checkbox
                vtCourse={vtCourse}
                checkHandler={() => updateCheckStatus(index)}
                index={index}
              />
            </div>
          ))}
        </>
      )}

      {!done && (
        <button className="btn" onClick={handleAddClassClick}>
          {" "}
          Find Class
        </button>
      )}
      {done && (
        <button className="btn" onClick={handleAddSelectionClick}>
          {" "}
          Add Selections
        </button>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
}
