import styles from "./Error.module.css";

const Error = () => {
  return (
    <p className={styles.error}>
      An error occurred.
      <br />
      Please try again later.
    </p>
  );
};

export default Error;
