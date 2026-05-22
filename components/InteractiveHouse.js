import { useEffect, useMemo, useState } from 'react';
import styles from './InteractiveHouse.module.css';

const EXTERIOR_IMAGES = {
  default: '/images/exterior-main.png',
  siding: '/images/exterior-siding-before-after.png',
  emergency: '/images/exterior-emergency.png',
  remodeling: '/images/exterior-remodeling-before-after.png',
};

const INTERIOR_IMAGES = {
  default: '/images/interior-main.png',
  remodeling: '/images/interior-remodeling.png',
  additions: '/images/interior-additions.png',
  drywall: '/images/interior-drywall.png',
  restoration: '/images/interior-restoration.png',
  mitigation: '/images/interior-mitigation.png',
  emergency: '/images/interior-emergency.png',
};

const EXTERIOR_SERVICES = [
  {
    id: 'siding',
    title: 'Siding · Vinyl · Painting',
    description: 'Exterior siding, vinyl and painting before/after preview.',
    x: '42%',
    y: '43%',
    tooltipSide: 'right',
  },
  {
    id: 'emergency',
    title: 'Emergency Services',
    description: 'Storm, fire, flooding, roof damage and emergency response preview.',
    x: '66%',
    y: '29%',
    tooltipSide: 'left',
  },
  {
    id: 'remodeling',
    title: 'Remodeling',
    description: 'Exterior remodeling before/after transformation preview.',
    x: '35%',
    y: '54%',
    tooltipSide: 'right',
  },
];

const INTERIOR_SERVICES = [
  {
    id: 'remodeling',
    title: 'Remodeling',
    description: 'Interior remodeling before/after transformation preview.',
    x: '48%',
    y: '52%',
    tooltipSide: 'top',
  },
  {
    id: 'additions',
    title: 'Additions',
    description: 'Interior addition preview with unfinished construction and finished expansion.',
    x: '38%',
    y: '36%',
    tooltipSide: 'right',
  },
  {
    id: 'drywall',
    title: 'Drywall',
    description: 'Drywall damage, missing sections and finished repair preview.',
    x: '25%',
    y: '35%',
    tooltipSide: 'right',
  },
  {
    id: 'restoration',
    title: 'Restoration',
    description: 'Interior restoration after damage with repaired clean finishes.',
    x: '24%',
    y: '56%',
    tooltipSide: 'right',
  },
  {
    id: 'mitigation',
    title: 'Mitigation',
    description: 'Water mitigation preview with drying equipment and clean recovery side.',
    x: '32%',
    y: '68%',
    tooltipSide: 'top',
  },
  {
    id: 'emergency',
    title: 'Emergency Services',
    description: 'Emergency interior damage preview with water/fire damage and response needs.',
    x: '62%',
    y: '40%',
    tooltipSide: 'left',
  },
];

export default function InteractiveHouse() {
  const [mode, setMode] = useState('exterior');
  const [activeExterior, setActiveExterior] = useState('default');
  const [activeInterior, setActiveInterior] = useState('default');
  const [visibleImage, setVisibleImage] = useState(EXTERIOR_IMAGES.default);
  const [nextImage, setNextImage] = useState(null);
  const [isFading, setIsFading] = useState(false);

  const allImages = useMemo(
    () => [...Object.values(EXTERIOR_IMAGES), ...Object.values(INTERIOR_IMAGES)],
    []
  );

  useEffect(() => {
    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [allImages]);

  const currentImage =
    mode === 'exterior' ? EXTERIOR_IMAGES[activeExterior] : INTERIOR_IMAGES[activeInterior];

  useEffect(() => {
    if (currentImage === visibleImage) return undefined;

    const img = new Image();
    const timeoutRef = { current: null };
    img.src = currentImage;

    img.onload = () => {
      setNextImage(currentImage);
      setIsFading(true);

      timeoutRef.current = window.setTimeout(() => {
        setVisibleImage(currentImage);
        setNextImage(null);
        setIsFading(false);
      }, 260);
    };

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [currentImage, visibleImage]);

  function resetActive() {
    if (mode === 'exterior') setActiveExterior('default');
    if (mode === 'interior') setActiveInterior('default');
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setActiveExterior('default');
    setActiveInterior('default');
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.modeBtns} role="group" aria-label="House view mode">
        <button
          type="button"
          onClick={() => changeMode('exterior')}
          className={`${styles.modeBtn} ${mode === 'exterior' ? styles.active : ''}`}
        >
          Exterior
        </button>

        <button
          type="button"
          onClick={() => changeMode('interior')}
          className={`${styles.modeBtn} ${mode === 'interior' ? styles.active : ''}`}
        >
          Interior
        </button>
      </div>

      <div className={styles.sceneWrap} onMouseLeave={resetActive}>
        <div className={styles.mediaFrame}>
          <img
            src={visibleImage}
            alt="Interactive construction service preview"
            className={styles.baseImage}
            draggable={false}
          />

          {nextImage ? (
            <img
              src={nextImage}
              alt=""
              className={`${styles.fadeImage} ${isFading ? styles.fadeIn : ''}`}
              draggable={false}
            />
          ) : null}

          <div className={styles.sceneOverlay} />
        </div>

        {mode === 'exterior'
          ? EXTERIOR_SERVICES.map((service) => (
              <Hotspot
                key={service.id}
                title={service.title}
                description={service.description}
                x={service.x}
                y={service.y}
                tooltipSide={service.tooltipSide}
                isActive={activeExterior === service.id}
                onActivate={() => setActiveExterior(service.id)}
              />
            ))
          : INTERIOR_SERVICES.map((service) => (
              <Hotspot
                key={service.id}
                title={service.title}
                description={service.description}
                x={service.x}
                y={service.y}
                tooltipSide={service.tooltipSide}
                isActive={activeInterior === service.id}
                onActivate={() => setActiveInterior(service.id)}
              />
            ))}
      </div>
    </div>
  );
}

function Hotspot({ title, description, x, y, tooltipSide, isActive, onActivate }) {
  return (
    <div
      className={`${styles.hotspotWrap} ${isActive ? styles.hotspotWrapActive : ''}`}
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <button
        type="button"
        onMouseEnter={onActivate}
        onClick={onActivate}
        className={`${styles.hotspotBtn} ${isActive ? styles.hotspotBtnActive : ''}`}
        aria-label={title}
      >
        <span className={styles.hotspotPing} />
        <span className={styles.hotspotPlus}>+</span>
      </button>

      <div
        className={`${styles.hotspotCard} ${styles[`hotspotCard${tooltipSide.charAt(0).toUpperCase()}${tooltipSide.slice(1)}`]} ${isActive ? styles.hotspotCardActive : ''}`}
      >
        <h3 className={styles.hotspotTitle}>{title}</h3>
        <p className={styles.hotspotDesc}>{description}</p>
      </div>
    </div>
  );
}
