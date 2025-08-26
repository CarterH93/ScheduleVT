import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

interface ModalProps {
  children: React.ReactNode;
  handleClose: () => void;
}

export default function Modal({ children, handleClose }: ModalProps) {
  return ReactDOM.createPortal(
    <div className={styles["modal-backdrop"]}>
      <div className={styles.modal}>
        {children}
        <button onClick={handleClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}
