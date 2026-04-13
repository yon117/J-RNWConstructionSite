import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    en: {
        // Nav
        home: 'Home',
        services: 'Services',
        projects: 'Projects',
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
        yourTrusted: 'Your Trusted',
        generalContractor: 'General Contractor',
        inOregon: 'in Oregon',
        licensed: 'Licensed',
        bonded: 'Bonded',
        insured: 'Insured',
        heroItem1: 'Serving Homes & Businesses for Over 20 Years',
        heroItem2: 'Remodeling · Additions · Siding · Painting',
        heroItem3: 'Drywall · Restoration · Mitigation · Emergency Services',
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
        pt2: 'Restoration & Reconstruction',
        pt3: 'Mitigation & Emergency Services',
        pt4: 'General Repairs & Carpentry',
        pt5: 'Paint',
        pt6: 'Siding',
        pt7: 'Drywall',
        pt8: 'Other',

        // About / original hero
        weWorkForYou: 'We Work For You',
        companyDesc: "At J&R NW Construction, our mission is to deliver reliable, high-quality residential and light commercial remodels, siding projects, and interior/exterior reconstruction. With over 20 years of experience, our family-owned team is dedicated to restoring not just buildings—but confidence, comfort, and long-term value. From water mitigation and full restoration to interior upgrades, exterior improvements, and complete siding remodels, we provide end-to-end solutions built on craftsmanship, safety, and integrity. Every project is approached with the same commitment: to protect your property, enhance your space, and exceed your expectations. We don't just repair and remodel—we help rebuild trust in the places you live and work.",
        companyDescShort: 'Family-owned and operated. Serving Oregon with integrity, craftsmanship, and 20+ years of experience.',

        // Floating button & modals
        getEstimate: 'Get Your Free Estimate',
        getInTouch: 'Get in Touch',

        // Footer
        copyright: '© 2025 J&R NW Construction LLC',
        callUsNow: 'Call Us Now!!',

        // Reviews section
        whatClientsSay: 'What Our Clients Say',
        realReviews: 'Real reviews from real customers',
        loadingReviews: 'Loading reviews...',

        // Projects page
        ourProjects: 'Our Projects',
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
        heroItem3: 'Tablaroca · Restauración · Mitigación · Servicios de Emergencia',
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
        pt2: 'Restauración y Reconstrucción',
        pt3: 'Mitigación y Servicios de Emergencia',
        pt4: 'Reparaciones Generales y Carpintería',
        pt5: 'Pintura',
        pt6: 'Revestimiento',
        pt7: 'Tablaroca',
        pt8: 'Otro',

        // About / original hero
        weWorkForYou: 'Trabajamos Para Ti',
        companyDesc: 'En J&R NW Construction, nuestra misión es ofrecer remodelaciones residenciales y comerciales ligeras de alta calidad, proyectos de revestimiento y reconstrucción interior/exterior de manera confiable. Con más de 20 años de experiencia, nuestro equipo familiar está dedicado a restaurar no solo edificios, sino también la confianza, el confort y el valor a largo plazo. Desde mitigación de agua y restauración completa hasta mejoras interiores, mejoras exteriores y remodelaciones completas de revestimiento, ofrecemos soluciones integrales basadas en artesanía, seguridad e integridad. Cada proyecto se aborda con el mismo compromiso: proteger su propiedad, mejorar su espacio y superar sus expectativas.',
        companyDescShort: 'Empresa familiar. Sirviendo a Oregon con integridad, artesanía y más de 20 años de experiencia.',

        // Floating button & modals
        getEstimate: 'Obtén tu Estimado Gratis',
        getInTouch: 'Contáctanos',

        // Footer
        copyright: '© 2025 J&R NW Construction LLC',
        callUsNow: '¡Llámanos Ahora!!',

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
