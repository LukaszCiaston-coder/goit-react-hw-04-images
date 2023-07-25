import styles from './Button.module.css';

const Button = ({ onClick }) => {
  return (
    <button
      type="button"
      className={`${styles.button} ${styles['load-more']}`}
      onClick={onClick}
    >
      Load more
    </button>
  );
};

export default Button;
