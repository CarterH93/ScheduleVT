import { VTCourse } from '../Backend/VTClasses';
import styles from './Checkbox.module.css';

import React from 'react'

export default function Checkbox({ vtCourse, checkHandler, index }: { vtCourse: VTCourse, checkHandler: (e: React.ChangeEvent<HTMLInputElement>) => void, index: number }) {
  return (
    <div className={styles.checkbox}>
      <input
        type="checkbox"
        id={`checkbox-${index}`}
        checked={vtCourse.selected}
        onChange={checkHandler}
      />
      <label htmlFor={`checkbox-${index}`}>{vtCourse.id}</label>
    </div>
  )
}
