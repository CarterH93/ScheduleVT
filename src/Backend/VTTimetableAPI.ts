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
  if (crnSearch.length === 0) {
    throw new Error("CRN not found");
  }
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
    try {
      const cells = rows[i].querySelectorAll("td");

      // Skip rows that don't have enough cells or are comment rows
      if (cells.length < 10) {
        continue;
      }

      const firstCellText = cells[0]?.textContent?.trim() || "";

      // Skip comment rows
      if (firstCellText.includes("Comments for CRN")) {
        continue;
      }

      // Skip if first cell is not a valid CRN (should be a number)
      const crnValue = Number(firstCellText);
      if (isNaN(crnValue) || crnValue === 0) {
        continue;
      }

      if (cells[0].textContent && cells[0].textContent.length > 1) {
        const timeTableData = Array.from(cells).map(
          (cell) => cell.textContent?.trim() || ""
        );

        // Check if next row exists and is not a comment row
        const nextRow = rows[i + 1];
        let extraClassData = null;

        if (nextRow) {
          const nextCells = nextRow.querySelectorAll("td");
          const nextFirstCellText = nextCells[0]?.textContent?.trim() || "";

          // Only use next row if it's not a comment row, has enough cells, and first cell is empty or not a CRN
          const nextCrnValue = Number(nextFirstCellText);
          if (
            nextCells.length >= 8 &&
            !nextFirstCellText.includes("Comments for CRN") &&
            (nextFirstCellText === "" ||
              isNaN(nextCrnValue) ||
              nextCrnValue === 0)
          ) {
            extraClassData = Array.from(nextCells).map(
              (cell) => cell.textContent?.trim() || ""
            );
          }
        }

        //Parse through timeTableData and extraClassData

        const crn = crnValue;

        // Validate course code format (should be like "MATH-2114")
        if (!timeTableData[1] || !timeTableData[1].includes("-")) {
          console.warn(
            `Invalid course code format at row ${i}: ${timeTableData[1]}`
          );
          continue;
        }

        const [subjectStr, courseNumberStr] = timeTableData[1].split("-");

        // Validate subject and course number
        if (!subjectStr || !courseNumberStr) {
          console.warn(`Invalid subject or course number at row ${i}`);
          continue;
        }

        const subject = subjectStr.trim() as VTSubject;
        const courseNumber = Number(courseNumberStr.trim());

        if (isNaN(courseNumber)) {
          console.warn(`Invalid course number at row ${i}: ${courseNumberStr}`);
          continue;
        }

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

        try {
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
            const convertedDay = convertToProperDay(day);

            schedule[convertedDay].add(mainClassTime);
          }
        } catch (e) {
          //just skip adding the class time if there is an error (usually due to bad formatting)
        }

        if (
          extraClassData &&
          extraClassData[5] !== "N/A" &&
          extraClassData[6] !== "N/A" &&
          extraClassData[7] !== "N/A"
        ) {
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
    } catch (error) {
      // Skip this row if there's any error parsing it
      console.warn(`Error parsing row ${i}:`, error);
      continue;
    }
  }

  return courseList;
}

export { getCRN, makeRequest, checkIfOpenSlots, getClass };
