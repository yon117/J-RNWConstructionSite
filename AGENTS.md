# J-RNW Construction Site — Memoria de Proyecto

## Reglas de modificación de archivos

**BACKUP OBLIGATORIO antes de editar cualquier archivo existente.**

Antes de usar Edit o Write en un archivo que ya existe, copiar primero:
```powershell
Copy-Item "archivo.ext" "archivo.ext.bak"
```

Razón: modificaciones históricamente rompen funcionalidad. Backup permite revertir inmediatamente.

Excepción: archivos creados desde cero en la misma sesión.

## Contexto técnico

- Framework: Next.js (Pages Router)
- Estilos: CSS Modules (sin Tailwind config)
- Fuentes: Barlow + Barlow Condensed (Google Fonts)
- Colores canónicos: definidos en `styles/globals.css` como CSS custom properties
- Design system documentado en `DESIGN.md` + `.impeccable/design.json`
- Register: brand (público) / product (admin `/admin`, `/adminside`)

## Infraestructura / Deployment

- Hosting: Hostinger VPS
- Acceso: root SSH disponible siempre
- Email SMTP: GoDaddy (`smtpout.secureserver.net:587`), cuenta `julioramirez@jandrnw.com`
- Env vars en producción: deben estar seteadas en el VPS (no en `.env.local` que es solo local)

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
