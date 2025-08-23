import {
  VTClassStructure,
  VTCourseStructure,
  ScheduleType,
  ClassTime,
  Day,
} from "./Types";
import { VTClass, CurrentSchedule } from "./VTClasses";
import { Set as FrozenSet } from "immutable";

class HokieScheduler {
  private VTClasses: Set<VTClassStructure>;
  private courseCombinations: FrozenSet<VTCourseStructure>[];

  constructor() {
    this.VTClasses = new Set();
    this.courseCombinations = [];
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

  public createSchedules(): VTCourseStructure[][] {
    const arrayOfVTClasses = Array.from(this.VTClasses);
    this.recursiveScheduleCheck(0, arrayOfVTClasses, []);

    //Convert back to array of arrays

    const final: VTCourseStructure[][] = this.courseCombinations.map((fs) =>
      fs.toArray()
    );

    return final;
  }

  private recursiveScheduleCheck(
    index: number,
    VTClasses: VTClassStructure[],
    pastCourses: VTCourseStructure[]
  ): void {
    const courses = VTClasses[index].courses;
    for (const course of courses) {
      if (this.courseCombinations.length >= 100) {
        // We have found 100 possible schedules. Stop the recursion.
        return;
      } else if (index === VTClasses.length - 1) {
        // We are at the end of the list of VTClasses
        // Check if this course creates a valid schedule.
        if (this.doesNotInterfere(course, pastCourses)) {
          const scheduleCourseCombination = pastCourses.slice();
          scheduleCourseCombination.push(course);
          // Adding course combination to main variable

          this.courseCombinations.push(FrozenSet(scheduleCourseCombination));

          //Get rid of duplicates
          const frozenSetCombination = FrozenSet(this.courseCombinations);

          //Add final combination without duplicates to main variable
          this.courseCombinations = Array.from(frozenSetCombination);
        }
      } else {
        // We can still continue the recursion. Add current index of VTClasses and past courses to pastCoursesAddition
        const pastCoursesAddition = pastCourses.slice();
        pastCoursesAddition.push(course);
        // +1 the index of next class.
        this.recursiveScheduleCheck(index + 1, VTClasses, pastCoursesAddition);
      }
    }
  }

  private doesNotInterfere(
    VTCourse: VTCourseStructure,
    pastCourses: VTCourseStructure[]
  ): boolean {
    for (const course of pastCourses) {
      if (!this.schedulesDoNotInterfere(VTCourse.schedule, course.schedule)) {
        return false;
      }
    }
    if (pastCourses.length <= 1) {
      return true;
    } else {
      // Recursively check the rest
      return this.doesNotInterfere(
        pastCourses[pastCourses.length - 1],
        pastCourses.slice(0, -1)
      );
    }
  }

  private schedulesDoNotInterfere(
    schedule1: ScheduleType,
    schedule2: ScheduleType
  ): boolean {
    for (const day of Object.values(Day)) {
      const times1 = schedule1[day];
      const times2 = schedule2[day];
      if (times1 && times2) {
        for (const time1 of Array.from(times1)) {
          for (const time2 of Array.from(times2)) {
            if (!this.timesDoNotInterfere(time1, time2)) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  private timesDoNotInterfere(time1: ClassTime, time2: ClassTime): boolean {
    return time1.end.isBefore(time2.start) || time1.start.isAfter(time2.end);
  }
}

export { HokieScheduler };
