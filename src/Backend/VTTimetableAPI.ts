import { Semester, VTSubject } from "./Types";
import { VTClass, VTCourse } from "./VTClasses";

//TODO Write documentation
function getCRN(
  year: number,
  semester: Semester,
  crn: number
): VTCourse | undefined {
  //TODO Finish function
  //Look at python framework source code. Maybe ask chatgpt to refactor it to typescript.
  return undefined;
}

function getClasses(
  year: number,
  semester: Semester,
  subject: VTSubject,
  courseNumber: number
): VTClass[] | undefined {
  //TODO Finish function
  //Look at python framework source code. Maybe ask chatgpt to refactor it to typescript.
  return undefined;
}

function makeRequest(
  requestType: string,
  requestData: { string: string }
): string {
  //TODO Finish function
  //Look at python framework source code. Maybe ask chatgpt to refactor it to typescript.
  return "";
}

export { getCRN, getClasses, makeRequest };
