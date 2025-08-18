class VTClass implements VTClassStructure {
  private _courses: VTCourse[];
  private _subject: VTSubject;
  private _courseNumber: number;
  private _name: string;
  constructor(subject: VTSubject, courseNumber: number, name: string) {
    this._subject = subject;
    this._courseNumber = courseNumber;
    this._name = name;
    this._courses = [];
  }

  public get courses(): VTCourse[] {
    return this._courses;
  }

  public addCourse(id: number): void {
    const course = new VTCourse(id);

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

  public get name(): string {
    return this._name;
  }
}

class VTCourse implements VTCourseStructure {
  private _name: string;
  private _id: number;
  private _subject: VTSubject;
  private _courseNumber: number;
  private _isFull: boolean;
  private _professor: string;
  private _schedule: ScheduleType;
  private _type: CourseType;

  constructor(id: number) {
    this._id = id;

    //TODO Set rest of the properties based on retrieval of data from api
    //TEMP VALUES SET BELOW
    this._name = "TEMP";
    this._subject = VTSubject.AAD;
    this._courseNumber = 0;
    this._isFull = true;
    this._professor = "TEMP";
    this._schedule = {} as ScheduleType; // Default value added
    this._type = CourseType.Other;
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

  public get isFull(): boolean {
    return this._isFull;
  }

  public get professor(): string {
    return this._professor;
  }

  public get schedule(): ScheduleType {
    return this._schedule;
  }

  public get type(): CourseType {
    return this._type;
  }
}

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
    //TODO Check that newly added course does not interfere with other courses
  }

  public removeCourse(id: number) {
    this._courses = this._courses.filter((course) => course.id !== id);
  }

  public get id(): string {
    return this._id;
  }
}

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
