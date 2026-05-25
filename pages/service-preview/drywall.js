import ServicePreviewDetail from './[id]';
import { getDb } from '../../lib/db';

export default ServicePreviewDetail;

export async function getServerSideProps() {
    const service = {
        id: 10,
        title: 'Drywall Services',
        description: 'Bad drywall work shows in every shadow, every crack, every uneven patch. Our team delivers installations and repairs that are smooth, straight, and built to hold. Whether it\'s a small hole or an entire room, the result is always paint-ready and professional.',
        header_desc: 'Our team handles drywall at every scale from single-hole patches and water damage repairs to full room installations for remodels and additions. We approach every job with the same standard: tape, mud, sand, and finish until the wall is genuinely flat, genuinely smooth, and genuinely ready for paint. No skimping on coats of compound. No rushing the dry time between passes. No calling a job done when it\'s merely acceptable.\nTexture matching is one of the most underestimated drywall skills. If your home has orange peel, knockdown, skip trowel, or any other texture, a patch that doesn\'t match stands out immediately especially once painted. We take the time to match your existing texture as closely as possible, whether replicating an older spray texture or hand-applying a custom finish. When a repair blends in completely, that\'s what success looks like.\nWhether it\'s a nail pop, water-damaged section, full room renovation, or popcorn ceiling removal every drywall job we do is built to the standard that makes everything above it look its best.',
        image_url: '/uploads/Instalaci-n-de-drywall-profesional-en-progreso-1775675987609.png',
        details: 'New drywall installation complete hanging, taping, mudding, and finishing for remodels and additions. Drywall repair from nail pops and hairline cracks to large-section replacements after water or impact damage. Texture work orange peel, knockdown, smooth, popcorn removal we match what\'s already there.',
        slug: 'drywall',
        page_title: 'From new installations to seamless repairs our drywall work sets the foundation for a flawless interior.',
        subtitle: 'Smooth Walls. Perfect Finish.',
        ksp_title_1: 'New installation',
        ksp_desc_1: 'Full drywall framing and hanging for new builds or additions.',
        ksp_title_2: 'Repairs & patching',
        ksp_desc_2: 'Holes, cracks, and water damage we make it disappear.',
        ksp_title_3: 'Texture matching',
        ksp_desc_3: 'We match your existing wall texture so repairs are invisible.',
        ksp_title_4: 'Paint-ready finish',
        ksp_desc_4: 'Smooth, sanded, and primed ready for the final coat.',
        process_desc: 'Drywall is the canvas for everything that comes after paint, trim, fixtures. A flawless finish starts with solid drywall work. We tape, mud, and sand with the attention that makes the difference between a wall that looks good and one that looks professionally built.',
        faq_q_1: 'Q: Can you match my existing wall texture?',
        faq_a_1: 'Yes. Texture matching is a core part of our repair work. We assess the existing surface and replicate it closely.',
        faq_q_2: 'Q: How long before the drywall is ready to paint?',
        faq_a_2: 'Typically 24–48 hours after final coat and sanding, depending on conditions.',
        faq_q_3: 'Q: Do you handle water-damaged drywall?',
        faq_a_3: 'Yes. We assess for mold, remove damaged sections, and replace with fresh material coordinating with our mitigation team if needed.',
        faq_q_4: '',
        faq_a_4: '',
        faq_q_5: '',
        faq_a_5: '',
    };

    let randomProjects = [];
    try {
        const db = await getDb();
        const projectsResult = await db.execute(
            'SELECT id, title, description, image FROM projects ORDER BY RANDOM() LIMIT 3'
        );
        randomProjects = (projectsResult.rows || []).map((p) => ({
            id: p.id,
            title: p.title || '',
            description: p.description || '',
            image: p.image || '',
        }));
    } catch (e) {
        console.error('drywall preview: projects fetch failed', e);
    }

    return {
        props: {
            service,
            randomProjects,
            errorMessage: null,
        },
    };
}
