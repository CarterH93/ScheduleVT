import { VTCourseStructure } from '../Backend/Types';
import styles from './AddClass.module.css';

import React, { Dispatch, SetStateAction } from 'react'

export default function addClass({setShowAddClassModal, setCurrentSchedule}: {setShowAddClassModal: React.Dispatch<React.SetStateAction<boolean>>, setCurrentSchedule: Dispatch<SetStateAction<VTCourseStructure[]>>}) {
  return (
    <div>addClass</div>
  )
}
