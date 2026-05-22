"use client";

import { useState } from "react";

type ServiceId = "siding" | "emergency" | "remodeling";

const images: Record<"default" | ServiceId, string> = {
  default: "/images/house-main.png",
  siding: "/images/house-siding-before-after.png",
  emergency: "/images/house-emergency.png",
  remodeling: "/images/house-remodeling-before-after.png",
};

const services: Array<{
  id: ServiceId;
  title: string;
  description: string;
  x: string;
  y: string;
}> = [
  {
    id: "siding",
    title: "Siding · Vinyl · Painting",
    description: "Exterior damage preview with repaired siding, vinyl and paint.",
    x: "42%",
    y: "43%",
  },
  {
    id: "emergency",
    title: "Emergency Services",
    description: "Storm, fire, flooding, roof damage and urgent response preview.",
    x: "66%",
    y: "29%",
  },
  {
    id: "remodeling",
    title: "Remodeling",
    description: "Before and after remodeling transformation preview.",
    x: "35%",
    y: "54%",
  },
];

export default function InteractiveHouseExperience() {
  const [active, setActive] = useState<"default" | ServiceId>("default");
  const activeService = services.find((service) => service.id === active);

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
        </div>

        <div
          className="relative w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          onMouseLeave={() => setActive("default")}
        >
          <img
            src={images[active]}
            alt="Interactive construction house"
            className="block w-full transition-all duration-500 ease-out"
            draggable={false}
          />

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {services.map((service) => {
            const isActive = active === service.id;

            return (
              <div
                key={service.id}
                className="absolute z-20"
                style={{
                  left: service.x,
                  top: service.y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <button
                  type="button"
                  onMouseEnter={() => setActive(service.id)}
                  onClick={() => setActive(service.id)}
                  className={[
                    "relative flex h-12 w-12 items-center justify-center rounded-full text-2xl font-black text-white shadow-2xl transition duration-300",
                    isActive ? "scale-110 bg-blue-500" : "bg-lime-400 hover:scale-110",
                  ].join(" ")}
                  aria-label={service.title}
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
                  <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-4 left-4 right-4 z-10 rounded-3xl bg-slate-950/85 p-4 text-white backdrop-blur-md md:left-6 md:right-auto md:w-[420px]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-300">
              {active === "default" ? "Default View" : "Service Preview"}
            </p>
            <h2 className="mt-1 text-xl font-bold">
              {activeService ? activeService.title : "Select a service point"}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {activeService
                ? activeService.description
                : "The image changes when you hover or tap a service point."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
