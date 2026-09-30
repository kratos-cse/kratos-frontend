import styles from "./Card.module.css";

export function Card({ as: Comp = "div", children, className = "", interactive = false, ...rest }) {
  return (
    <Comp
      className={[styles.card, interactive ? styles.interactive : "", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </Comp>
  );
}
