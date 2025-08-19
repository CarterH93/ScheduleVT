class HokieScheduler {
  private VTClasses: Set<VTClass>;
  private courseCombinations: Set<ReadonlySet<VTCourse>>;

  constructor() {
    this.VTClasses = new Set();
    this.courseCombinations = new Set();
  }

  public addClass(VTClass: VTClass): void {
    this.VTClasses.add(VTClass);
  }

  public createSchedules(): Set<ReadonlySet<VTCourse>> {
    //TODO Finish function
    return new Set();
  }

  private recursiveScheduleCheck(
    index: number,
    VTClasses: VTClass[],
    pastCourses: VTCourse[]
  ): void {
    //TODO Finish function
  }

  public doesNotInterfere(
    VTCourse: VTCourse,
    pastCourses: VTCourse[]
  ): boolean {
    //TODO Finish function
    return true;
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
