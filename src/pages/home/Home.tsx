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

export default function Home() {
  async function handleClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const scheduler = new HokieScheduler();

    //Create classes
    const CS = new VTClass(VTSubject.CS, 2114, 2025, Semester.Fall);
    CS.addCourse(await getCRN(2025, Semester.Fall, 83488));
    CS.addCourse(await getCRN(2025, Semester.Fall, 83491));
    CS.addCourse(await getCRN(2025, Semester.Fall, 83496));
    CS.addCourse(await getCRN(2025, Semester.Fall, 83489));
    CS.addCourse(await getCRN(2025, Semester.Fall, 83490));
    CS.addCourse(await getCRN(2025, Semester.Fall, 83494));
    CS.addCourse(await getCRN(2025, Semester.Fall, 83492));
    CS.addCourse(await getCRN(2025, Semester.Fall, 83493));
    CS.addCourse(await getCRN(2025, Semester.Fall, 83495));

    scheduler.addClass(CS);

    const MATH = new VTClass(VTSubject.MATH, 2534, 2025, Semester.Fall);
    MATH.addCourse(await getCRN(2025, Semester.Fall, 87469));
    MATH.addCourse(await getCRN(2025, Semester.Fall, 87470));
    MATH.addCourse(await getCRN(2025, Semester.Fall, 87471));
    MATH.addCourse(await getCRN(2025, Semester.Fall, 87472));
    MATH.addCourse(await getCRN(2025, Semester.Fall, 87473));
    MATH.addCourse(await getCRN(2025, Semester.Fall, 87474));
    MATH.addCourse(await getCRN(2025, Semester.Fall, 87475));
    MATH.addCourse(await getCRN(2025, Semester.Fall, 87476));
    scheduler.addClass(MATH);

    const morningbreak = new VTBreak("8 ams", {
      Monday: new Set([
        { start: new HourMinute(8, 0, "AM"), end: new HourMinute(11, 0, "AM") },
      ]),
      Tuesday: new Set([
        { start: new HourMinute(8, 0, "AM"), end: new HourMinute(11, 0, "AM") },
      ]),
      Wednesday: new Set([
        { start: new HourMinute(8, 0, "AM"), end: new HourMinute(11, 0, "AM") },
      ]),
      Thursday: new Set([
        { start: new HourMinute(8, 0, "AM"), end: new HourMinute(11, 0, "AM") },
      ]),
      Friday: new Set([
        { start: new HourMinute(8, 0, "AM"), end: new HourMinute(11, 0, "AM") },
      ]),
      Saturday: new Set([
        { start: new HourMinute(8, 0, "AM"), end: new HourMinute(11, 0, "AM") },
      ]),
      Sunday: new Set([
        { start: new HourMinute(8, 0, "AM"), end: new HourMinute(11, 0, "AM") },
      ]),
      Arranged: new Set([
        { start: new HourMinute(8, 0, "AM"), end: new HourMinute(11, 0, "AM") },
      ]),
    });

    const afternoonbreak = new VTBreak("No afternoons", {
      Monday: new Set([
        { start: new HourMinute(4, 10, "PM"), end: new HourMinute(6, 0, "PM") },
      ]),
      Tuesday: new Set([]),
      Wednesday: new Set([]),
      Thursday: new Set([]),
      Friday: new Set([]),
      Saturday: new Set([]),
      Sunday: new Set([]),
      Arranged: new Set([]),
    });

    const currentSchedule = new CurrentSchedule();
    currentSchedule.addCourse(morningbreak);
    currentSchedule.addCourse(afternoonbreak);
    //currentSchedule.addCourse(await getCRN(2025, Semester.Fall, 88572));

    scheduler.addCurrentSchedule(currentSchedule);

    console.log("id list");
    console.log(CS.id);
    console.log(MATH.id);

    const final = scheduler.createSchedules();
    console.log(final);
  }

  const [showAddCRNModal, setShowAddCRNModal] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<VTCourseStructure[]>(
    []
  );
  const [showAddBreakModal, setShowAddBreakModal] = useState(false);

  function addCRNClose() {
    setShowAddCRNModal(false);
  }

  function addBreakClose() {
    setShowAddBreakModal(false);
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
          <button>Add Class</button>
        </div>
        <NewClassList />
      </div>

      <div className={styles.home}>
        <div className={styles.sidebyside}>
          <h2>Generated Schedules</h2>
          <button>Generate Schedule</button>
        </div>
      </div>
      {/* TODO Convert below to a list that maps through generated schedules */}
      <div className={styles.home}>
        <div className={styles.sidebyside}>
          <ScheduleOption />
          <ScheduleOption />
          <ScheduleOption />
          <ScheduleOption />
        </div>
      </div>

      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
