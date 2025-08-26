import { Dispatch, SetStateAction } from "react";
import { HourMinute, VTCourseStructure } from "../Backend/Types";
import { VTBreak, VTClass } from "../Backend/VTClasses";
import styles from "./AddNewCRN.module.css";

export default function AddNewCRN({setShowAddCRNModal, setCurrentSchedule}: {setShowAddCRNModal: React.Dispatch<React.SetStateAction<boolean>>, setCurrentSchedule: Dispatch<SetStateAction<VTCourseStructure[]>>}) {

    function handleAddCRNClick() {
    setShowAddCRNModal(false);
    setCurrentSchedule([
      new VTBreak("No afternoons", {
        Monday: new Set([
          {
            start: new HourMinute(4, 10, "PM"),
            end: new HourMinute(6, 0, "PM"),
          },
        ]),
        Tuesday: new Set([]),
        Wednesday: new Set([]),
        Thursday: new Set([]),
        Friday: new Set([]),
        Saturday: new Set([]),
        Sunday: new Set([]),
        Arranged: new Set([]),
      }),
      new VTBreak("8 ams", {
        Monday: new Set([
          {
            start: new HourMinute(8, 0, "AM"),
            end: new HourMinute(11, 0, "AM"),
          },
        ]),
        Tuesday: new Set([
          {
            start: new HourMinute(8, 0, "AM"),
            end: new HourMinute(11, 0, "AM"),
          },
        ]),
        Wednesday: new Set([
          {
            start: new HourMinute(8, 0, "AM"),
            end: new HourMinute(11, 0, "AM"),
          },
        ]),
        Thursday: new Set([
          {
            start: new HourMinute(8, 0, "AM"),
            end: new HourMinute(11, 0, "AM"),
          },
        ]),
        Friday: new Set([
          {
            start: new HourMinute(8, 0, "AM"),
            end: new HourMinute(11, 0, "AM"),
          },
        ]),
        Saturday: new Set([
          {
            start: new HourMinute(8, 0, "AM"),
            end: new HourMinute(11, 0, "AM"),
          },
        ]),
        Sunday: new Set([
          {
            start: new HourMinute(8, 0, "AM"),
            end: new HourMinute(11, 0, "AM"),
          },
        ]),
        Arranged: new Set([
          {
            start: new HourMinute(8, 0, "AM"),
            end: new HourMinute(11, 0, "AM"),
          },
        ]),
      }),
    ]);
  }
  return (
    <>
      <h2>Add New CRN</h2>
      <button onClick={handleAddCRNClick}>Add CRN</button>
    </>
  );
}
