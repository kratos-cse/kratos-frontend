import React from "react";

export default function StackedCardStack({
  children,
  topOffset,
  stackGap = 18,
  cardMinHeight = "74vh",
}) {
  const items = React.Children.toArray(children);

  const stackStyle = {
    "--stacked-card-gap": `${stackGap}px`,
    "--stacked-card-min-height": cardMinHeight,
  };
  if (topOffset != null) {
    stackStyle["--stacked-card-top-offset"] = `${topOffset}px`;
  }

  return (
    <div className="stacked-card-stack" style={stackStyle}>
      {items.map((child, index) => (
        <div
          className="stacked-card-stack__slot"
          key={child.key ?? index}
          style={{
            "--stack-index": index,
          }}
        >
          <div className="stacked-card-stack__card">{child}</div>
        </div>
      ))}
    </div>
  );
}
