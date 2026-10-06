"use client";

import { useEffect, useRef } from "react";

function Section({ title, children }) {
  if (!children) return null;
  return (
    <section className="htf-ps-modal__section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function List({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="htf-ps-modal__list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function HtfProblemDetailModal({ ps, open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!ps) return null;

  return (
    <dialog
      ref={dialogRef}
      className="htf-ps-modal"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="htf-ps-modal__panel">
        <button type="button" className="htf-ps-modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <header className="htf-ps-modal__header">
          <p className="htf-ps-modal__eyebrow">PS {ps.number}</p>
          <h2 id="htf-ps-modal-title">{ps.title}</h2>
        </header>
        <div className="htf-ps-modal__body">
          <Section title="Problem Statement">
            <p>{ps.problemStatement}</p>
          </Section>
          {ps.realWorldExample && (
            <Section title="Real-World Example">
              <p>{ps.realWorldExample}</p>
            </Section>
          )}
          {ps.challenge && (
            <Section title="The Challenge">
              <p>{ps.challenge}</p>
            </Section>
          )}
          {ps.keyProblemAreas && (
            <Section title="Key Problem Areas">
              <List items={ps.keyProblemAreas} />
            </Section>
          )}
          {ps.workflow && (
            <Section title="Workflow">
              <p className="htf-ps-modal__workflow">{ps.workflow.join(" → ")}</p>
            </Section>
          )}
          {ps.handsOnExercise && (
            <Section title="Hands-On Exercise">
              <List items={ps.handsOnExercise} />
            </Section>
          )}
          {ps.technicalExpectations && (
            <Section title="Technical Expectations">
              <List items={ps.technicalExpectations} />
            </Section>
          )}
          {ps.expectedOutcome && (
            <Section title="Expected Outcome">
              <p>{ps.expectedOutcome}</p>
            </Section>
          )}
          {ps.requiredModules && (
            <Section title="Required Modules">
              <div className="htf-ps-modal__table-wrap">
                <table className="htf-ps-modal__table">
                  <thead>
                    <tr>
                      <th>Module</th>
                      <th>What it does</th>
                      <th>Suggested implementation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ps.requiredModules.map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.description}</td>
                        <td>{row.implementation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}
          {ps.safetyRules && (
            <Section title="Safety Rules (Mandatory)">
              <List items={ps.safetyRules} />
            </Section>
          )}
          {ps.rules && (
            <Section title="Rules">
              <List items={ps.rules} />
            </Section>
          )}
          {ps.dataSources && (
            <Section title="Where to Get Data">
              <div className="htf-ps-modal__table-wrap">
                <table className="htf-ps-modal__table">
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>What you get</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ps.dataSources.map((row) => (
                      <tr key={row.source}>
                        <td>{row.source}</td>
                        <td>{row.description}</td>
                        <td>{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}
          {ps.bonus && (
            <Section title="Bonus">
              <p>{ps.bonus}</p>
            </Section>
          )}
          {ps.deliverables && (
            <Section title="Deliverables">
              <List items={ps.deliverables} />
            </Section>
          )}
          {ps.judging && (
            <Section title="Deliverables and Judging">
              <div className="htf-ps-modal__table-wrap">
                <table className="htf-ps-modal__table">
                  <thead>
                    <tr>
                      <th>Criterion</th>
                      <th>Marks</th>
                      <th>What the judges look for</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ps.judging.map((row) => (
                      <tr key={row.criterion}>
                        <td>{row.criterion}</td>
                        <td>{row.marks}</td>
                        <td>{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}
        </div>
      </div>
    </dialog>
  );
}
