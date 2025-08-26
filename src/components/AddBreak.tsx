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

    console.log(mondayEnd);

    function parseHourMinute(timeStr: string): HourMinute {
      const [hourStr, minuteStr] = timeStr.split(":");
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);
      let period = "AM";
      if (hour === 0) {
        hour = 12;
        period = "AM";
      } else if (hour === 12) {
        period = "PM";
      } else if (hour > 12) {
        hour = hour - 12;
        period = "PM";
      }
      return new HourMinute(hour, minute, period);
    }

    const newBreak = new VTBreak(name, {
      Monday:
        mondayStart && mondayEnd
          ? new Set([
              {
                start: parseHourMinute(mondayStart),
                end: parseHourMinute(mondayEnd),
              },
            ])
          : new Set([]),
      Tuesday:
        tuesdayStart && tuesdayEnd
          ? new Set([
              {
                start: parseHourMinute(tuesdayStart),
                end: parseHourMinute(tuesdayEnd),
              },
            ])
          : new Set([]),
      Wednesday:
        wednesdayStart && wednesdayEnd
          ? new Set([
              {
                start: parseHourMinute(wednesdayStart),
                end: parseHourMinute(wednesdayEnd),
              },
            ])
          : new Set([]),
      Thursday:
        thursdayStart && thursdayEnd
          ? new Set([
              {
                start: parseHourMinute(thursdayStart),
                end: parseHourMinute(thursdayEnd),
              },
            ])
          : new Set([]),
      Friday:
        fridayStart && fridayEnd
          ? new Set([
              {
                start: parseHourMinute(fridayStart),
                end: parseHourMinute(fridayEnd),
              },
            ])
          : new Set([]),
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
