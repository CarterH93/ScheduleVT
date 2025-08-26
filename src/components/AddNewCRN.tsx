import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { HourMinute, VTCourseStructure } from "../Backend/Types";
import { VTBreak, VTClass } from "../Backend/VTClasses";
import styles from "./AddNewCRN.module.css";

import { currentTerm } from "../Backend/HokieScheduler";
import { useFetchCRN } from "../hooks/useFetchCRN";

export default function AddNewCRN({
  setShowAddCRNModal,
  setCurrentSchedule,
}: {
  setShowAddCRNModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentSchedule: Dispatch<SetStateAction<VTCourseStructure[]>>;
}) {
  const [crn, setCRN] = useState<string>("");
  const [finalCRN, setFinalCRN] = useState<number>(0);
  const { done, error } = useFetchCRN(setCurrentSchedule, finalCRN);

  function handleAddCRNClick(e: React.FormEvent<HTMLFormElement>) {
    setFinalCRN(parseInt(crn));
    e.preventDefault();
  }
  useEffect(() => {
    if (done) {
      setShowAddCRNModal(false);
    }
  }, [done, setShowAddCRNModal]);

  return (
    <>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleAddCRNClick}>
        <h2>Add New CRN</h2>
        <label className={styles.CRN}>
          <span>CRN:</span>
          <input
            type="number"
            required
            onChange={(e) => setCRN(e.target.value)}
            value={crn}
          />
        </label>
        <button className="btn"> Add New CRN</button>
      </form>
    </>
  );
}
