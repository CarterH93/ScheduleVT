class HokieScheduler {
  private VTClasses: Set<VTClassStructure>;
  private courseCombinations: Set<ReadonlySet<VTCourseStructure>>;

  constructor() {
    this.VTClasses = new Set();
    this.courseCombinations = new Set();
  }

  public addClass(VTClass: VTClassStructure): void {
    this.VTClasses.add(VTClass);
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