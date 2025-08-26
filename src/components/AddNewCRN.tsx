import { Dispatch, SetStateAction } from "react";
import { HourMinute, VTCourseStructure } from "../Backend/Types";
import { VTBreak, VTClass } from "../Backend/VTClasses";
import styles from "./AddNewCRN.module.css";

export default function AddNewCRN({setShowAddCRNModal, setCurrentSchedule}: {setShowAddCRNModal: React.Dispatch<React.SetStateAction<boolean>>, setCurrentSchedule: Dispatch<SetStateAction<VTCourseStructure[]>>}) {

    function handleAddCRNClick() {

        //TODO implement crn retrieval logic here. Prob need to use hook

    setShowAddCRNModal(false);
  }
  return (
    <>
      <h2>Add New CRN</h2>
      <button onClick={handleAddCRNClick}>Add CRN</button>
    </>
  );
}
