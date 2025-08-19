import {
  Semester,
  VTSubject,
  InvalidRequestException,
  InvalidSearchException,
} from "./Types";
import { VTClass, VTCourse } from "./VTClasses";

//TODO Write documentation

async function getCRN(
  year: number,
  semester: Semester,
  crn: number
): Promise<VTCourse> {
  const crnSearch = await searchTimetable(
    String(year),
    semester,
    "BlACKSBURG",
    "ALL",
    "ALL",
    "ANY",
    "",
    String(crn),
    "ALL",
    "ALL"
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
  //Look at python framework source code. Maybe ask chatgpt to refactor it to typescript.
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
  const subj = subject === "" ? "%" : subject;

  // Prepare request data
  const requestData = {
    CAMPUS: campus,
    TERMYEAR: termYear,
    CORE_CODE: pathway,
    subj_code: subj,
    SCHDTYPE: sectionType,
    CRSE_NUMBER: code,
    crn: crn,
    open_only: status,
    sess_code: modality,
  };

  // Make request
  const response = await makeRequest("POST", requestData);
  if (response === "") {
    throw new Error("No classes found.");
  }

  // Parse HTML response
  // TODO: Implement readHtml and Course construction logic
  // For now, return empty array
  // You will need to implement a parser similar to read_html in Python

  console.log(response);
  return [];
}

async function makeRequest(
  requestType: "POST" | "GET",
  requestData?: Record<string, string>
): Promise<string> {
  const url = "https://apps.es.vt.edu/ssb/HZSKVTSC.P_ProcRequest";

  if (requestType === "POST") {
    const formData = new URLSearchParams();

    if (requestData) {
      for (const [key, value] of Object.entries(requestData)) {
        formData.append(key, value);
      }
    }

    console.log("Making POST request with data:", formData.toString());

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const text = await response.text();

    if (text.includes("THERE IS AN ERROR WITH YOUR REQUEST")) {
      throw new InvalidRequestException(
        "The search parameters provided were invalid"
      );
    }

    if (text.includes("There was a problem with your request")) {
      if (text.includes("NO SECTIONS FOUND FOR THIS INQUIRY")) {
        return "";
      } else {
        const match = text.match(/<b class=red_msg><li>(.+)<\/b>/);
        if (match) {
          throw new InvalidSearchException(match[1]);
        }
      }
    }

    return text;
  } else {
    const response = await fetch(url);
    return await response.text();
  }
}

export { getCRN, getClasses, makeRequest };
