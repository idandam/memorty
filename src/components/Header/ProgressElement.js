import styles from "./ProgressElement.module.css";

const ProgressElement = (props) => {
  return (
    <div className={styles.container}>
      <p className={styles.name}>{props.name}</p>
      <p className={`${styles.value} ${styles.animate}`}>{props.value}</p>
    </div>
  );
};

export default ProgressElement;
