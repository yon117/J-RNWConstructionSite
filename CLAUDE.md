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
