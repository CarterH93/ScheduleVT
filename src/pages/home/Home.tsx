import React from "react";
import { HokieScheduler } from "../../Backend/HokieScheduler";
import {
  CurrentSchedule,
  VTBreak,
  VTClass,
  VTCourse,
} from "../../Backend/VTClasses";
import { HourMinute, Semester, VTSubject } from "../../Backend/Types";
import { getCRN } from "../../Backend/VTTimetableAPI";

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

    console.log("id list")
    console.log(CS.id)
    console.log(MATH.id)


    const final = scheduler.createSchedules()
    console.log(final);
  }

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
