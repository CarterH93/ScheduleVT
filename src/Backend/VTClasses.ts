import {
  VTSubject,
  Semester,
  VTClassStructure,
  VTCourseStructure,
  ScheduleType,
  CourseType,
  getUniqueId,
} from "./Types";
import { doesNotInterfere } from "./HokieScheduler";

/**
 * Represents a Virginia Tech class, encapsulating its subject, course number, year, semester, and associated courses.
 *
 * @remarks
 * This class manages a collection of `VTCourse` instances that share the same subject and course number.
 * It provides methods to add and remove courses, and generates a unique identifier based on the sorted course IDs.
 *
 * @implements VTClassStructure
 *
 * @example
 * ```typescript
 * const vtClass = new VTClass("CS", 1114, 2024, Semester.Fall);
 * vtClass.addCourse(12345);
 * vtClass.removeCourse(12345);
 * ```
 *
 * @property {VTCourse[]} courses - The list of courses associated with this class.
 * @property {string} id - A unique identifier for the class, generated from the course IDs.
 * @property {VTSubject} subject - The subject of the class.
 * @property {number} courseNumber - The course number.
 *
 * @method addCourse - Adds a new course to the class, ensuring subject and course number match.
 * @method removeCourse - Removes a course from the class by its ID.
 */
class VTClass implements VTClassStructure {
  private _courses: VTCourse[];
  private _subject: VTSubject;
  private _courseNumber: number;
  private _year: number;
  private _semester: Semester;
  constructor(
    subject: VTSubject,
    courseNumber: number,
    year: number,
    semester: Semester
  ) {
    this._subject = subject;
    this._courseNumber = courseNumber;
    this._courses = [];
    this._year = year;
    this._semester = semester;
  }

  public get courses(): VTCourse[] {
    return this._courses;
  }

  public addCourse(course: VTCourse): void {
    if (this._courses.some((c) => c.id === course.id)) {
      throw new Error(`Course with id ${course.id} already exists.`);
    }

    if (
      course.subject !== this._subject ||
      course.courseNumber !== this._courseNumber
    ) {
      throw new Error(
        `Course subject or number does not match class subject ${this._subject} or number ${this._courseNumber}.`
      );
    }

    this._courses.push(course);
  }

  public removeCourse(id: number): void {
    this._courses = this._courses.filter((course) => course.id !== id);
  }

  public get id(): string {
    //TODO Verify with tests that this actually works as intended
    // Create a hash from the sorted course ids
    const ids = this._courses.map((c) => c.id).sort((a, b) => a - b);
    const str = ids.join("-");
    // Simple hash function (djb2)
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) + hash + str.charCodeAt(i);
    }
    return hash.toString();
  }

  public get subject(): VTSubject {
    return this._subject;
  }

  public get courseNumber(): number {
    return this._courseNumber;
  }
}

class VTCourse implements VTCourseStructure {
  private _name: string;
  private _id: number;
  private _subject: VTSubject;
  private _courseNumber: number;
  private _schedule: ScheduleType;
  private _type: CourseType;

  constructor(
    name: string,
    id: number,
    year: number,
    semester: Semester,
    subject: VTSubject,
    courseNumber: number,
    schedule: ScheduleType,
    type: CourseType
  ) {
    this._id = id;
    this._name = name;
    this._subject = subject;
    this._courseNumber = courseNumber;
    this._schedule = schedule;
    this._type = type;
  }

  public get id(): number {
    return this._id;
  }

  public get subject(): VTSubject {
    return this._subject;
  }

  public get courseNumber(): number {
    return this._courseNumber;
  }

  public get name(): string {
    return this._name;
  }


  public get schedule(): ScheduleType {
    return this._schedule;
  }

  public get type(): CourseType {
    return this._type;
  }

  public get stringSchedule(): string {
    //TODO implement this method
    //Creates a string representation of the schedule
    throw new Error("Method not implemented.");
  }
}

/**
 * Represents the user's past current schedule containing a collection of courses.
 *
 * @implements {VTClassStructure}
 *
 * @remarks
 * This is used for the user to add breaks and existing courses to their schedule separately from the new classes they are trying to add.
 *
 * @example
 * ```typescript
 * const schedule = new CurrentSchedule();
 * schedule.addCourse(course);
 * schedule.removeCourse(courseId);
 * ```
 */
class CurrentSchedule implements VTClassStructure {
  private _courses: VTCourseStructure[];
  private _id: string;

  constructor() {
    this._id = crypto.randomUUID();
    this._courses = [];
  }

  public get courses(): VTCourseStructure[] {
    return this._courses;
  }

  public addCourse(course: VTCourseStructure): void {
    if (doesNotInterfere(course, this.courses)) {
      this._courses.push(course);
    } else {
      throw new Error(
        `Course with id ${course.id} schedule interferes with existing courses schedules.`
      );
    }
  }

  public removeCourse(id: number) {
    this._courses = this._courses.filter((course) => course.id !== id);
  }

  public get id(): string {
    return this._id;
  }
}

/**
 * Represents a break period within a course schedule.
 * Implements the {@link VTCourseStructure} interface.
 *
 * @remarks
 * A VTBreak is used to define non-instructional periods such as lunch breaks or free periods.
 * Breaks can only be added to the user's current schedule
 *
 * @example
 * ```typescript
 * const lunchBreak = new VTBreak("Lunch", lunchSchedule);
 * ```
 *
 * @param name - The name of the break.
 * @param schedule - The schedule details for the break.
 *
 * @property id - The unique identifier for the break.
 * @property name - The name of the break.
 * @property schedule - The schedule information for the break.
 */
class VTBreak implements VTCourseStructure {
  private _name: string;
  private _id: number;
  private _schedule: ScheduleType;

  constructor(name: string, schedule: ScheduleType) {
    this._name = name;
    this._id = getUniqueId();
    this._schedule = schedule;
  }

  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get schedule(): ScheduleType {
    return this._schedule;
  }
}
export { VTClass, VTCourse, CurrentSchedule, VTBreak };
