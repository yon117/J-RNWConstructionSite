export const CONVERSION_LABELS = {
  phoneCall: 'co0XCP6H_pAcEJ3opddA',
  contactForm: 'co0XCP6H_pAcEJ3opddA',
  quoteRequest: 'co0XCP6H_pAcEJ3opddA',
};

export const trackConversion = (label: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      send_to: `AW-17362940957/${label}`,
    });
  }
};
