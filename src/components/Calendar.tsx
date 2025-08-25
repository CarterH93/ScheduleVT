import styles from "./Calendar.module.css";
import { VTCourseStructure, Day } from "../Backend/Types";
import { DaySchedule, ScheduleView } from "react-schedule-view";

function convertVTCourseStructureToDaySchedule(
  courses: VTCourseStructure[]
): DaySchedule[] {
  const daySchedules: DaySchedule[] = [
    { name: "Monday", events: [] },
    { name: "Tuesday", events: [] },
    { name: "Wednesday", events: [] },
    { name: "Thursday", events: [] },
    { name: "Friday", events: [] },
  ];

  courses.forEach((course) => {
    const color = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
    for (const day of Object.keys(course.schedule)) {
      let matchingDayArray = daySchedules.filter((name) => name.name === day);
      if (matchingDayArray.length > 0) {
        const matchingDay = matchingDayArray[0];

        for (const event of Array.from(course.schedule[day as Day])) {
          matchingDay.events.push({
            title: course.name,
            startTime: event.start.time,
            endTime: event.end.time,
            color: color, // You can customize the color
          });
        }
        daySchedules[daySchedules.indexOf(matchingDayArray[0])] = matchingDay;
      }
    }
  });

  return daySchedules;
}

export default function Calendar({
  courses,
}: {
  courses: VTCourseStructure[];
}) {
  return (
    <div className={styles.calendar}>
      <ScheduleView
        theme="apple"
        daySchedules={convertVTCourseStructureToDaySchedule(courses)}
        viewStartTime={8}
        viewEndTime={22}
      />
    </div>
  );
}
