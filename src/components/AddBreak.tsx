import { set } from "immutable";
import { VTCourseStructure, HourMinute } from "../Backend/Types";
import { VTBreak } from "../Backend/VTClasses";
import styles from "./AddBreak.module.css";

import React, { Dispatch, SetStateAction, useState } from "react";

export default function AddBreak({
  setShowAddCRNModal,
  setCurrentSchedule,
}: {
  setShowAddCRNModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentSchedule: Dispatch<SetStateAction<VTCourseStructure[]>>;
}) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newBreak = new VTBreak(name, {
      Monday: new Set([
        {
          start: new HourMinute(
            parseInt(mondayStart.split(":")[0]),
            parseInt(mondayStart.split(":")[1]),
            "AM"
          ),
          end: new HourMinute(
            parseInt(mondayEnd.split(":")[0]),
            parseInt(mondayEnd.split(":")[1]),
            "AM"
          ),
        },
      ]),
      Tuesday: new Set([
        {
          start: new HourMinute(
            parseInt(tuesdayStart.split(":")[0]),
            parseInt(tuesdayStart.split(":")[1]),
            "AM"
          ),
          end: new HourMinute(
            parseInt(tuesdayEnd.split(":")[0]),
            parseInt(tuesdayEnd.split(":")[1]),
            "AM"
          ),
        },
      ]),
      Wednesday: new Set([
        {
          start: new HourMinute(
            parseInt(wednesdayStart.split(":")[0]),
            parseInt(wednesdayStart.split(":")[1]),
            "AM"
          ),
          end: new HourMinute(
            parseInt(wednesdayEnd.split(":")[0]),
            parseInt(wednesdayEnd.split(":")[1]),
            "AM"
          ),
        },
      ]),
      Thursday: new Set([
        {
          start: new HourMinute(
            parseInt(thursdayStart.split(":")[0]),
            parseInt(thursdayStart.split(":")[1]),
            "AM"
          ),
          end: new HourMinute(
            parseInt(thursdayEnd.split(":")[0]),
            parseInt(thursdayEnd.split(":")[1]),
            "AM"
          ),
        },
      ]),
      Friday: new Set([
        {
          start: new HourMinute(
            parseInt(fridayStart.split(":")[0]),
            parseInt(fridayStart.split(":")[1]),
            "AM"
          ),
          end: new HourMinute(
            parseInt(fridayEnd.split(":")[0]),
            parseInt(fridayEnd.split(":")[1]),
            "AM"
          ),
        },
      ]),
      Saturday: new Set([]),
      Sunday: new Set([]),
      Arranged: new Set([]),
    });

    setCurrentSchedule((prevSchedule) => {
      const updatedSchedule = [...prevSchedule, newBreak];
      return updatedSchedule;
    });

    setShowAddCRNModal(false);
  }

  const [name, setName] = useState("");
  const [mondayStart, setMondayStart] = useState("");
  const [mondayEnd, setMondayEnd] = useState("");
  const [tuesdayStart, setTuesdayStart] = useState("");
  const [tuesdayEnd, setTuesdayEnd] = useState("");
  const [wednesdayStart, setWednesdayStart] = useState("");
  const [wednesdayEnd, setWednesdayEnd] = useState("");
  const [thursdayStart, setThursdayStart] = useState("");
  const [thursdayEnd, setThursdayEnd] = useState("");
  const [fridayStart, setFridayStart] = useState("");
  const [fridayEnd, setFridayEnd] = useState("");

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Break</h2>
      <label className={styles.name}>
        <span>Name:</span>
        <input
          type="text"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </label>
      <h3>Select break times:</h3>
      <div className={styles.sidebyside}>
        <label>
          <span>Monday:</span>
          <div className={styles.sidebyside}>
            <p>start:</p>
            <input
              aria-label="Time"
              type="time"
              onChange={(e) => setMondayStart(e.target.value)}
              value={mondayStart}
            />
          </div>
          <div className={styles.sidebyside}>
            <p>end:</p>
            <input
              aria-label="Time"
              type="time"
              onChange={(e) => setMondayEnd(e.target.value)}
              value={mondayEnd}
            />
          </div>
        </label>
        <label>
          <span>Tuesday:</span>
          <div className={styles.sidebyside}>
            <p>start:</p>
            <input
              aria-label="Time"
              type="time"
              onChange={(e) => setTuesdayStart(e.target.value)}
              value={tuesdayStart}
            />
          </div>
          <div className={styles.sidebyside}>
            <p>end:</p>
            <input
              aria-label="Time"
              type="time"
              onChange={(e) => setTuesdayEnd(e.target.value)}
              value={tuesdayEnd}
            />
          </div>
        </label>
        <label>
          <span>Wednesday:</span>
          <div className={styles.sidebyside}>
            <p>start:</p>
            <input
              aria-label="Time"
              type="time"
              onChange={(e) => setWednesdayStart(e.target.value)}
              value={wednesdayStart}
            />
          </div>
          <div className={styles.sidebyside}>
            <p>end:</p>
            <input
              aria-label="Time"
              type="time"
              onChange={(e) => setWednesdayEnd(e.target.value)}
              value={wednesdayEnd}
            />
          </div>
        </label>
        <label>
          <span>Thursday:</span>
          <div className={styles.sidebyside}>
            <p>start:</p>
            <input
              aria-label="Time"
              type="time"
              onChange={(e) => setThursdayStart(e.target.value)}
              value={thursdayStart}
            />
          </div>
          <div className={styles.sidebyside}>
            <p>end:</p>
            <input
              aria-label="Time"
              type="time"
              onChange={(e) => setThursdayEnd(e.target.value)}
              value={thursdayEnd}
            />
          </div>
        </label>
        <label>
          <span>Friday:</span>
          <div className={styles.sidebyside}>
            <p>start:</p>
            <input
              aria-label="Time"
              type="time"
              onChange={(e) => setFridayStart(e.target.value)}
              value={fridayStart}
            />
          </div>
          <div className={styles.sidebyside}>
            <p>end:</p>
            <input
              aria-label="Time"
              type="time"
              onChange={(e) => setFridayEnd(e.target.value)}
              value={fridayEnd}
            />
          </div>
        </label>
      </div>
      <button className="btn">Add New Break</button>
    </form>
  );
}
