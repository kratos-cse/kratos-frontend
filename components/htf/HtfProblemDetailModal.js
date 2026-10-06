"use client";

import { useEffect, useRef } from "react";

function DetailBlock({ label, children, variant }) {
  if (!children) return null;
  return (
    <section className={`htf-ps-detail__block${variant ? ` htf-ps-detail__block--${variant}` : ""}`}>
      <h3 className="htf-ps-detail__label">{label}</h3>
      <div className="htf-ps-detail__content">{children}</div>
    </section>
  );
}

function Paragraphs({ text }) {
  if (!text) return null;
  const parts = text.split(/\n\n+/).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
}

function BulletList({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="htf-ps-detail__list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function AreaCards({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="htf-ps-detail__areas">
      {items.map((item) => (
        <li key={item} className="htf-ps-detail__area-card">{item}</li>
      ))}
    </ul>
  );
}

function DataTable({ columns, rows, rowKey }) {
  if (!rows?.length) return null;
  return (
    <div className="htf-ps-detail__table-wrap">
      <table className="htf-ps-detail__table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]}>
              {columns.map((col) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Ps01Ps02Body({ ps }) {
  return (
    <>
      <DetailBlock label="Problem">
        <Paragraphs text={ps.problemStatement} />
      </DetailBlock>
      {ps.challenge && (
        <DetailBlock label="The challenge">
          <p>{ps.challenge}</p>
        </DetailBlock>
      )}
      {ps.realWorldExample && (
        <DetailBlock label="Real-world example">
          <p>{ps.realWorldExample}</p>
        </DetailBlock>
      )}
      {ps.keyProblemAreas && (
        <DetailBlock label="Key problem areas">
          <AreaCards items={ps.keyProblemAreas} />
        </DetailBlock>
      )}
      {ps.handsOnExercise && (
        <DetailBlock label="Hands-on exercise">
          <BulletList items={ps.handsOnExercise} />
        </DetailBlock>
      )}
      {ps.technicalExpectations && (
        <DetailBlock label="Technical expectations">
          <BulletList items={ps.technicalExpectations} />
        </DetailBlock>
      )}
      {ps.expectedOutcome && (
        <DetailBlock label="Expected outcome" variant="outcome">
          <p>{ps.expectedOutcome}</p>
        </DetailBlock>
      )}
    </>
  );
}

function Ps03Body({ ps }) {
  return (
    <>
      <DetailBlock label="Problem">
        <Paragraphs text={ps.problemStatement} />
      </DetailBlock>
      {ps.challenge && (
        <DetailBlock label="The challenge">
          <p>{ps.challenge}</p>
        </DetailBlock>
      )}
      {ps.realWorldExample && (
        <DetailBlock label="Real-world example">
          <p>{ps.realWorldExample}</p>
        </DetailBlock>
      )}
      {ps.requiredModules && (
        <DetailBlock label="Required modules">
          <DataTable
            rowKey="name"
            columns={[
              { key: "name", label: "Module" },
              { key: "description", label: "What it does" },
              { key: "implementation", label: "Suggested implementation" },
            ]}
            rows={ps.requiredModules}
          />
        </DetailBlock>
      )}
      {ps.safetyRules && (
        <DetailBlock label="Safety rules (mandatory)" variant="safety">
          <BulletList items={ps.safetyRules} />
        </DetailBlock>
      )}
      {ps.rules && (
        <DetailBlock label="Rules">
          <BulletList items={ps.rules} />
        </DetailBlock>
      )}
      {ps.deliverables && (
        <DetailBlock label="Deliverables">
          <BulletList items={ps.deliverables} />
        </DetailBlock>
      )}
      {ps.judging && (
        <DetailBlock label="Deliverables and judging">
          <DataTable
            rowKey="criterion"
            columns={[
              { key: "criterion", label: "Criterion" },
              { key: "marks", label: "Marks" },
              { key: "description", label: "What the judges look for" },
            ]}
            rows={ps.judging}
          />
        </DetailBlock>
      )}
    </>
  );
}

function Ps04Body({ ps }) {
  return (
    <>
      <DetailBlock label="Problem">
        <Paragraphs text={ps.problemStatement} />
      </DetailBlock>
      {ps.challenge && (
        <DetailBlock label="The challenge">
          <p>{ps.challenge}</p>
        </DetailBlock>
      )}
      {ps.realWorldExample && (
        <DetailBlock label="Real-world example">
          <p>{ps.realWorldExample}</p>
        </DetailBlock>
      )}
      {ps.keyProblemAreas && (
        <DetailBlock label="Key problem areas">
          <AreaCards items={ps.keyProblemAreas} />
        </DetailBlock>
      )}
      {ps.requiredModules && (
        <DetailBlock label="Required modules">
          <DataTable
            rowKey="name"
            columns={[
              { key: "name", label: "Module" },
              { key: "description", label: "What it does" },
              { key: "implementation", label: "Suggested implementation" },
            ]}
            rows={ps.requiredModules}
          />
        </DetailBlock>
      )}
      {ps.dataSources && (
        <DetailBlock label="Where to get data">
          <DataTable
            rowKey="source"
            columns={[
              { key: "source", label: "Source" },
              { key: "description", label: "What you get" },
              { key: "notes", label: "Notes" },
            ]}
            rows={ps.dataSources}
          />
        </DetailBlock>
      )}
      {ps.rules && (
        <DetailBlock label="Rules">
          <BulletList items={ps.rules} />
        </DetailBlock>
      )}
      {ps.bonus && (
        <DetailBlock label="Bonus">
          <p>{ps.bonus}</p>
        </DetailBlock>
      )}
      {ps.deliverables && (
        <DetailBlock label="Deliverables">
          <BulletList items={ps.deliverables} />
        </DetailBlock>
      )}
      {ps.judging && (
        <DetailBlock label="Deliverables and judging">
          <DataTable
            rowKey="criterion"
            columns={[
              { key: "criterion", label: "Criterion" },
              { key: "marks", label: "Marks" },
              { key: "description", label: "What the judges look for" },
            ]}
            rows={ps.judging}
          />
        </DetailBlock>
      )}
      {ps.expectedOutcome && (
        <DetailBlock label="Expected outcome" variant="outcome">
          <p>{ps.expectedOutcome}</p>
        </DetailBlock>
      )}
    </>
  );
}

export default function HtfProblemDetailModal({ ps, open, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => closeRef.current?.focus());
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!ps) return null;

  const body =
    ps.id === "ps-03" ? (
      <Ps03Body ps={ps} />
    ) : ps.id === "ps-04" ? (
      <Ps04Body ps={ps} />
    ) : (
      <Ps01Ps02Body ps={ps} />
    );

  return (
    <dialog
      ref={dialogRef}
      className="htf-ps-detail"
      aria-labelledby="htf-ps-detail-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="htf-ps-detail__panel">
        <header className="htf-ps-detail__header">
          <div className="htf-ps-detail__header-text">
            <p className="htf-ps-detail__meta">
              <span>PS {ps.number}</span>
              <span className="htf-ps-detail__meta-sep" aria-hidden="true">·</span>
              <span>Problem statement</span>
            </p>
            <h2 id="htf-ps-detail-title">{ps.title}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="htf-ps-detail__close"
            onClick={onClose}
            aria-label="Close problem statement"
          >
            Close
          </button>
        </header>
        <div className="htf-ps-detail__body">{body}</div>
      </div>
    </dialog>
  );
}
