import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { KNOWLEDGE_ARTICLES } from '../data/knowledge'
import { StoryScreen } from '../components/StoryUI'
import { useI18n } from '../i18n'

const CATEGORY_PRESETS = [
  { id: 'anxiety', icon: '🧠', tone: 'primary' },
  { id: 'depression', icon: '🙂', tone: 'secondary' },
  { id: 'selfcare', icon: '🫧', tone: 'tertiary' },
  { id: 'sobriety', icon: '🌱', tone: 'neutral' },
]

const QUICK_TIPS = [
  {
    id: '478',
    icon: '💧',
    title: 'Reguła 4-7-8',
    body: 'Wdech 4, zatrzymanie 7, wydech 8. Szybko wycisza układ nerwowy.',
    tag: 'Szybka ulga',
  },
  {
    id: 'sun',
    icon: '☀️',
    title: 'Poranne światło',
    body: '10 minut dziennego światła rano pomaga ustabilizować nastrój i sen.',
    tag: 'Nawyk dnia',
  },
  {
    id: 'dump',
    icon: '📝',
    title: 'Zrzut myśli',
    body: 'Przed snem zapisz wszystkie natrętne myśli. Mózg łatwiej odpuści napięcie.',
    tag: 'Lepszy sen',
  },
]

function articleReadTime(article) {
  const wordCount = article.body.join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(2, Math.round(wordCount / 45))
}

export default function KnowledgePage() {
  const { t, get } = useI18n()
  const localizedArticles = get('data.knowledgeArticles', KNOWLEDGE_ARTICLES)
  const [query, setQuery] = useState('')

  const visibleArticles = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return localizedArticles
    return localizedArticles.filter((a) => {
      const haystack = `${a.title} ${a.body.join(' ')}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [localizedArticles, query])

  const featured = visibleArticles[0]
  const rightCards = visibleArticles.slice(1, 3)
  const bottomFeatured = visibleArticles[3]
  const categories = CATEGORY_PRESETS.map((c, i) => ({
    ...c,
    label: visibleArticles[i]?.title?.split('—')[0]?.trim() || t('knowledge.categoryFallback', 'Wiedza'),
  }))

  return (
    <StoryScreen variant="violet" className="knowledgeVioletPage pageAnim">
      <style>{`
        .knowledgeVioletPage .storyScreenInner {
          display: grid;
          gap: 18px;
          max-width: 1160px;
          margin: 0 auto;
        }
        .knowledgeVioletHero {
          display: grid;
          gap: 12px;
          background: var(--surface-container-low);
          border: 1px solid color-mix(in srgb, var(--outline-variant) 70%, transparent);
          border-radius: 18px;
          padding: 14px;
        }
        .knowledgeVioletHeroTop {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .knowledgeVioletHeroTop img {
          width: 38px;
          height: 38px;
          object-fit: contain;
        }
        .knowledgeVioletHeroTop h1 {
          margin: 0;
          font-size: clamp(22px, 8vw, 54px);
          line-height: 0.95;
          letter-spacing: -0.04em;
        }
        .knowledgeVioletLead {
          margin: 0;
          color: var(--on-surface-variant);
          font-weight: 650;
          font-size: 14px;
          line-height: 1.5;
          max-width: 62ch;
        }
        .knowledgeVioletSearchWrap {
          position: relative;
        }
        .knowledgeVioletSearchWrap input {
          width: 100%;
          border: none;
          background: var(--surface-container-high);
          border-radius: 16px;
          padding: 14px 16px 14px 46px;
          color: var(--on-surface);
          font: inherit;
        }
        .knowledgeVioletSearchWrap input:focus {
          outline: 2px solid color-mix(in srgb, var(--primary) 70%, transparent);
        }
        .knowledgeVioletSearchIcon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--outline);
        }
        .knowledgeVioletHeroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .knowledgeVioletBtn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 11px 16px;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          justify-content: center;
          min-height: 42px;
          width: 100%;
        }
        .knowledgeVioletBtnPrimary {
          background: var(--primary);
          color: var(--on-primary);
          box-shadow: 0 12px 30px -14px rgba(108, 67, 185, 0.45);
        }
        .knowledgeVioletBtnGhost {
          border: 1px solid color-mix(in srgb, var(--outline-variant) 80%, transparent);
          color: var(--on-surface);
          background: var(--surface-container-lowest);
        }
        .knowledgeVioletSectionHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }
        .knowledgeVioletSectionHead h2 {
          margin: 0;
          font-size: clamp(26px, 6.6vw, 30px);
          letter-spacing: -0.03em;
        }
        .knowledgeVioletInlineLink {
          color: var(--primary);
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-left: auto;
          white-space: nowrap;
        }
        .knowledgeVioletCategories {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .knowledgeVioletCategory {
          border-radius: 18px;
          min-height: 132px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }
        .knowledgeVioletCategory h3 {
          margin: 0;
          font-size: clamp(16px, 4.2vw, 19px);
          line-height: 1.18;
          letter-spacing: -0.02em;
          max-width: 22ch;
          overflow-wrap: anywhere;
          position: relative;
          z-index: 1;
        }
        .knowledgeVioletCategoryIcon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: color-mix(in srgb, var(--surface-container-lowest) 70%, transparent);
          font-size: 18px;
        }
        .knowledgeVioletCategory::after {
          content: '';
          position: absolute;
          width: 120px;
          height: 120px;
          right: -42px;
          bottom: -42px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--primary) 14%, transparent);
        }
        .knowledgeVioletCategory.isPrimary {
          background: color-mix(in srgb, var(--primary-container) 88%, white);
          color: var(--on-primary-container);
        }
        .knowledgeVioletCategory.isSecondary {
          background: color-mix(in srgb, var(--secondary-container) 88%, white);
          color: var(--on-secondary-container);
        }
        .knowledgeVioletCategory.isTertiary {
          background: color-mix(in srgb, var(--tertiary-container) 88%, white);
          color: var(--on-tertiary-container);
        }
        .knowledgeVioletCategory.isNeutral {
          background: var(--surface-container-highest);
          color: var(--on-surface);
        }
        .knowledgeVioletArticles {
          display: grid;
          gap: 12px;
        }
        .knowledgeVioletFeatured {
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--outline-variant) 70%, transparent);
          background: var(--surface-container-lowest);
        }
        .knowledgeVioletFeaturedMedia {
          min-height: 190px;
          background:
            radial-gradient(circle at 84% 20%, rgba(88, 134, 80, 0.9), transparent 34%),
            linear-gradient(165deg, #d5a26a 0%, #b3773c 55%, #8f5d2f 100%);
        }
        .knowledgeVioletFeaturedBody {
          padding: 14px;
          display: grid;
          gap: 8px;
        }
        .knowledgeVioletMeta {
          margin: 0;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--primary);
          font-weight: 800;
        }
        .knowledgeVioletFeaturedBody h3 {
          margin: 0;
          font-size: clamp(22px, 6.6vw, 54px);
          line-height: 0.95;
          letter-spacing: -0.04em;
          overflow-wrap: anywhere;
        }
        .knowledgeVioletFeaturedBody p {
          margin: 0;
          color: var(--on-surface-variant);
          line-height: 1.45;
        }
        .knowledgeVioletReadLink {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--primary);
          text-decoration: none;
          font-weight: 800;
        }
        .knowledgeVioletCompactGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr;
        }
        .knowledgeVioletCompact {
          border-radius: 18px;
          border: 1px solid color-mix(in srgb, var(--outline-variant) 70%, transparent);
          background: var(--surface-container-low);
          padding: 14px;
          display: grid;
          gap: 8px;
        }
        .knowledgeVioletCompact h4 {
          margin: 0;
          font-size: clamp(20px, 5.8vw, 28px);
          line-height: 0.95;
          letter-spacing: -0.04em;
          overflow-wrap: anywhere;
        }
        .knowledgeVioletBottomFeatured {
          border-radius: 18px;
          overflow: hidden;
          position: relative;
          min-height: 212px;
          display: flex;
          align-items: flex-end;
          padding: 16px;
          background:
            linear-gradient(to top, rgba(34, 28, 56, 0.92), rgba(34, 28, 56, 0.2)),
            linear-gradient(165deg, #a9d2ff 0%, #5d82c9 50%, #3d3f86 100%);
        }
        .knowledgeVioletBottomFeatured h4,
        .knowledgeVioletBottomFeatured p {
          margin: 0;
          color: #fff;
        }
        .knowledgeVioletBottomFeatured h4 {
          margin-bottom: 6px;
        }
        .knowledgeVioletTips {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(92%, 1fr);
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
          scroll-snap-type: x mandatory;
        }
        .knowledgeVioletTips::-webkit-scrollbar {
          display: none;
        }
        .knowledgeVioletTip {
          background: var(--surface-container-lowest);
          border: 1px solid color-mix(in srgb, var(--outline-variant) 70%, transparent);
          border-radius: 18px;
          padding: 14px;
          display: grid;
          gap: 10px;
          scroll-snap-align: start;
        }
        .knowledgeVioletTipTop {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 16px;
          background: color-mix(in srgb, var(--primary-container) 72%, white);
        }
        .knowledgeVioletTip h5 {
          margin: 0;
          font-size: 18px;
        }
        .knowledgeVioletTip p {
          margin: 0;
          font-size: 14px;
          color: var(--on-surface-variant);
          line-height: 1.45;
        }
        .knowledgeVioletTipTag {
          margin-top: 2px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--outline);
          font-weight: 800;
        }
        @media (max-width: 380px) {
          .knowledgeVioletCategories {
            grid-template-columns: 1fr;
          }
          .knowledgeVioletSectionHead {
            align-items: center;
          }
          .knowledgeVioletInlineLink {
            font-size: 11px;
            letter-spacing: 0.04em;
          }
          .knowledgeVioletCategory {
            min-height: 136px;
          }
          .knowledgeVioletCategory h3 {
            font-size: 16px;
          }
        }
        @media (min-width: 560px) {
          .knowledgeVioletBtn {
            width: auto;
            font-size: 12px;
          }
          .knowledgeVioletTips {
            grid-auto-columns: minmax(300px, 1fr);
          }
        }
        @media (min-width: 720px) {
          .knowledgeVioletPage .storyScreenInner {
            gap: 24px;
          }
          .knowledgeVioletHero {
            gap: 14px;
            border-radius: 24px;
            padding: 20px;
          }
          .knowledgeVioletCategories {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (min-width: 1060px) {
          .knowledgeVioletCategories {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
          .knowledgeVioletArticles {
            grid-template-columns: repeat(12, minmax(0, 1fr));
          }
          .knowledgeVioletFeatured {
            grid-column: span 7;
          }
          .knowledgeVioletCompactGrid {
            grid-column: span 5;
          }
          .knowledgeVioletBottomFeatured {
            grid-column: span 12;
          }
        }
      `}</style>

      <section className="knowledgeVioletHero pageAnimItem">
        <div className="knowledgeVioletHeroTop">
          <img src="/unnamed-removebg-preview.png" alt="Logo" />
          <h1>
            {t('knowledge.hubTitleA', 'Knowledge')}<br />
            {t('knowledge.hubTitleB', 'Hub')}
          </h1>
        </div>
        <p className="knowledgeVioletLead">
          {t('knowledge.hubLead', 'Baza krótkich treści, które pomagają wrócić do równowagi. Gdy czujesz, że narasta napięcie, przejdź do zakładki Kryzys.')}
        </p>
        <div className="knowledgeVioletSearchWrap">
          <span className="knowledgeVioletSearchIcon" aria-hidden="true">⌕</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('knowledge.searchPlaceholder', 'Szukaj krótkich treści...')}
            aria-label={t('knowledge.searchAria', 'Szukaj w bazie wiedzy')}
          />
        </div>
        <div className="knowledgeVioletHeroActions">
          <Link to="/knowledge/grounding" className="knowledgeVioletBtn knowledgeVioletBtnPrimary">
            {t('knowledge.groundingGuide', 'Uziemienie: przewodnik')}
          </Link>
          <Link to="/crisis" className="knowledgeVioletBtn knowledgeVioletBtnGhost">
            {t('knowledge.toCrisis', 'Przejdź do kryzysu')}
          </Link>
        </div>
      </section>

      <section className="pageAnimItem">
        <div className="knowledgeVioletSectionHead">
          <h2>{t('knowledge.categories', 'Kategorie')}</h2>
          <span className="knowledgeVioletInlineLink">{t('knowledge.viewAll', 'Pokaż wszystko')}</span>
        </div>
        <div className="knowledgeVioletCategories" style={{ marginTop: 12 }}>
          {categories.map((cat) => (
            <article key={cat.id} className={`knowledgeVioletCategory is${cat.tone[0].toUpperCase()}${cat.tone.slice(1)}`}>
              <span className="knowledgeVioletCategoryIcon" aria-hidden="true">{cat.icon}</span>
              <h3>{cat.label}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="pageAnimItem">
        <div className="knowledgeVioletSectionHead">
          <h2>{t('knowledge.shortPieces', 'Short Pieces')}</h2>
        </div>

        <div className="knowledgeVioletArticles" style={{ marginTop: 12 }}>
          {featured ? (
            <article className="knowledgeVioletFeatured">
              <div className="knowledgeVioletFeaturedMedia" />
              <div className="knowledgeVioletFeaturedBody">
                <p className="knowledgeVioletMeta">{articleReadTime(featured)} min czytania</p>
                <h3>{featured.title}</h3>
                <p>{featured.body[0]}</p>
                <Link to="/knowledge/grounding" className="knowledgeVioletReadLink">
                  {t('knowledge.readArticle', 'Czytaj')}
                </Link>
              </div>
            </article>
          ) : null}

          <div className="knowledgeVioletCompactGrid">
            {rightCards.map((article) => (
              <article key={article.id} className="knowledgeVioletCompact">
                <p className="knowledgeVioletMeta">{articleReadTime(article)} min czytania</p>
                <h4>{article.title}</h4>
                <p>{article.body[0]}</p>
                <span className="knowledgeVioletReadLink">{t('knowledge.saveForLater', 'Zapisz na później')}</span>
              </article>
            ))}
          </div>

          {bottomFeatured ? (
            <article className="knowledgeVioletBottomFeatured">
              <div>
                <p className="knowledgeVioletMeta" style={{ color: 'rgba(235, 220, 255, 0.95)' }}>
                  {articleReadTime(bottomFeatured)} min czytania
                </p>
                <h4>{bottomFeatured.title}</h4>
                <p>{bottomFeatured.body[0]}</p>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      <section className="pageAnimItem">
        <div className="knowledgeVioletSectionHead">
          <h2>{t('knowledge.quickTips', 'Quick Tips')}</h2>
        </div>
        <div className="knowledgeVioletTips" style={{ marginTop: 12 }}>
          {QUICK_TIPS.map((tip) => (
            <article key={tip.id} className="knowledgeVioletTip">
              <div className="knowledgeVioletTipTop" aria-hidden="true">{tip.icon}</div>
              <h5>{tip.title}</h5>
              <p>{tip.body}</p>
              <div className="knowledgeVioletTipTag">{tip.tag}</div>
            </article>
          ))}
        </div>
      </section>
    </StoryScreen>
  )
}
