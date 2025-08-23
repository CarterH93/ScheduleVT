class HourMinute {
  private totalMinutes: number;

  constructor(hour: number, minute: number, meridian: string) {
    if (meridian) {
      if (hour < 1 || hour > 12) {
        throw new Error("Hour must be between 1 and 12 when using AM/PM");
      }
      if (minute < 0 || minute > 59) {
        throw new Error("Minute must be between 0 and 59");
      }
      // Convert AM/PM to 24-hour
      if (meridian === "AM") {
        hour = hour % 12; // 12 AM → 0
      } else {
        hour = (hour % 12) + 12; // 12 PM → 12, 1 PM → 13
      }
    } else {
      if (hour < 0 || hour > 23) {
        throw new Error("Hour must be between 0 and 23");
      }
      if (minute < 0 || minute > 59) {
        throw new Error("Minute must be between 0 and 59");
      }
    }

    this.totalMinutes = hour * 60 + minute;
  }

  compare(other: HourMinute): number {
    return this.totalMinutes - other.totalMinutes;
  }

  isBefore(other: HourMinute): boolean {
    return this.compare(other) <= 0;
  }

  isAfter(other: HourMinute): boolean {
    return this.compare(other) >= 0;
  }

  toString(use12Hour: boolean = false): string {
    if (!use12Hour) {
      const hh = String(Math.floor(this.totalMinutes / 60)).padStart(2, "0");
      const mm = String(this.totalMinutes % 60).padStart(2, "0");
      return `${hh}:${mm}`;
    } else {
      let hour = Math.floor(this.totalMinutes / 60);
      const minute = this.totalMinutes % 60;
      const meridian = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12; // 0 → 12 AM, 12 → 12 PM
      return `${hour}:${String(minute).padStart(2, "0")} ${meridian}`;
    }
  }
}

/**
 * Creates a unique identifier with only numbers
 * @returns Unique number identifier
 */
function getUniqueId() {
  const timestamp = Date.now(); // ~13 digits
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const random = array[0].toString().padStart(10, "0"); // 10 random digits
  return Number(`${timestamp}${random.slice(0, 5)}`); // keep it within safe range
}

enum CourseType {
  Lecture = "Lecture",
  Lab = "Lab",
  Online = "ONLINE COURSE",
  IndependentStudy = "Independent Study",
  Recitation = "Recitation",
  Research = "Research",
  Other = "Other",
}

/**
 * Represents the academic semester options.
 *
 * @remarks
 * Used to specify the semester for scheduling or course assignments.
 *
 * @enum {string}
 * @property {string} Fall - The fall semester.
 * @property {string} Spring - The spring semester.
 * @property {string} Summer - The summer semester.
 * @property {string} Winter - The winter semester.
 */
enum Semester {
  Fall = "09",
  Spring = "01",
  Summer = "06",
  Winter = "12",
}

/**
 * Represents the days of the week.
 *
 * @remarks
 * This enum is used to specify a particular day, with each member corresponding to a day from Monday to Sunday.
 */
enum Day {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
  Arranged = "Arranged",
}

/**
 * Represents the start and end times for a class session.
 *
 * @property start - The starting time of the class.
 * @property end - The ending time of the class.
 */
type ClassTime = {
  start: HourMinute;
  end: HourMinute;
};

/**
 * Represents a schedule mapping each day to a set of class times for a single class.
 *
 * @template Day - The type representing days of the week or scheduling period.
 * @template ClassTime - The type representing a specific class time.
 *
 * Each key in the object corresponds to a day, and its value is a set containing all class times scheduled for that day.
 */
type ScheduleType = {
  [key in Day]: Set<ClassTime>;
};

/**
 * Represents the structure of a VT course, including its unique identifier, name, and schedule.
 *
 * @property {number} id - The unique identifier for the course.
 * @property {string} name - The name of the course.
 * @property {ScheduleType} schedule - The schedule associated with the course.
 */
interface VTCourseStructure {
  get id(): number;
  get name(): string;
  get schedule(): ScheduleType;
}

/**
 * Represents the structure of a VT class, providing access to its courses and unique identifier.
 *
 * @property {VTCourseStructure[]} courses - An array of course structures associated with the class.
 * @property {string} id - The unique identifier for the class.
 */
interface VTClassStructure {
  get courses(): VTCourseStructure[];
  get id(): string;
}

/**
 * Represents the set of all Virginia Tech subject codes.
 * Each enum member corresponds to a unique subject abbreviation used in course listings.
 *
 * @remarks
 * This enum is useful for type-safe handling of subject codes throughout the application.
 *
 * @example
 * ```typescript
 * const subject: VTSubject = VTSubject.CS; // "CS"
 * ```
 */
enum VTSubject {
  AAD = "AAD",
  AAEC = "AAEC",
  ACIS = "ACIS",
  ADS = "ADS",
  ADV = "ADV",
  AFST = "AFST",
  AHRM = "AHRM",
  AINS = "AINS",
  AIS = "AIS",
  ALCE = "ALCE",
  ALS = "ALS",
  AOE = "AOE",
  APS = "APS",
  APSC = "APSC",
  ARBC = "ARBC",
  ARCH = "ARCH",
  ART = "ART",
  AS = "AS",
  ASPT = "ASPT",
  AT = "AT",
  BC = "BC",
  BCHM = "BCHM",
  BDS = "BDS",
  BIOL = "BIOL",
  BIT = "BIT",
  BMES = "BMES",
  BMSP = "BMSP",
  BMVS = "BMVS",
  BSE = "BSE",
  CEE = "CEE",
  CEM = "CEM",
  CHE = "CHE",
  CHEM = "CHEM",
  CHN = "CHN",
  CINE = "CINE",
  CLA = "CLA",
  CMDA = "CMDA",
  CMST = "CMST",
  CNST = "CNST",
  COMM = "COMM",
  CONS = "CONS",
  COS = "COS",
  CRIM = "CRIM",
  CS = "CS",
  CSES = "CSES",
  DANC = "DANC",
  DASC = "DASC",
  ECE = "ECE",
  ECON = "ECON",
  EDCI = "EDCI",
  EDCO = "EDCO",
  EDCT = "EDCT",
  EDEL = "EDEL",
  EDEP = "EDEP",
  EDHE = "EDHE",
  EDIT = "EDIT",
  EDP = "EDP",
  EDRE = "EDRE",
  EDTE = "EDTE",
  ENGE = "ENGE",
  ENGL = "ENGL",
  ENGR = "ENGR",
  ENSC = "ENSC",
  ENT = "ENT",
  ESM = "ESM",
  FIN = "FIN",
  FIW = "FIW",
  FL = "FL",
  FMD = "FMD",
  FR = "FR",
  FREC = "FREC",
  FST = "FST",
  GBCB = "GBCB",
  GEOG = "GEOG",
  GEOS = "GEOS",
  GER = "GER",
  GIA = "GIA",
  GR = "GR",
  GRAD = "GRAD",
  HD = "HD",
  HEB = "HEB",
  HIST = "HIST",
  HNFE = "HNFE",
  HORT = "HORT",
  HTM = "HTM",
  HUM = "HUM",
  IDS = "IDS",
  IS = "IS",
  ISC = "ISC",
  ISE = "ISE",
  ITAL = "ITAL",
  ITDS = "ITDS",
  JMC = "JMC",
  JPN = "JPN",
  JUD = "JUD",
  LAHS = "LAHS",
  LAR = "LAR",
  LAT = "LAT",
  LDRS = "LDRS",
  MACR = "MACR",
  MATH = "MATH",
  ME = "ME",
  MED = "MED",
  MGT = "MGT",
  MINE = "MINE",
  MKTG = "MKTG",
  MN = "MN",
  MS = "MS",
  MSE = "MSE",
  MTRG = "MTRG",
  MUS = "MUS",
  NANO = "NANO",
  NEUR = "NEUR",
  NR = "NR",
  NSEG = "NSEG",
  PAPA = "PAPA",
  PHIL = "PHIL",
  PHS = "PHS",
  PHYS = "PHYS",
  PM = "PM",
  PORT = "PORT",
  PPE = "PPE",
  PPWS = "PPWS",
  PR = "PR",
  PSCI = "PSCI",
  PSVP = "PSVP",
  PSYC = "PSYC",
  REAL = "REAL",
  RED = "RED",
  RLCL = "RLCL",
  RTM = "RTM",
  RUS = "RUS",
  SBIO = "SBIO",
  SOC = "SOC",
  SPAN = "SPAN",
  SPES = "SPES",
  SPIA = "SPIA",
  STAT = "STAT",
  STL = "STL",
  STS = "STS",
  SYSB = "SYSB",
  TA = "TA",
  TBMH = "TBMH",
  UAP = "UAP",
  UH = "UH",
  UNIV = "UNIV",
  VM = "VM",
  WATR = "WATR",
  WGS = "WGS",
}
export { getUniqueId, Semester, Day, VTSubject, CourseType, HourMinute };
export type { ClassTime, ScheduleType, VTCourseStructure, VTClassStructure };
