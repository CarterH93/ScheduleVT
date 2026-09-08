import React, { useState } from "react";
import { currentTerm, HokieScheduler } from "../../Backend/HokieScheduler";
import {
  CurrentSchedule,
  VTBreak,
  VTClass,
  VTCourse,
} from "../../Backend/VTClasses";
import {
  HourMinute,
  Semester,
  semesterToString,
  VTCourseStructure,
  VTSubject,
} from "../../Backend/Types";
import { getCRN } from "../../Backend/VTTimetableAPI";
import Calendar from "../../components/Calendar";
import NewClassList from "../../components/NewClassList";
import ScheduleOption from "../../components/ScheduleOption";
import styles from "./Home.module.css";
import Modal from "../../components/Modal";
import AddNewCRN from "../../components/AddNewCRN";
import AddBreak from "../../components/AddBreak";
import AddClass from "../../components/AddClass";
import { useGenerateSchedule } from "../../hooks/useGenerateSchedules";

export default function Home() {
  const [showAddCRNModal, setShowAddCRNModal] = useState(false);

  const [showAddBreakModal, setShowAddBreakModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  const [classList, setClassList] = useState<VTClass[]>([]);
  const [currentSchedule, setCurrentSchedule] = useState<VTCourseStructure[]>(
    []
  );

  const [generatedSchedules, setGeneratedSchedules] = useState<
    VTCourseStructure[][]
  >([[]]);

  const [generate, setGenerate] = useState(false);

  const [showCalendarView, setShowCalendarView] = useState(false);
  const [calendarViewToShow, setCalendarViewToShow] = useState<
    VTCourseStructure[]
  >([]);

  const { done, error } = useGenerateSchedule(
    setGeneratedSchedules,
    classList,
    currentSchedule,
    generate
  );

  function addCRNClose() {
    setShowAddCRNModal(false);
  }

  function addBreakClose() {
    setShowAddBreakModal(false);
  }

  function addClassClose() {
    setShowAddClassModal(false);
  }

  function calendarViewClose() {
    setShowCalendarView(false);
  }

  return (
    <div className={styles.page}>
      {showAddCRNModal && (
        <Modal handleClose={addCRNClose}>
          <AddNewCRN
            setCurrentSchedule={setCurrentSchedule}
            setShowAddCRNModal={setShowAddCRNModal}
          />
        </Modal>
      )}
      {showAddBreakModal && (
        <Modal handleClose={addBreakClose}>
          <AddBreak
            setCurrentSchedule={setCurrentSchedule}
            setShowAddCRNModal={setShowAddBreakModal}
          />
        </Modal>
      )}
      {showAddClassModal && (
        <Modal handleClose={addClassClose}>
          <AddClass
            setClassList={setClassList}
            setShowAddClassModal={setShowAddClassModal}
          />
        </Modal>
      )}
      {showCalendarView && (
        <Modal handleClose={calendarViewClose}>
          <Calendar courses={calendarViewToShow} />
        </Modal>
      )}
      <p>
        Term: {semesterToString(currentTerm.semester)} {currentTerm.year}
      </p>
      <p>Refresh page to reset data</p>
      <h1>Create New Schedule</h1>
      <div className={styles.home}>
        <div className={styles.sidebyside}>
          <h2>Current Schedule</h2>
          <button
            onClick={() => {
              setShowAddCRNModal(true);
            }}
          >
            Add CRN
          </button>
          <button
            onClick={() => {
              setShowAddBreakModal(true);
            }}
          >
            Add Break
          </button>
        </div>
        <Calendar courses={currentSchedule} />
      </div>

      <div className={styles.home}>
        <div className={styles.sidebyside}>
          <h2>Classes to Add</h2>
          <button
            onClick={() => {
              setShowAddClassModal(true);
            }}
          >
            Add Class
          </button>
        </div>
        <NewClassList classList={classList} />
      </div>

      <div className={styles.home}>
        <div className={styles.sidebyside}>
          <h2>Generated Schedules</h2>
          <button
            onClick={() => {
              setGenerate(true);
            }}
          >
            Generate Schedule
          </button>
        </div>
      </div>
      <div>
        {done && generatedSchedules.length > 0 && (
          <div className={styles.home}>
            {generatedSchedules.length >= 50 && (
              <p>
                Showing only 50 combinations. Try changing your settings to
                refine your choices
              </p>
            )}

          <div className={styles.generatedSchedules}>
            {generatedSchedules.map((schedule, index) => (
              <ScheduleOption
                key={index}
                schedule={schedule}
                setCalendarViewToShow={setCalendarViewToShow}
                setShowCalendarView={setShowCalendarView}
              />
            ))}
          </div>
          </div>
        )}
        {done && generatedSchedules.length === 0 && (
          <p>No possible schedules found. Try changing your settings</p>
        )}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
