import React, { useMemo, useState, useEffect } from 'react';

function GroundingGuide() {
  const steps = useMemo(() => [
    {
      id: 'intro',
      title: 'Uziemienie: 5–4–3–2–1',
      text: [
        'To krótka technika, która pomaga wrócić uwagą do „tu i teraz”.',
        'Idź spokojnie. Jeśli któryś krok jest trudny, pomiń i przejdź dalej.',
      ],
      prompt: 'Zacznij od rozejrzenia się po otoczeniu.',
    },
    {
      id: '5',
      title: 'Krok 1/5: Wzrok (5 rzeczy)',
      text: ['Nazwij 5 rzeczy, które widzisz. Mogą być małe: kolor, kształt, cień, napis.'],
      prompt: 'Powiedz w myślach lub na głos: „Widzę…” i wymień 5 rzeczy.',
    },
    {
      id: '4',
      title: 'Krok 2/5: Dotyk (4 rzeczy)',
      text: ['Nazwij 4 rzeczy, które czujesz dotykiem (np. tkaninę na skórze, oparcie krzesła, telefon w dłoni).'],
      prompt: 'Dotknij 1–2 przedmiotów i zauważ fakturę oraz temperaturę.',
    },
    {
      id: '3',
      title: 'Krok 3/5: Słuch (3 dźwięki)',
      text: ['Nazwij 3 dźwięki. Bliskie lub dalekie. Nawet bardzo ciche.'],
      prompt: 'Zatrzymaj się na 10 sekund i „poluj” na dźwięki.',
    },
    {
      id: '2',
      title: 'Krok 4/5: Zapach (2 rzeczy)',
      text: ['Nazwij 2 zapachy. Jeśli trudno — nazwij 2 rzeczy, które „czujesz w powietrzu” (np. świeże, ciepłe).'],
      prompt: 'Zrób 2 spokojne wdechy nosem.',
    },
    {
      id: '1',
      title: 'Krok 5/5: Smak (1 rzecz)',
      text: ['Nazwij 1 smak. Może być „neutralnie”.'],
      prompt: 'Jeśli możesz, napij się łyka wody i zauważ smak.',
    },
    {
      id: 'finish',
      title: 'Koniec',
      text: [
        'Dobrze. To już wszystko.',
        'Na koniec dociśnij stopy do podłogi na 10 sekund i puść. Powtórz 2 razy.',
        'Jeśli chcesz: wdech 4 sekundy, wydech 6 sekund (6 razy).',
      ],
      prompt: 'Możesz zakończyć lub zacząć od początku.',
    },
  ], []);

  const [index, setIndex] = useState(0);
  const step = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  return (
    <div style={{ maxWidth: 480, margin: '32px auto', background: '#fff', borderRadius: 24, boxShadow: '0 4px 32px #0002', padding: '32px 24px', color: '#222' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24, fontWeight: 700, fontSize: 24 }}>{step.title}</h2>
      {step.text.map((t, i) => (
        <p key={i} style={{ fontSize: 16, marginBottom: 8 }}>{t}</p>
      ))}
      <div style={{ fontWeight: 600, margin: '18px 0', fontSize: 17 }}>{step.prompt}</div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
        {isLast ? (
          <button
            onClick={() => window.location.href = '/knowledge'}
            style={{ padding: '14px 36px', borderRadius: 16, background: 'linear-gradient(90deg,#6a5cff,#a685ff)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px #a79cff44', letterSpacing: '0.5px' }}
          >
            Zakończ
          </button>
        ) : (
          <>
            <button
              disabled={isFirst}
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              style={{ padding: '12px 24px', borderRadius: 12, background: '#eee', color: '#6a5cff', fontWeight: 700, fontSize: 16, border: 'none', cursor: isFirst ? 'default' : 'pointer' }}
            >
              Wstecz
            </button>
            <button
              onClick={() => setIndex(i => Math.min(steps.length - 1, i + 1))}
              style={{ padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(90deg,#6a5cff,#a685ff)', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}
            >
              Dalej
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default GroundingGuide;
