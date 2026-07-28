import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    en: {
        // Nav
        home: 'Home',
        services: 'Services',
        projects: 'Portfolio',
        phoneLabel: 'Phone',
        emailLabel: 'Email',
        licenseLabel: 'CCB',
        menuLabel: 'Open menu',
        switchLanguage: 'Switch language',
        navAvailability: 'Available 24/7 · Licensed · Bonded · Insured · CCB 232708',
        navSubtitle: 'Build Better, Restore Stronger',
        navEstimate: 'Free Estimate',
        getFreeEstimate: 'Get Your Free Estimate',
        callUs: 'Call Us Now!! 24/7 Phone |',

        // Hero
        yourTrusted: "Portland's Trusted",
        generalContractor: 'General Contractor',
        inOregon: 'in Oregon',
        licensed: 'Licensed',
        bonded: 'Bonded',
        insured: 'Insured',
        heroItem1: 'Serving Homes & Businesses for Over 20 Years',
        heroItem2: 'Remodeling · Additions · Siding · Painting',
        heroItem3: 'Drywall · Restoration · Mitigation · Mold',
        heroItem4: 'Structural Support/Repair · Emergency Services',
        lookUsUp: 'Look us up on',
        fullyLicensed: 'Fully Licensed & Insured · 100% Satisfaction Guarantee',
        accredited: 'Accredited',

        // Form (hero & contact modal shared keys)
        requestFreeQuote: 'Request a',
        freeQuote: 'Free Quote',
        fullName: 'Full Name',
        phoneNumber: 'Phone Number',
        emailAddress: 'Email Address',
        email: 'Email',
        projectType: 'Project Type',
        selectServiceType: 'Select Service Type',
        message: 'Message',
        projectDescription: 'Provide a brief description of your project...',
        specifyService: 'Please specify the service you need',
        getFreeEstimateBtn: 'Get Free Estimate →',
        sending: 'Sending...',
        submit: 'Submit',
        fastResponse: '🔒 Fast Response · No Obligation',
        successMsg: "✅ Message sent! We'll be in touch soon.",
        successMsgAlt: 'Message sent successfully!',
        errorMsg: 'Error sending. Please try again.',
        errorMsgAlt: 'Error sending message.',
        validEmailError: 'Please enter a valid email',
        onlyNumbersError: 'Only numbers allowed',

        // Contact section
        getInTouchTitle: 'Get in Touch',
        alwaysReady: 'Always Ready When You Are',
        fromRepairs: 'From Repairs to Full Construction Solutions',
        getFreeEstimateDesc: 'Get a FREE estimate today. We handle interior and exterior construction projects, expert repairs, and preventative solutions—built to last and done right the first time.',
        ourServicesLabel: 'Our Services',
        contactService1: 'Interior & Exterior Construction',
        contactService2: 'General Repairs & Carpentry',
        contactService3: 'Restoration & Reconstruction',
        contactService4: 'Mitigation & Emergency Services',
        serviceArea: 'Service Area',
        yearsExp: 'Years Exp.',
        projectsDone: 'Projects',
        rating: 'Rating',

        // Project types
        pt1: 'Interior Construction & Remodeling',
        ptBath: 'Bathroom Remodel',
        pt2: 'Restoration & Reconstruction',
        pt3: 'Mitigation & Emergency Services',
        pt4: 'General Repairs & Carpentry',
        pt5: 'Paint',
        pt6: 'Siding',
        pt7: 'Drywall',
        pt8: 'Other',

        // About / original hero
        weWorkForYou: 'We Work For You',
        companyDesc: "J&R NW Construction was built the honest way: on the job site, with a crew whose combined experience spans more than 20 years in the trade.\n\nIn those years we saw the same thing again and again: for a family or a business owner, a burst pipe, storm damage, or a remodel gone wrong isn't just a construction problem. It's stress in the place that's supposed to be your refuge. That's why this company exists: to restore not just buildings, but confidence, comfort, and peace of mind.\n\nWe treat every client like family. Whether it's an unexpected emergency or the project you've been dreaming about, we carry the weight of it from the first call to the final walkthrough, so you never have to carry it alone. Our crew walks into your home with the same care and respect they'd give their own — building quality that holds its value for years.\n\nWe don't just repair and remodel. We rebuild trust in the places where your life happens.",
        companyDescSig: 'Julio Ramirez — Founder, J&R NW Construction · CCB #232708',
        companyDescShort: 'Family-owned and operated. Serving Oregon with integrity, craftsmanship, and 20+ years of experience.',
        familyOwned: 'Family-owned — we treat your home like ours.',

        // Floating button & modals
        getEstimate: 'Get Your Free Estimate',
        getInTouch: 'Get in Touch',

        // Footer
        copyright: '© 2026 J&R NW Construction LLC',
        callUsNow: 'Call Us Now!!',

        // FAQ
        faqLabel: 'Got Questions?',
        faqTitle: 'Common Questions',
        faqQ1: 'How fast can you start?',
        faqA1: 'We typically respond within 2 hours and can schedule a free estimate the same or next day. Many emergency jobs start same day.',
        faqQ2: 'How much does it cost?',
        faqA2: 'Every project is different. We offer free, no-obligation estimates with detailed written quotes. No hidden fees, no surprises.',
        faqQ3: 'Are you licensed and insured?',
        faqA3: 'Yes. Oregon CCB #232708. Fully licensed, bonded, and insured. We carry full liability and workers\' compensation coverage on every job.',
        faqQ4: 'Do you work with insurance claims?',
        faqA4: 'Yes. We regularly work alongside insurance adjusters for water damage, fire, and structural repairs. We document everything for your claim.',
        faqQ5: 'What areas do you serve?',
        faqA5: 'Serving Portland, Tigard, Tualatin, Gresham, Happy Valley, Oregon City, Milwaukie, Hillsboro & Beaverton.',
        faqQ6: 'Do you guarantee your work?',
        faqA6: 'Yes — in writing. Our work is backed by a written workmanship warranty of up to 5 years depending on the service (5 years on siding, 4 on painting).',

        // Reviews section
        whatClientsSay: 'What Our Clients Say',
        realReviews: 'Real reviews from real customers',
        loadingReviews: 'Loading reviews...',

        // Projects page
        ourProjects: 'Portfolio',
        portfolioLabel: 'Portfolio',
        projectsIntro: 'We transform spaces and revive structures with expertise and care. Our projects range from restoring the beauty of historical buildings to reconstructing damaged properties.',
        completedProjects: 'Completed Projects',
        photos: 'Photos',
        constructionOregon: 'Construction · Oregon',
        projectDetails: 'Project Details',
        projectsSubtitle: 'Explore some of our completed projects',
        ourWork: 'Our Work',
        viewOurWork: 'View Our Work',
        viewProject: 'View Project →',
        viewAllProjects: 'View All Projects',

        // Services page
        ourServices: 'Our Services',
        servicesIntro: 'Delivering top-tier restoration and construction services with precision, integrity, and a commitment to excellence. Your vision, our expertise.',
        learnMore: 'Learn More →',
        serviceTag1: 'Interior · Residential',
        serviceTag2: 'Exterior · Protection',
        serviceTag3: 'Restoration · Reconstruction',
        serviceTag4: 'Emergency · 24/7',
        serviceTag5: 'Exterior · Painting',
        serviceTag6: 'Interior · Drywall',
        serviceTag7: 'General · Repairs',
        serviceTag8: 'Commercial · Residential',
        filterAll: 'All',
        filterRemodeling: 'Remodeling',
        filterSiding: 'Siding',
        filterRestoration: 'Restoration',
        filterDrywall: 'Drywall',
        filterEmergency: 'Emergency',
        filterPainting: 'Painting',
        filterWaterproofing: 'Waterproofing',
        filterMitigation: 'Mitigation',
        filterDeck: 'Deck',
        filterMold: 'Mold',
        filterCeiling: 'Ceiling',
        filterDryRot: 'Dry Rot',
        filterStructuralRepair: 'Structural Support/Repair',

        // Service detail page
        ourProcess: 'Our Process',
        step1Title: 'Free consultation',
        step1Desc: 'We assess the space and listen to your goals — no sales pitch, just real conversation about what you want and what it takes to get there.',
        step2Title: 'Detailed estimate',
        step2Desc: "Transparent pricing with a full line-item breakdown. No vague totals, no hidden costs. You know exactly what you're paying for before anything starts.",
        step3Title: 'Build phase',
        step3Desc: 'Skilled crew on site daily, clean workspace maintained, and open communication throughout. You always know where the project stands.',
        step4Title: 'Final walkthrough',
        step4Desc: "We walk every inch of the finished space with you. We don't close out the job until you're fully satisfied with the result.",
        backToServices: '← Back to Services',
        aboutThisService: 'About This Service',
        loading: 'Loading...',
        serviceNotFound: 'Service not found',
    },
    es: {
        // Nav
        home: 'Inicio',
        services: 'Servicios',
        projects: 'Proyectos',
        phoneLabel: 'Telefono',
        emailLabel: 'Correo',
        licenseLabel: 'CCB',
        menuLabel: 'Abrir menu',
        switchLanguage: 'Cambiar idioma',
        navAvailability: 'Disponible 24/7 · Licenciado · Garantizado · Asegurado · CCB 232708',
        navSubtitle: 'Construir Mejor, Restaurar Más Fuerte',
        navEstimate: 'Estimado Gratis',
        getFreeEstimate: 'Obtén tu Estimado Gratis',
        callUs: '¡Llámanos Ahora!! 24/7 Teléfono |',

        // Hero
        yourTrusted: 'Tu Contratista',
        generalContractor: 'General de Confianza',
        inOregon: 'en Oregon',
        licensed: 'Licenciado',
        bonded: 'Asegurado',
        insured: 'Garantizado',
        heroItem1: 'Sirviendo Hogares y Negocios por más de 20 Años',
        heroItem2: 'Remodelación · Adiciones · Revestimiento · Pintura',
        heroItem3: 'Tablaroca · Restauración · Mitigación · Moho',
        heroItem4: 'Soporte/Reparación estructural · Servicios de Emergencia',
        lookUsUp: 'Encuéntranos en',
        fullyLicensed: 'Totalmente Licenciado y Asegurado · 100% Garantía de Satisfacción',
        accredited: 'Acreditado',

        // Form shared keys
        requestFreeQuote: 'Solicita un',
        freeQuote: 'Presupuesto Gratis',
        fullName: 'Nombre Completo',
        phoneNumber: 'Número de Teléfono',
        emailAddress: 'Correo Electrónico',
        email: 'Correo Electrónico',
        projectType: 'Tipo de Proyecto',
        selectServiceType: 'Selecciona el Tipo de Servicio',
        message: 'Mensaje',
        projectDescription: 'Proporciona una breve descripción de tu proyecto...',
        specifyService: 'Por favor especifica el servicio que necesitas',
        getFreeEstimateBtn: 'Obtener Estimado Gratis →',
        sending: 'Enviando...',
        submit: 'Enviar',
        fastResponse: '🔒 Respuesta Rápida · Sin Compromiso',
        successMsg: '✅ ¡Mensaje enviado! Estaremos en contacto pronto.',
        successMsgAlt: '¡Mensaje enviado exitosamente!',
        errorMsg: 'Error al enviar. Por favor intenta de nuevo.',
        errorMsgAlt: 'Error al enviar el mensaje.',
        validEmailError: 'Por favor ingresa un correo válido',
        onlyNumbersError: 'Solo se permiten números',

        // Contact section
        getInTouchTitle: 'Contáctanos',
        alwaysReady: 'Siempre Listos Cuando Tú Lo Estés',
        fromRepairs: 'De Reparaciones a Soluciones de Construcción Completa',
        getFreeEstimateDesc: 'Obtén un estimado GRATIS hoy. Nos encargamos de proyectos de construcción interior y exterior, reparaciones expertas y soluciones preventivas, construidas para durar.',
        ourServicesLabel: 'Nuestros Servicios',
        contactService1: 'Construcción Interior y Exterior',
        contactService2: 'Reparaciones Generales y Carpintería',
        contactService3: 'Restauración y Reconstrucción',
        contactService4: 'Mitigación y Servicios de Emergencia',
        serviceArea: 'Área de Servicio',
        yearsExp: 'Años de Exp.',
        projectsDone: 'Proyectos',
        rating: 'Calificación',

        // Project types
        pt1: 'Construcción y Remodelación Interior',
        ptBath: 'Remodelación de Baño',
        ptKit: 'Remodelación de Cocina',
        pt2: 'Restauración y Reconstrucción',
        pt3: 'Mitigación y Servicios de Emergencia',
        pt4: 'Reparaciones Generales y Carpintería',
        pt5: 'Pintura',
        pt6: 'Revestimiento',
        pt7: 'Tablaroca',
        pt8: 'Otro',

        // About / original hero
        weWorkForYou: 'Trabajamos Para Ti',
        companyDesc: "J&R NW Construction se construyó de la manera honesta: en la obra, con un equipo que acumula más de 20 años de experiencia en el oficio.\n\nEn esos años vimos lo mismo una y otra vez: para una familia o el dueño de un negocio, una tubería rota, un daño por tormenta o una remodelación mal hecha no es solo un problema de construcción. Es estrés en el lugar que debería ser su refugio. Por eso existe esta empresa: para restaurar no solo edificios, sino la confianza, la comodidad y la tranquilidad.\n\nTratamos a cada cliente como familia. Ya sea una emergencia inesperada o el proyecto que siempre ha soñado, nosotros cargamos con el peso desde la primera llamada hasta el recorrido final, para que usted nunca lo cargue solo. Nuestro equipo entra a su casa con el mismo cuidado y respeto que le daría a la suya, construyendo calidad que conserva su valor por años.\n\nNo solo reparamos y remodelamos. Reconstruimos la confianza en los lugares donde pasa su vida.",
        companyDescSig: 'Julio Ramirez — Fundador, J&R NW Construction · CCB #232708',
        companyDescShort: 'Empresa familiar. Sirviendo a Oregon con integridad, artesanía y más de 20 años de experiencia.',
        familyOwned: 'Empresa familiar — tratamos su casa como la nuestra.',

        // Floating button & modals
        getEstimate: 'Obtén tu Estimado Gratis',
        getInTouch: 'Contáctanos',

        // Footer
        copyright: '© 2026 J&R NW Construction LLC',
        callUsNow: '¡Llámanos Ahora!!',

        // FAQ
        faqLabel: '¿Tienes Preguntas?',
        faqTitle: 'Preguntas Frecuentes',
        faqQ1: '¿Qué tan rápido pueden empezar?',
        faqA1: 'Normalmente respondemos en 2 horas y podemos programar un estimado gratuito el mismo día o al siguiente. Muchos trabajos de emergencia comienzan el mismo día.',
        faqQ2: '¿Cuánto cuesta?',
        faqA2: 'Cada proyecto es diferente. Ofrecemos estimados gratuitos y sin compromiso con presupuestos detallados por escrito. Sin cargos ocultos, sin sorpresas.',
        faqQ3: '¿Están licenciados y asegurados?',
        faqA3: 'Sí. Oregon CCB #232708. Totalmente licenciados, asegurados y garantizados. Contamos con seguro de responsabilidad civil y compensación de trabajadores en cada trabajo.',
        faqQ4: '¿Trabajan con reclamaciones de seguros?',
        faqA4: 'Sí. Trabajamos regularmente con ajustadores de seguros para daños por agua, incendio y reparaciones estructurales. Documentamos todo para su reclamación.',
        faqQ5: '¿Qué áreas sirven?',
        faqA5: 'Servimos Portland, Tigard, Tualatin, Gresham, Happy Valley, Oregon City, Milwaukie, Hillsboro y Beaverton.',
        faqQ6: '¿Garantizan su trabajo?',
        faqA6: 'Sí — por escrito. Nuestro trabajo está respaldado por una garantía de mano de obra por escrito de hasta 5 años según el servicio (5 años en revestimiento, 4 en pintura).',

        // Reviews section
        whatClientsSay: 'Lo Que Dicen Nuestros Clientes',
        realReviews: 'Reseñas reales de clientes reales',
        loadingReviews: 'Cargando reseñas...',

        // Projects page
        ourProjects: 'Nuestros Proyectos',
        portfolioLabel: 'Portafolio',
        projectsIntro: 'Transformamos espacios y revivimos estructuras con experiencia y cuidado. Nuestros proyectos van desde restaurar la belleza de edificios históricos hasta reconstruir propiedades dañadas.',
        completedProjects: 'Proyectos Completados',
        photos: 'Fotos',
        constructionOregon: 'Construcción · Oregon',
        projectDetails: 'Detalles del Proyecto',
        projectsSubtitle: 'Explora algunos de nuestros proyectos completados',
        ourWork: 'Nuestro Trabajo',
        viewOurWork: 'Ver Nuestro Trabajo',
        viewProject: 'Ver Proyecto →',
        viewAllProjects: 'Ver Todos los Proyectos',

        // Services page
        ourServices: 'Nuestros Servicios',
        servicesIntro: 'Ofrecemos servicios de restauración y construcción de primera calidad con precisión, integridad y compromiso con la excelencia. Tu visión, nuestra experiencia.',
        learnMore: 'Ver Más →',
        serviceTag1: 'Interior · Residencial',
        serviceTag2: 'Exterior · Protección',
        serviceTag3: 'Restauración · Reconstrucción',
        serviceTag4: 'Emergencia · 24/7',
        serviceTag5: 'Exterior · Pintura',
        serviceTag6: 'Interior · Tablaroca',
        serviceTag7: 'Reparaciones Generales · Carpintería',
        serviceTag8: 'Comercial · Residencial',
        filterAll: 'Todo',
        filterRemodeling: 'Remodelación',
        filterSiding: 'Revestimiento',
        filterRestoration: 'Restauración',
        filterDrywall: 'Tablaroca',
        filterEmergency: 'Emergencia',
        filterPainting: 'Pintura',
        filterWaterproofing: 'Impermeabilización',
        filterMitigation: 'Mitigación',
        filterDeck: 'Deck',
        filterMold: 'Moho',
        filterCeiling: 'Techo',
        filterDryRot: 'Madera podrida',
        filterStructuralRepair: 'Soporte/Reparación estructural',

        // Service detail page
        ourProcess: 'Nuestro Proceso',
        step1Title: 'Consulta gratuita',
        step1Desc: 'Evaluamos el espacio y escuchamos sus objetivos: sin discurso de ventas, solo una conversación real sobre lo que quiere y lo que se necesita para lograrlo.',
        step2Title: 'Estimado detallado',
        step2Desc: 'Precios transparentes con un desglose completo. Sin totales vagos ni costos ocultos. Usted sabe exactamente qué está pagando antes de que comience cualquier cosa.',
        step3Title: 'Fase de construcción',
        step3Desc: 'Equipo capacitado en el sitio diariamente, espacio de trabajo limpio y comunicación abierta en todo momento. Siempre sabe cómo va el proyecto.',
        step4Title: 'Revisión final',
        step4Desc: 'Recorremos cada centímetro del espacio terminado con usted. No cerramos el trabajo hasta que esté completamente satisfecho con el resultado.',
        backToServices: '← Volver a Servicios',
        aboutThisService: 'Sobre Este Servicio',
        loading: 'Cargando...',
        serviceNotFound: 'Servicio no encontrado',
    }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('jandr_lang');
        if (saved === 'en' || saved === 'es') {
            setLang(saved);
            document.cookie = `lang=${saved};path=/;max-age=31536000`;
        }
    }, []);

    const chooseLang = (l) => {
        setLang(l);
        localStorage.setItem('jandr_lang', l);
        document.cookie = `lang=${l};path=/;max-age=31536000`;
        document.cookie = `lang=${l};path=/;max-age=31536000`;
    };

    const t = translations[lang] || translations['en'];

    return (
        <LanguageContext.Provider value={{ lang, chooseLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    return useContext(LanguageContext);
}
