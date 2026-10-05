import React from "react";

export default function StackedCardStack({
  children,
  topOffset = 92,
  stackGap = 18,
  cardMinHeight = "74vh",
}) {
  const items = React.Children.toArray(children);

  return (
    <div
      className="stacked-card-stack"
      style={{
        "--stacked-card-top-offset": `${topOffset}px`,
        "--stacked-card-gap": `${stackGap}px`,
        "--stacked-card-min-height": cardMinHeight,
      }}
    >
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
