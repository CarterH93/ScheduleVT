import {
  CourseType,
  ScheduleType,
  Semester,
  VTSubject,
  Day,
  ClassTime,
  HourMinute,
} from "./Types";
import { VTClass, VTCourse } from "./VTClasses";
import { getFunctions, httpsCallable } from "firebase/functions";

function convertToProperDay(day: string): Day {
  switch (day) {
    case "M":
      return Day.Monday;
    case "T":
      return Day.Tuesday;
    case "W":
      return Day.Wednesday;
    case "R":
      return Day.Thursday;
    case "F":
      return Day.Friday;
    case "S":
      return Day.Saturday;
    case "U":
      return Day.Sunday;
    default:
      return Day.Arranged;
  }
}

async function checkIfOpenSlots(
  year: number,
  semester: Semester,
  crn: number
): Promise<boolean> {
  const results = await searchTimetable(
    year,
    semester,
    "0",
    "AR%",
    "%",
    "%",
    "",
    String(crn),
    "on",
    "%"
  );

  return results.length > 0;
}

async function getCRN(
  year: number,
  semester: Semester,
  crn: number
): Promise<VTCourse> {
  const crnSearch = await searchTimetable(
    year,
    semester,
    "0",
    "AR%",
    "%",
    "%",
    "",
    String(crn),
    "",
    "%"
  );
  return crnSearch[0];
}

async function getClass(
  year: number,
  semester: Semester,
  subject: VTSubject,
  courseNumber: number
): Promise<VTClass> {
  const classSearch = await searchTimetable(
    year,
    semester,
    "0",
    "AR%",
    subject,
    "%",
    String(courseNumber),
    "",
    "",
    "%"
  );

  const newClass = new VTClass(subject, courseNumber, year, semester);

  for (const course of classSearch) {
    newClass.addCourse(course);
  }

  return newClass;
}

async function searchTimetable(
  year: number,
  semester: Semester,
  campus: string,
  pathway: string,
  subject: string,
  sectionType: string,
  code: string,
  crn: string,
  status: string,
  modality: string
): Promise<VTCourse[]> {
  // Calculate term_year
  const termYear =
    (semester === Semester.Winter ? String(Number(year) - 1) : year) + semester;

  // Prepare request data
  const requestData = {
    CAMPUS: campus,
    TERMYEAR: termYear,
    CORE_CODE: pathway,
    subj_code: subject,
    SCHDTYPE: sectionType,
    CRSE_NUMBER: code,
    crn: crn,
    open_only: status,
    sess_code: modality,
  };

  // Make request
  const response = await makeRequest("POST", requestData);
  if (response === "") {
    return []; // Return empty array if no results found
  }

  console.log(response);

  //parse html
  return parseHtmlCourses(response, year, semester);
}

const functions = getFunctions();
const VTTimetableRequest = httpsCallable(functions, "VTTimetableRequest");

async function makeRequest(
  requestType: "POST" | "GET",
  requestData?: Record<string, string>
): Promise<string> {
  const result = await VTTimetableRequest({
    requestType,
    requestData,
  });

  if (typeof result.data === "string") {
    return result.data;
  } else {
    throw new Error("result from VTTimetableRequest is not in expected format");
  }
}

export function parseHtmlCourses(
  html: string,
  year: number,
  semester: Semester
): VTCourse[] {
  if (!html) return [];

  // Parse HTML string into a DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const tables = doc.querySelectorAll("table");
  if (tables.length < 5) return [];

  const table = tables[4];
  const rows = Array.from(table.querySelectorAll("tr"));
  const courseList: VTCourse[] = [];

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td");

    if (cells[0].textContent && cells[0].textContent.length > 1) {
      const timeTableData = Array.from(cells).map(
        (cell) => cell.textContent?.trim() || ""
      );
      const nextRow = rows[i + 1];
      const extraClassData = nextRow
        ? Array.from(nextRow.querySelectorAll("td")).map(
            (cell) => cell.textContent?.trim() || ""
          )
        : null;
      console.log(timeTableData, extraClassData);

      //Parse through timeTableData and extraClassData

      const crn = Number(timeTableData[0]);

      const [subjectStr, courseNumberStr] = timeTableData[1].split("-");
      const subject = subjectStr as VTSubject;
      const courseNumber = Number(courseNumberStr);

      const name = timeTableData[2];

      let type: CourseType;

      if (timeTableData[3].includes("ONLINE")) {
        type = CourseType.Online;
      }

      switch (timeTableData[3]) {
        case "L":
          type = CourseType.Lecture;
          break;
        case "B":
          type = CourseType.Lab;
          break;
        case "Independent Study":
          type = CourseType.IndependentStudy;
          break;
        case "Recitation":
          type = CourseType.Recitation;
          break;
        case "Research":
          type = CourseType.Research;
          break;
        default:
          type = CourseType.Other; // Default to other if unknown
      }

      //Extract schedule

      const mainDays = timeTableData[8].split(" ");

      let schedule: ScheduleType = {
        [Day.Monday]: new Set(),
        [Day.Tuesday]: new Set(),
        [Day.Wednesday]: new Set(),
        [Day.Thursday]: new Set(),
        [Day.Friday]: new Set(),
        [Day.Saturday]: new Set(),
        [Day.Sunday]: new Set(),
        [Day.Arranged]: new Set(),
      };

      const mainStartStr = timeTableData[9];
      const mainEndStr = timeTableData[10];

      const mainClassTime: ClassTime = {
        start: new HourMinute(
          Number(mainStartStr.split(":")[0]),
          Number(mainStartStr.split(":")[1].substring(0, 2)),
          mainStartStr.split(":")[1].substring(2)
        ),
        end: new HourMinute(
          Number(mainEndStr.split(":")[0]),
          Number(mainEndStr.split(":")[1].substring(0, 2)),
          mainEndStr.split(":")[1].substring(2)
        ),
      };

      for (const day of mainDays) {
        console.log(day);
        const convertedDay = convertToProperDay(day);

        schedule[convertedDay].add(mainClassTime);
      }

      if (extraClassData) {
        const additionalDays = extraClassData[5].split(" ");

        const additionalStartStr = extraClassData[6];
        const additionalEndStr = extraClassData[7];

        const additionalClassTime: ClassTime = {
          start: new HourMinute(
            Number(additionalStartStr.split(":")[0]),
            Number(additionalStartStr.split(":")[1].substring(0, 2)),
            additionalStartStr.split(":")[1].substring(2)
          ),
          end: new HourMinute(
            Number(additionalEndStr.split(":")[0]),
            Number(additionalEndStr.split(":")[1].substring(0, 2)),
            additionalEndStr.split(":")[1].substring(2)
          ),
        };

        for (const day of additionalDays) {
          console.log(day);
          const convertedDay = convertToProperDay(day);

          schedule[convertedDay].add(additionalClassTime);
        }
      }

      courseList.push(
        new VTCourse(
          name,
          crn,
          year,
          semester,
          subject,
          courseNumber,
          schedule,
          type
        )
      );
    }
  }

  console.log(courseList);
  return courseList;
}

export { getCRN, makeRequest, checkIfOpenSlots, getClass };
