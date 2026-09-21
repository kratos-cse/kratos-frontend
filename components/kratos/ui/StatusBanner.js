export default function StatusBanner({ tone = "info", title, children }) {
  return (
    <div className={`status-banner ${tone}`} role={tone === "err" ? "alert" : "status"}>
      {title ? <strong>{title}</strong> : null}
      {children}
    </div>
  );
}
