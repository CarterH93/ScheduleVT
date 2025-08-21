import { sep } from "path";
import {
  VTClassStructure,
  VTCourseStructure,
  ScheduleType,
  ClassTime,
} from "./Types";
import { VTClass, CurrentSchedule } from "./VTClasses";

class HokieScheduler {
  private VTClasses: Set<VTClassStructure>;
  private courseCombinations: Set<ReadonlySet<VTCourseStructure>>;

  constructor() {
    this.VTClasses = new Set();
    this.courseCombinations = new Set();
  }

  public addClass(VTClass: VTClass): void {
    this.VTClasses.add(VTClass);
  }

  /**
   * This method adds the current schedule to the HokieScheduler.
   * It splits up every course/break into its own CurrentSchedule object to make sure it tests for schedule conflicts correctly.
   * @param schedule CurrentSchedule to add to the HokieScheduler
   */
  public addCurrentSchedule(schedule: CurrentSchedule): void {
    for (const course of schedule.courses) {
      const separateClass = new CurrentSchedule();
      separateClass.addCourse(course);
      this.VTClasses.add(separateClass);
    }
  }

  public createSchedules(): Set<ReadonlySet<VTCourseStructure>> {
    //TODO Finish function
    return new Set();
  }

  private recursiveScheduleCheck(
    index: number,
    VTClasses: VTClassStructure[],
    pastCourses: VTCourseStructure[]
  ): void {
    //TODO Finish function
  }

  private schedulesDoNotInterfere(
    schedule1: ScheduleType,
    schedule2: ScheduleType
  ): boolean {
    //TODO Finish function
    return true;
  }

  private timesDoNotInterfere(time1: ClassTime, time2: ClassTime): boolean {
    //TODO Finish function
    return true;
  }

  public createScheduleToTextFile(): string {
    //TODO Finish function
    return "";
  }
}

function doesNotInterfere(
  VTCourse: VTCourseStructure,
  pastCourses: VTCourseStructure[]
): boolean {
  //TODO Finish function
  return true;
}

export { HokieScheduler, doesNotInterfere };
