import React from "react";
import { VTClass } from "../../Backend/VTClasses";
import { VTSubject, Semester } from "../../Backend/Types";
import { checkIfOpenSlots } from "../../Backend/VTTimetableAPI";

export default function Home() {
  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    //const CS = new VTClass(VTSubject.CS, 1114, 2025, Semester.Fall);
    //CS.addCourse(83455);
    //CS.addCourse(83456);
    //CS.addCourse(83457);

   // console.log(CS);
    //console.log(CS.id);

    console.log(checkIfOpenSlots(2025, Semester.Fall, 83455))
  }

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
