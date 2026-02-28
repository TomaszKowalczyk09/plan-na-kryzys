import React, { useState } from "react";

// Przykładowe kamienie milowe
const defaultMilestones = [
  { id: 1, label: "Pierwszy dzień trzeźwości", date: "2026-02-28" },
  { id: 2, label: "Pierwszy tydzień", date: "2026-03-06" },
];

export default function KamienieMilowe({ milestones = defaultMilestones }) {
  const list = milestones;

  return (
    <div className="milestones">
      <h2>Kamienie milowe</h2>
      <ul>
        {list.map((m) => (
          <li key={m.id}>
            <strong>{m.label}</strong> — <span>{m.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
