import { FRIEND_GUIDE } from '../data/friendGuide'
import { CloudIcon, StoryCard, StoryScreen } from '../components/StoryUI'

export default function FriendPage() {
  const tellAdult = FRIEND_GUIDE.sections.find((s) => s.title.toLowerCase().includes('kiedy powiedzieć dorosłemu'))
  const otherSections = FRIEND_GUIDE.sections.filter((s) => s !== tellAdult)

  return (
    <StoryScreen variant="light" className="pageAnim">
      <StoryCard tone="surface" className="pageAnimItem">
        <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
          <div>
            <h1 className="storyTitle">
              Dla <span className="storyAccent">przyjaciela</span>
            </h1>
            <p className="storyLead">Jeśli boisz się o czyjeś bezpieczeństwo, poproś dorosłego o pomoc.</p>
          </div>
          <CloudIcon mood="support" label="Wspierająca chmurka" />
        </div>
      </StoryCard>

      {tellAdult ? (
        <StoryCard tone="surface" className="pageAnimItem" style={{ borderColor: 'rgba(109, 94, 252, 0.35)' }}>
          <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
            <div>
              <div className="textStrong" style={{ color: 'var(--t-purple)' }}>Najważniejsze</div>
              <h2 className="sectionTitle" style={{ marginTop: 6 }}>{tellAdult.title}</h2>
            </div>
            <CloudIcon mood="sad" label="Smutna chmurka" />
          </div>
          <div className="stackSm mt12">
            {tellAdult.bullets.map((b) => (
              <div key={b} className="cardInset" style={{ borderLeft: '4px solid var(--t-purple)' }}>
                {b}
              </div>
            ))}
          </div>
          <div className="cardInset" style={{ marginTop: 12, borderLeft: '4px solid var(--t-purple)' }}>
            Jeśli jest bezpośrednie zagrożenie — zadzwoń pod <b>112</b>.
          </div>
        </StoryCard>
      ) : null}

      {otherSections.map((s) => (
        <StoryCard key={s.title} tone="surface" className="pageAnimItem">
          <h2 className="sectionTitle" style={{ fontSize: 20 }}>{s.title}</h2>
          <div className="stackSm mt12">
            {s.bullets.map((b) => (
              <div key={b} className="cardInset">{b}</div>
            ))}
          </div>
        </StoryCard>
      ))}

      <StoryCard tone="glass" className="pageAnimItem">
        <h2 className="sectionTitle" style={{ fontSize: 20 }}>W razie kryzysu</h2>
        <p className="p" style={{ marginTop: 6 }}>Przejdź do zakładki „Kryzys” — są tam kroki i numery pomocy.</p>
      </StoryCard>
    </StoryScreen>
  )
}
