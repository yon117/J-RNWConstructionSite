import Link from 'next/link';
import Layout from '../components/Layout';
import { useLang } from '../context/LanguageContext';
import homeStyles from '../styles/Home.module.css';

const STEPS = [
    {
        num: '01',
        en: {
            title: 'Free Estimate & Consultation',
            desc: 'We visit your property, listen to your goals, and provide a free detailed estimate. No sales pitch — just a real conversation about what you need and what it will take.',
        },
        es: {
            title: 'Estimado Gratuito y Consulta',
            desc: 'Visitamos su propiedad, escuchamos sus objetivos y le proporcionamos un estimado detallado y gratuito. Sin discurso de ventas — solo una conversación real sobre lo que necesita.',
        },
    },
    {
        num: '02',
        en: {
            title: 'Clear Proposal & Timeline',
            desc: 'You get a written scope, price, and schedule. No surprises, no hidden costs. You know exactly what to expect before a single nail goes in.',
        },
        es: {
            title: 'Propuesta Clara y Cronograma',
            desc: 'Recibirá un alcance escrito, precio y calendario. Sin sorpresas ni costos ocultos. Usted sabe exactamente qué esperar antes de que comience cualquier trabajo.',
        },
    },
    {
        num: '03',
        en: {
            title: 'Licensed & Insured Work Begins',
            desc: 'Our crew (CCB# 232708) gets to work, treating your home with the same care and respect we would our own. Fully licensed, bonded, and insured on every job.',
        },
        es: {
            title: 'Comienza el Trabajo Licenciado y Asegurado',
            desc: 'Nuestro equipo (CCB# 232708) comienza a trabajar, tratando su hogar con el mismo cuidado y respeto que le daríamos al nuestro. Completamente licenciados, garantizados y asegurados en cada trabajo.',
        },
    },
    {
        num: '04',
        en: {
            title: 'Communication Throughout',
            desc: 'Regular updates so you always know where your project stands. We answer calls, reply to messages, and never leave you wondering what is happening on your own property.',
        },
        es: {
            title: 'Comunicación Constante',
            desc: 'Actualizaciones regulares para que siempre sepa cómo va su proyecto. Atendemos llamadas, respondemos mensajes y nunca lo dejamos preguntándose qué está pasando en su propiedad.',
        },
    },
    {
        num: '05',
        en: {
            title: 'Final Walkthrough & Warranty',
            desc: null,
            descNode: true,
        },
        es: {
            title: 'Revisión Final y Garantía',
            desc: null,
            descNode: true,
        },
    },
];

export default function OurProcess() {
    const { t, lang } = useLang();
    const isEs = lang === 'es';

    return (
        <Layout
            title={isEs
                ? 'Nuestro Proceso | J&R NW Construction | Portland, OR'
                : 'Our Process | J&R NW Construction | Portland, OR'}
            description={isEs
                ? 'Así trabajamos en J&R NW Construction: estimado gratis, propuesta clara, trabajo licenciado, comunicación constante y garantía de mano de obra.'
                : 'How J&R NW Construction works: free estimate, clear proposal, licensed crew, communication throughout, and a written workmanship warranty.'}
            canonical="/our-process"
        >
            {/* Hero */}
            <section style={{
                background: 'var(--bg-alt, #1B2A44)',
                color: '#fff',
                padding: 'clamp(40px, 8vw, 80px) 24px clamp(32px, 6vw, 60px)',
                textAlign: 'center',
            }}>
                <p style={{
                    fontFamily: "'Barlow Condensed','Barlow',sans-serif",
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#C5A028',
                    marginBottom: '12px',
                }}>
                    CCB #232708 · Portland, OR
                </p>
                <h1 style={{
                    fontFamily: "'Barlow Condensed','Barlow',sans-serif",
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    marginBottom: '16px',
                }}>
                    {isEs ? 'Nuestro' : 'Our'}{' '}
                    <span style={{ color: '#C5A028' }}>
                        {isEs ? 'Proceso' : 'Process'}
                    </span>
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', opacity: 0.85, maxWidth: '520px', margin: '0 auto' }}>
                    {isEs
                        ? 'Simple, transparente y construido alrededor de usted.'
                        : 'Simple, transparent, and built around you.'}
                </p>
            </section>

            {/* Steps */}
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(40px,7vw,72px) 24px clamp(48px,8vw,80px)' }}>
                {STEPS.map((step, i) => {
                    const content = isEs ? step.es : step.en;
                    const isLast = i === STEPS.length - 1;

                    return (
                        <div
                            key={step.num}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '64px 1fr',
                                gap: '0 24px',
                                marginBottom: isLast ? 0 : '0',
                            }}
                        >
                            {/* Number + connector */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '50%',
                                    background: '#C5A028',
                                    color: '#1B2A44',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: "'Barlow Condensed','Barlow',sans-serif",
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    flexShrink: 0,
                                }}>
                                    {step.num}
                                </div>
                                {!isLast && (
                                    <div style={{
                                        width: '2px',
                                        flex: 1,
                                        minHeight: '40px',
                                        background: 'linear-gradient(to bottom, #C5A028 0%, rgba(197,160,40,0.15) 100%)',
                                        margin: '6px 0',
                                    }} />
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ paddingBottom: isLast ? 0 : '36px' }}>
                                <h2 style={{
                                    fontFamily: "'Barlow Condensed','Barlow',sans-serif",
                                    fontWeight: 700,
                                    fontSize: '1.25rem',
                                    letterSpacing: '0.03em',
                                    margin: '12px 0 8px',
                                    lineHeight: 1.2,
                                }}>
                                    {content.title}
                                </h2>

                                {step.num !== '05' ? (
                                    <p style={{ lineHeight: 1.75, opacity: 0.8, margin: 0 }}>
                                        {content.desc}
                                    </p>
                                ) : (
                                    <p style={{ lineHeight: 1.75, opacity: 0.8, margin: 0 }}>
                                        {isEs
                                            ? <>Revisamos cada detalle juntos. No cerramos el trabajo hasta que esté completamente satisfecho. Y su trabajo queda respaldado por nuestra{' '}
                                                <Link href="/warranty" style={{ color: '#C5A028', textDecoration: 'underline' }}>
                                                    garantía de mano de obra por escrito
                                                </Link>.</>
                                            : <>We review everything together. We don&apos;t close out the job until you&apos;re fully satisfied. And your work is backed by our{' '}
                                                <Link href="/warranty" style={{ color: '#C5A028', textDecoration: 'underline' }}>
                                                    written workmanship warranty
                                                </Link>.</>
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* CTA */}
                <div style={{
                    borderTop: '1px solid var(--border, #e5e7eb)',
                    marginTop: '52px',
                    paddingTop: '48px',
                    textAlign: 'center',
                }}>
                    <p style={{
                        fontFamily: "'Barlow Condensed','Barlow',sans-serif",
                        fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                        fontWeight: 700,
                        marginBottom: '8px',
                    }}>
                        {isEs ? '¿Listo para el paso 1?' : 'Ready for step 1?'}
                    </p>
                    <p style={{ opacity: 0.65, marginBottom: '28px', lineHeight: 1.6 }}>
                        {isEs
                            ? 'Agenda tu consulta gratuita hoy. Sin compromisos.'
                            : 'Schedule your free consultation today. No obligation.'}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                        <Link href="/" className={homeStyles.btnPrimary}>
                            {t.getFreeEstimate || 'Get Your Free Estimate'} →
                        </Link>
                        <a
                            href="tel:+15039982340"
                            style={{
                                fontFamily: "'Barlow Condensed','Barlow',sans-serif",
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                color: '#C5A028',
                                textDecoration: 'none',
                                letterSpacing: '0.03em',
                            }}
                        >
                            (503) 998-2340
                        </a>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
