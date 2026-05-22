"use client";

import { useEffect, useMemo, useState } from "react";

type ViewMode = "exterior" | "interior";

type ExteriorServiceId = "siding" | "emergency" | "remodeling";
type InteriorServiceId =
  | "remodeling"
  | "additions"
  | "drywall"
  | "restoration"
  | "mitigation"
  | "emergency";

const exteriorImages: Record<"default" | ExteriorServiceId, string> = {
  default: "/images/exterior-main.png",
  siding: "/images/exterior-siding-before-after.png",
  emergency: "/images/exterior-emergency.png",
  remodeling: "/images/exterior-remodeling-before-after.png",
};

const interiorImages: Record<"default" | InteriorServiceId, string> = {
  default: "/images/interior-main.png",
  remodeling: "/images/interior-remodeling.png",
  additions: "/images/interior-additions.png",
  drywall: "/images/interior-drywall.png",
  restoration: "/images/interior-restoration.png",
  mitigation: "/images/interior-mitigation.png",
  emergency: "/images/interior-emergency.png",
};

const exteriorServices: Array<{
  id: ExteriorServiceId;
  title: string;
  description: string;
  x: string;
  y: string;
}> = [
  {
    id: "siding",
    title: "Siding · Vinyl · Painting",
    description: "Exterior siding, vinyl and painting before/after preview.",
    x: "42%",
    y: "43%",
  },
  {
    id: "emergency",
    title: "Emergency Services",
    description: "Storm, fire, flooding, roof damage and emergency response preview.",
    x: "66%",
    y: "29%",
  },
  {
    id: "remodeling",
    title: "Remodeling",
    description: "Exterior remodeling before/after transformation preview.",
    x: "35%",
    y: "54%",
  },
];

const interiorServices: Array<{
  id: InteriorServiceId;
  title: string;
  description: string;
  x: string;
  y: string;
}> = [
  {
    id: "remodeling",
    title: "Remodeling",
    description: "Interior remodeling before/after transformation preview.",
    x: "48%",
    y: "52%",
  },
  {
    id: "additions",
    title: "Additions",
    description: "Interior addition preview with unfinished construction and finished expansion.",
    x: "38%",
    y: "36%",
  },
  {
    id: "drywall",
    title: "Drywall",
    description: "Drywall damage, missing sections and finished repair preview.",
    x: "25%",
    y: "35%",
  },
  {
    id: "restoration",
    title: "Restoration",
    description: "Interior restoration after damage with repaired clean finishes.",
    x: "24%",
    y: "56%",
  },
  {
    id: "mitigation",
    title: "Mitigation",
    description: "Water mitigation preview with drying equipment and clean recovery side.",
    x: "32%",
    y: "68%",
  },
  {
    id: "emergency",
    title: "Emergency Services",
    description: "Emergency interior damage preview with water/fire damage and response needs.",
    x: "62%",
    y: "40%",
  },
];

export default function InteractiveHouseExperience() {
  const [mode, setMode] = useState<ViewMode>("exterior");
  const [activeExterior, setActiveExterior] = useState<"default" | ExteriorServiceId>("default");
  const [activeInterior, setActiveInterior] = useState<"default" | InteriorServiceId>("default");
  const [visibleImage, setVisibleImage] = useState(exteriorImages.default);
  const [nextImage, setNextImage] = useState<string | null>(null);
  const [isFading, setIsFading] = useState(false);

  const allImages = useMemo(
    () => [...Object.values(exteriorImages), ...Object.values(interiorImages)],
    []
  );

  useEffect(() => {
    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [allImages]);

  const currentImage =
    mode === "exterior"
      ? exteriorImages[activeExterior]
      : interiorImages[activeInterior];

  useEffect(() => {
    if (currentImage === visibleImage) return;

    const img = new Image();
    img.src = currentImage;

    img.onload = () => {
      setNextImage(currentImage);
      setIsFading(true);

      window.setTimeout(() => {
        setVisibleImage(currentImage);
        setNextImage(null);
        setIsFading(false);
      }, 260);
    };
  }, [currentImage, visibleImage]);

  const activeTitle =
    mode === "exterior"
      ? exteriorServices.find((service) => service.id === activeExterior)?.title
      : interiorServices.find((service) => service.id === activeInterior)?.title;

  const activeDescription =
    mode === "exterior"
      ? exteriorServices.find((service) => service.id === activeExterior)?.description
      : interiorServices.find((service) => service.id === activeInterior)?.description;

  function resetActive() {
    if (mode === "exterior") setActiveExterior("default");
    if (mode === "interior") setActiveInterior("default");
  }

  function changeMode(nextMode: ViewMode) {
    setMode(nextMode);
    setActiveExterior("default");
    setActiveInterior("default");
  }

  return (
    <main className="min-h-screen bg-[#eef3f7] flex items-center justify-center p-4 md:p-8">
      <section className="w-full max-w-6xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900">
            Interactive Home Services
          </h1>
          <p className="mt-3 text-slate-600">
            Hover or tap each point to preview the service.
          </p>

          <div className="mt-6 inline-flex rounded-full bg-white p-2 shadow-xl">
            <button
              type="button"
              onClick={() => changeMode("exterior")}
              className={[
                "rounded-full px-7 py-3 text-sm md:text-base font-bold transition",
                mode === "exterior"
                  ? "bg-[#0e3a5b] text-white shadow-lg"
                  : "text-slate-700 hover:bg-slate-100",
              ].join(" ")}
            >
              Exterior
            </button>

            <button
              type="button"
              onClick={() => changeMode("interior")}
              className={[
                "rounded-full px-7 py-3 text-sm md:text-base font-bold transition",
                mode === "interior"
                  ? "bg-[#0e3a5b] text-white shadow-lg"
                  : "text-slate-700 hover:bg-slate-100",
              ].join(" ")}
            >
              Interior
            </button>
          </div>
        </div>

        <div
          className="relative w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          onMouseLeave={resetActive}
        >
          <img
            src={visibleImage}
            alt="Interactive construction service preview"
            className="block w-full"
            draggable={false}
          />

          {nextImage && (
            <img
              src={nextImage}
              alt=""
              className={[
                "absolute inset-0 block w-full transition-opacity duration-300 ease-out",
                isFading ? "opacity-100" : "opacity-0",
              ].join(" ")}
              draggable={false}
            />
          )}

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {mode === "exterior" &&
            exteriorServices.map((service) => {
              const isActive = activeExterior === service.id;

              return (
                <Hotspot
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  x={service.x}
                  y={service.y}
                  isActive={isActive}
                  onActivate={() => setActiveExterior(service.id)}
                />
              );
            })}

          {mode === "interior" &&
            interiorServices.map((service) => {
              const isActive = activeInterior === service.id;

              return (
                <Hotspot
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  x={service.x}
                  y={service.y}
                  isActive={isActive}
                  onActivate={() => setActiveInterior(service.id)}
                />
              );
            })}

          <div className="absolute bottom-4 left-4 right-4 z-10 rounded-3xl bg-slate-950/85 p-4 text-white backdrop-blur-md md:left-6 md:right-auto md:w-[440px]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-300">
              {mode === "exterior" ? "Exterior View" : "Interior View"}
            </p>
            <h2 className="mt-1 text-xl font-bold">
              {activeTitle || "Select a service point"}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {activeDescription || "The image changes when you hover or tap a service point."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Hotspot({
  title,
  description,
  x,
  y,
  isActive,
  onActivate,
}: {
  title: string;
  description: string;
  x: string;
  y: string;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <div
      className="absolute z-20"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <button
        type="button"
        onMouseEnter={onActivate}
        onClick={onActivate}
        className={[
          "relative flex h-12 w-12 items-center justify-center rounded-full text-2xl font-black text-white shadow-2xl transition duration-300",
          isActive ? "scale-110 bg-blue-500" : "bg-lime-400 hover:scale-110",
        ].join(" ")}
        aria-label={title}
      >
        <span className="absolute h-16 w-16 animate-ping rounded-full bg-lime-400/30" />
        <span className="relative -mt-1">+</span>
      </button>

      <div
        className={[
          "absolute left-14 top-1/2 w-72 -translate-y-1/2 rounded-3xl bg-white/95 p-4 text-left shadow-2xl backdrop-blur-xl transition duration-300 max-md:left-1/2 max-md:top-14 max-md:-translate-x-1/2 max-md:translate-y-0",
          isActive ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95",
        ].join(" ")}
      >
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </div>
  );
}
