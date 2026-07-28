import Link from 'next/link';
import Layout from '../components/Layout';
import { useLang } from '../context/LanguageContext';
import homeStyles from '../styles/Home.module.css';

const COVERAGE = [
    { service: 'Siding Installation',        serviceEs: 'Instalación de Revestimiento', years: 5 },
    { service: 'Exterior Painting',           serviceEs: 'Pintura Exterior',              years: 4 },
    { service: 'Decking & Deck Boards',       serviceEs: 'Deck y Tablones',               years: 3 },
    { service: 'Handrails & Guardrails',      serviceEs: 'Pasamanos y Barandas',          years: 3 },
    { service: 'Staining & Sealing',          serviceEs: 'Tinte y Sellado',               years: 2 },
];

const sectionStyle = {
    borderTop: '1px solid var(--border, #e5e7eb)',
    paddingTop: '28px',
    marginTop: '28px',
};

const h2Style = {
    fontFamily: "'Barlow Condensed','Barlow',sans-serif",
    fontWeight: 700,
    fontSize: '1.35rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#C5A028',
    marginBottom: '12px',
};

const ulStyle = {
    paddingLeft: '20px',
    lineHeight: 1.75,
};

const stepStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '10px',
};

export default function Warranty() {
    const { t, lang } = useLang();
    const isEs = lang === 'es';

    return (
        <Layout
            title={isEs
                ? 'Garantía de Mano de Obra | J&R NW Construction | Portland, OR'
                : 'Workmanship Warranty | J&R NW Construction | Portland, OR'}
            description={isEs
                ? 'J&R NW Construction respalda cada trabajo con hasta 5 años de garantía de mano de obra. Revestimiento, pintura, deck y más. CCB #232708.'
                : 'J&R NW Construction backs every job with up to 5 years of workmanship warranty. Siding, painting, decking, and more. CCB #232708.'}
            canonical="/warranty"
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
                    {isEs ? 'CCB #232708 · Portland, OR' : 'CCB #232708 · Portland, OR'}
                </p>
                <h1 style={{
                    fontFamily: "'Barlow Condensed','Barlow',sans-serif",
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    marginBottom: '16px',
                }}>
                    {isEs ? 'Nuestra Garantía de' : 'Our Workmanship'}
                    {' '}
                    <span style={{ color: '#C5A028' }}>
                        {isEs ? 'Mano de Obra' : 'Warranty'}
                    </span>
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', opacity: 0.85, maxWidth: '580px', margin: '0 auto' }}>
                    {isEs
                        ? 'Respaldamos nuestro trabajo — hasta 5 años de cobertura de mano de obra.'
                        : 'We stand behind our work — up to 5 years of workmanship coverage.'}
                </p>
            </section>

            {/* Content */}
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(32px,6vw,60px) 24px clamp(48px,8vw,80px)' }}>

                {/* Coverage summary table */}
                <h2 style={h2Style}>
                    {isEs ? 'Resumen de Cobertura' : 'Coverage Summary'}
                </h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                        <thead>
                            <tr style={{ background: '#C5A028', color: '#1B2A44' }}>
                                <th style={{ padding: '10px 14px', textAlign: 'left', fontFamily: "'Barlow Condensed','Barlow',sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    {isEs ? 'Servicio' : 'Service'}
                                </th>
                                <th style={{ padding: '10px 14px', textAlign: 'center', fontFamily: "'Barlow Condensed','Barlow',sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    {isEs ? 'Cobertura' : 'Coverage'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {COVERAGE.map((row, i) => (
                                <tr key={row.service} style={{ background: i % 2 === 0 ? 'var(--bg-stripe, rgba(197,160,40,0.06))' : 'transparent' }}>
                                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border, #e5e7eb)' }}>
                                        {isEs ? row.serviceEs : row.service}
                                    </td>
                                    <td style={{ padding: '10px 14px', textAlign: 'center', borderBottom: '1px solid var(--border, #e5e7eb)', fontWeight: 700, color: '#C5A028', fontFamily: "'Barlow Condensed','Barlow',sans-serif", fontSize: '1rem' }}>
                                        {row.years} {isEs ? 'años' : 'years'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p style={{ marginTop: '12px', fontSize: '0.85rem', opacity: 0.65, lineHeight: 1.6 }}>
                    {isEs
                        ? 'Los términos varían según el servicio. Términos completos abajo. Las garantías para otros servicios se incluyen en su contrato de proyecto.'
                        : 'Warranty terms vary by service. Full terms below. Warranties for other services are provided in your project contract.'}
                </p>

                {/* What Is Covered */}
                <section style={sectionStyle}>
                    <h2 style={h2Style}>{isEs ? 'Qué Está Cubierto' : 'What Is Covered'}</h2>
                    <p style={{ lineHeight: 1.75 }}>
                        {isEs
                            ? 'Esta garantía cubre defectos de mano de obra realizados por J&R NW Construction LLC. Si el trabajo falla debido a un defecto de instalación, fijación, sellado o técnica de aplicación durante el período de garantía, repararemos o rehacemos la parte afectada sin costo alguno.'
                            : 'This warranty covers defects in workmanship performed by J&R NW Construction LLC. If work fails due to a defect in installation, fastening, sealing, or application technique during the warranty period, we will repair or redo the affected portion at no charge.'}
                    </p>
                </section>

                {/* What Is Not Covered */}
                <section style={sectionStyle}>
                    <h2 style={h2Style}>{isEs ? 'Qué No Está Cubierto' : 'What Is Not Covered'}</h2>
                    {isEs ? (
                        <ul style={ulStyle}>
                            <li>Defectos de materiales/productos (cubre la garantía del fabricante)</li>
                            <li>Actos de la naturaleza: inundaciones, granizo, viento, incendio, terremoto</li>
                            <li>Desgaste normal, oxidación o decoloración dentro de las especificaciones del producto</li>
                            <li>Alteraciones o reparaciones realizadas por terceros no autorizados</li>
                            <li>Falta de mantenimiento (canaletas tapadas, falta de mantenimiento de selladores)</li>
                            <li>Defectos ocultos preexistentes no revelados al inicio del proyecto</li>
                            <li>Daños por plagas o moho originados fuera del alcance del proyecto</li>
                        </ul>
                    ) : (
                        <ul style={ulStyle}>
                            <li>Material or product defects (covered by the manufacturer&apos;s warranty)</li>
                            <li>Acts of nature: flooding, hail, wind, fire, earthquake</li>
                            <li>Normal weathering, oxidation, or fading within product specifications</li>
                            <li>Alterations or repairs made by unauthorized third parties</li>
                            <li>Failure to maintain (clogged gutters, neglected caulk maintenance)</li>
                            <li>Pre-existing hidden defects not disclosed at project start</li>
                            <li>Damage from pests or mold originating outside the project scope</li>
                        </ul>
                    )}
                </section>

                {/* How to File a Claim */}
                <section style={sectionStyle}>
                    <h2 style={h2Style}>{isEs ? 'Cómo Presentar un Reclamo' : 'How to File a Warranty Claim'}</h2>
                    {[
                        isEs
                            ? ['1', 'Llámenos al (503) 998-2340 o envíe un correo a jandrnwconstruction@gmail.com']
                            : ['1', 'Call (503) 998-2340 or email jandrnwconstruction@gmail.com'],
                        isEs
                            ? ['2', 'Describa el defecto y cuándo apareció por primera vez']
                            : ['2', 'Describe the defect and when it first appeared'],
                        isEs
                            ? ['3', 'Programaremos una inspección en el sitio dentro de 5 días hábiles']
                            : ['3', 'We will schedule an on-site inspection within 5 business days'],
                        isEs
                            ? ['4', 'Si el reclamo está cubierto, el trabajo de reparación se programa sin costo']
                            : ['4', 'If the claim is covered, repair work will be scheduled at no charge'],
                    ].map(([num, text]) => (
                        <div key={num} style={stepStyle}>
                            <span style={{
                                minWidth: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: '#C5A028',
                                color: '#1B2A44',
                                fontFamily: "'Barlow Condensed','Barlow',sans-serif",
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginTop: '2px',
                            }}>
                                {num}
                            </span>
                            <p style={{ margin: 0, lineHeight: 1.65 }}>{text}</p>
                        </div>
                    ))}
                </section>

                {/* Transferability */}
                <section style={sectionStyle}>
                    <h2 style={h2Style}>{isEs ? 'Transferibilidad' : 'Transferability'}</h2>
                    <p style={{ lineHeight: 1.75 }}>
                        {isEs
                            ? 'Esta garantía está vinculada a la dirección de la propiedad, no al cliente original, y es totalmente transferible a nuevos propietarios durante el período de garantía. Se requiere notificación escrita a J&R NW Construction al momento de la transferencia.'
                            : 'This warranty is attached to the property address, not the original client, and is fully transferable to new owners during the warranty period. Written notice to J&R NW Construction is required upon transfer.'}
                    </p>
                </section>

                {/* Limitation of Liability */}
                <section style={sectionStyle}>
                    <h2 style={h2Style}>{isEs ? 'Limitación de Responsabilidad' : 'Limitation of Liability'}</h2>
                    <p style={{ lineHeight: 1.75 }}>
                        {isEs
                            ? 'La responsabilidad bajo esta garantía se limita exclusivamente a la reparación o reemplazo de la mano de obra defectuosa. J&R NW Construction no será responsable por daños incidentales, consecuentes o indirectos.'
                            : 'Liability under this warranty is limited to repair or replacement of defective workmanship only. J&R NW Construction is not liable for incidental, consequential, or indirect damages.'}
                    </p>
                </section>

                {/* Manufacturer Warranties */}
                <section style={sectionStyle}>
                    <h2 style={h2Style}>{isEs ? 'Garantías del Fabricante' : 'Manufacturer Warranties'}</h2>
                    <p style={{ lineHeight: 1.75 }}>
                        {isEs
                            ? 'Los productos instalados pueden contar con garantías separadas del fabricante. J&R NW Construction asistirá con la documentación para reclamos de garantía del fabricante cuando corresponda.'
                            : 'Products installed in your project may carry separate manufacturer warranties. J&R NW Construction will assist with manufacturer warranty claim documentation where applicable.'}
                    </p>
                </section>

                {/* CTA */}
                <section style={{
                    ...sectionStyle,
                    marginTop: '48px',
                    paddingTop: '40px',
                    textAlign: 'center',
                }}>
                    <p style={{
                        fontFamily: "'Barlow Condensed','Barlow',sans-serif",
                        fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                        fontWeight: 700,
                        marginBottom: '8px',
                    }}>
                        {isEs ? '¿Listo para empezar?' : 'Ready to get started?'}
                    </p>
                    <p style={{ opacity: 0.65, marginBottom: '28px', lineHeight: 1.6 }}>
                        {isEs
                            ? 'Obtenga un estimado gratuito detallado. Sin compromisos.'
                            : 'Get a detailed free estimate. No obligation.'}
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
                </section>
            </div>
        </Layout>
    );
}
