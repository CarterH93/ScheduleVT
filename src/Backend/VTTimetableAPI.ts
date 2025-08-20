import { request } from "http";
import { Semester, VTSubject } from "./Types";
import { VTClass, VTCourse } from "./VTClasses";
import { getFunctions, httpsCallable } from "firebase/functions";

//TODO Write documentation

async function checkIfOpenSlots(
  year: number,
  semester: Semester,
  crn: number
): Promise<boolean> {
  const results = await searchTimetable(
    String(year),
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
    String(year),
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

function getClasses(
  year: number,
  semester: Semester,
  subject: VTSubject,
  courseNumber: number
): VTClass[] {
  //TODO Finish function
  throw new Error("getClasses function not implemented");
}

async function searchTimetable(
  year: string,
  semester: string,
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

  //TODO Parse HTML response
  // You will need to implement a parser similar to read_html in Python

  //TODO: set isOpenSlots using checkIfOpenSlots() function
  console.log(response);
  throw new Error("searchTimetable function not implemented");
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

export { getCRN, getClasses, makeRequest, checkIfOpenSlots };
