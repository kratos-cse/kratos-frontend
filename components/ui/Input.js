import { forwardRef } from "react";
import styles from "./Input.module.css";

export const Input = forwardRef(function Input(
  { id, label, hint, error, className = "", ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <label className={[styles.field, className].filter(Boolean).join(" ")} htmlFor={inputId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input ref={ref} id={inputId} className={styles.input} aria-invalid={error ? true : undefined} {...rest} />
      {error ? (
        <span className={styles.error} role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </label>
  );
});

export const TextArea = forwardRef(function TextArea(
  { id, label, hint, error, className = "", ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <label className={[styles.field, className].filter(Boolean).join(" ")} htmlFor={inputId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <textarea
        ref={ref}
        id={inputId}
        className={[styles.input, styles.textarea].join(" ")}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error ? (
        <span className={styles.error} role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </label>
  );
});

export const Select = forwardRef(function Select(
  { id, label, hint, error, children, className = "", ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <label className={[styles.field, className].filter(Boolean).join(" ")} htmlFor={inputId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <select
        ref={ref}
        id={inputId}
        className={[styles.input, styles.select].join(" ")}
        aria-invalid={error ? true : undefined}
        {...rest}
      >
        {children}
      </select>
      {error ? (
        <span className={styles.error} role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </label>
  );
});
