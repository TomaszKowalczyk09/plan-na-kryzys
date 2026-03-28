import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getHotlines } from '../data/hotlines'
import { StoryScreen } from '../components/StoryUI'
import { useI18n } from '../i18n/index.jsx'

export default function CrisisPage() {
  const { lang, t } = useI18n()
  const hotlines = useMemo(() => getHotlines(lang), [lang])

  const primaryHotline = hotlines[0]
  const secondaryHotline = hotlines[1]
  const tertiaryHotline = hotlines[2]

  const callHref = (phone) => `tel:${String(phone ?? '').replace(/[^\d+]/g, '')}`

  return (
    <StoryScreen variant="light" className="pageAnim crisisVioletPage">
      <section className="pageAnimItem crisisVioletBreathing">
        <div className="crisisVioletBreathingInner">
          <h2>{t('crisisPage.breatheTitle', 'Breathe with us')}</h2>
          <p>{t('crisisPage.breatheLead', 'Follow the light. Soften your shoulders.')}</p>

          <div className="crisisVioletOrbWrap" aria-hidden="true">
            <div className="crisisVioletOrbGlow" />
            <div className="crisisVioletOrbCenter">
              <span>{t('crisisPage.inhale', 'Inhale')}</span>
            </div>
          </div>

          <div className="crisisVioletPager" aria-hidden="true">
            <span className="isActive" />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="pageAnimItem crisisVioletSection">
        <div className="crisisVioletSectionHead">
          <h3>{t('crisisPage.immediateSupport', 'Immediate support')}</h3>
        </div>

        {primaryHotline ? (
          <a className="crisisVioletPrimaryCall" href={callHref(primaryHotline.phone)}>
            <div>
              <strong>{primaryHotline.name}</strong>
              <span>{primaryHotline.note}</span>
            </div>
            <span className="icon">📞</span>
          </a>
        ) : null}

        <div className="crisisVioletMiniGrid">
          {secondaryHotline ? (
            <a className="crisisVioletMiniCard" href={callHref(secondaryHotline.phone)}>
              <span className="icon">➕</span>
              <strong>{secondaryHotline.name}</strong>
            </a>
          ) : null}

          {tertiaryHotline ? (
            <a className="crisisVioletMiniCard" href={callHref(tertiaryHotline.phone)}>
              <span className="icon">❤</span>
              <strong>{tertiaryHotline.name}</strong>
            </a>
          ) : null}
        </div>
      </section>

      <section className="pageAnimItem crisisVioletSection">
        <div className="crisisVioletSectionHead rowBetween">
          <h3>{t('crisisPage.groundingTools', 'Grounding tools')}</h3>
          <Link to="/knowledge/grounding" className="crisisVioletViewAll">
            {t('crisisPage.viewAll', 'View all')}
          </Link>
        </div>

        <article className="crisisVioletToolCard crisisVioletToolCardMain">
          <div>
            <h4>5-4-3-2-1</h4>
            <p>{t('crisisPage.tool54321', 'Engage your senses to return to the present moment.')}</p>
          </div>
          <Link to="/knowledge/grounding" className="crisisVioletToolBtn">
            {t('crisisPage.startGuide', 'Start guide')}
          </Link>
          <span className="watermark" aria-hidden="true">◉</span>
        </article>

        <article className="crisisVioletToolCard crisisVioletToolCardBox">
          <div className="icon">▣</div>
          <h4>{t('crisisPage.boxBreath', 'Box breath')}</h4>
          <p>{t('crisisPage.boxBreathDesc', '4s in, 4s hold, 4s out, 4s hold.')}</p>
          <div className="progress"><div /></div>
        </article>

        <Link to="/crisis/cssrs" className="crisisVioletToolRow">
          <div className="left">
            <div className="icon">🧍</div>
            <div>
              <h4>{t('crisisPage.muscleRelaxation', 'Muscle relaxation')}</h4>
              <p>{t('crisisPage.muscleRelaxationDesc', 'Tense and release your body')}</p>
            </div>
          </div>
          <span className="arrow">›</span>
        </Link>
      </section>

      <section className="pageAnimItem crisisVioletQuoteBanner">
        <p>{t('crisisPage.quote', 'This feeling is temporary. You are safe.')}</p>
      </section>
    </StoryScreen>
  )
}
