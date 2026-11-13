# Entrega del formulario al CRM de OPS (conector desactivado)

Estado: implementado, **desactivado**, sin ejecutar pruebas, build ni migraciones. Sin cambios en OPS ni en la VPS.

## Qué hace

`pages/api/contact.js` mantiene filtros de spam, rate limit, guardado en `messages` y aviso a n8n. Si `JRNW_OPS_CRM_ENABLED=true` (y URL/token válidos), además:

1. `messages` y una fila en `crm_deliveries` se guardan en **una sola transacción** (`db.batch`).
2. Un worker aparte (`scripts/crm-delivery-worker.mjs`) reclama filas vencidas y hace `POST` a OPS.
3. Solo `200/201` con JSON `accepted: true`, mismo `submission_id` y `opportunity_id` marca `delivered`.

Con la variable desactivada no se crea cola ni se envía nada. Visitante siempre recibe éxito si el guardado local funciona, esté OPS disponible o no.

## Variables (solo servidor; sin `NEXT_PUBLIC_`)

```
JRNW_OPS_CRM_ENABLED=      # "true" para activar; cualquier otro valor = desactivado
JRNW_OPS_CRM_LEADS_URL=    # https://<dominio-ops>/api/crm/leads (HTTPS obligatorio, sin usuario/clave)
JRNW_OPS_CRM_TOKEN=        # = JRNW_OPS_PUBLIC_LEAD_TOKEN de OPS (>= 32 caracteres)
```

No existía implementación previa. `JRNW_ENV_FILE` (opcional) indica un archivo dotenv para los scripts. El token solo se envía como `Authorization: Bearer`, con `redirect: 'manual'` (nunca se sigue una redirección). No aparece en logs.

## Migración (tabla nueva, `messages` intacta)

Esquema real de `messages` en producción **no verificado** (la copia local `jandr.sqlite` no tiene `name`/`full_name`, que `contact.js` ya usa). Por eso no se altera `messages`; `crm_deliveries` guarda su propio snapshot del payload.

```bash
node scripts/migrate-crm-deliveries.mjs           # dry run: imprime SQL y tipo de destino
node scripts/migrate-crm-deliveries.mjs --apply   # aplica (hacer backup de la BD antes)
```

Idempotente. Tabla: `submission_id` único, `payload_json` inmutable (trigger), `status` (`pending|delivering|delivered|needs_review`), `attempts`, `next_attempt_at`, lease (`lease_owner`, `lease_expires_at`), último HTTP/código, `opportunity_id`. **Orden de activación: migrar antes de activar** (con flag activo y tabla ausente el formulario falla con 500 y no guarda).

## Proceso de entrega

- Reclamo atómico: un único `UPDATE ... WHERE id = (SELECT ...) RETURNING`; dos procesos no obtienen la misma fila. Lease de 60 s; si el worker muere, la fila vuelve a ser elegible (recuperación tras reinicio). Cada reclamo suma un intento.
- Reintentos (red, timeout, 408/425/429/5xx, 2xx inválido): espera exponencial 30 s → tope 6 h con jitter; `Retry-After` respetado (tope 1 h). 12 intentos y pasa a `needs_review`.
- Revisión manual sin bucle: 401/403/404/405 (`configuration_error`), 400/409/413/415/422 (`payload_rejected`), 3xx (`redirect_not_followed`), payload fuera de límites (`payload_exceeds_ops_limits`).
- Mismo `submission_id` y mismo JSON en todos los reintentos (OPS responde 200 en repetición idéntica). Un `409` no cambia el ID.
- Duplicados del navegador: el formulario genera un UUID por envío (se reutiliza tras error, se renueva tras éxito); el servidor lo valida y la restricción `UNIQUE` evita segundo mensaje/entrega. Limitación: si la respuesta se perdió pero el guardado ocurrió y el visitante edita el texto y reenvía, el reenvío se trata como repetición.
- Logs: solo `id`, `submission_id`, intento, resultado, HTTP, código. Se eliminó el `console.log` previo con datos del contacto.

## Operación

```bash
node scripts/crm-delivery-worker.mjs          # ejecutar UNA instancia (p. ej. PM2 fork, no el cluster de Next)
node scripts/crm-delivery-worker.mjs --once   # un ciclo
node scripts/crm-delivery-admin.mjs list --status needs_review   # sin datos del visitante
node scripts/crm-delivery-admin.mjs requeue <id>                  # tras corregir la causa
```

`ecosystem.config.js` no se modificó (la VPS tiene su propia versión). Añadir el worker allí o con `pm2 start` en la VPS es paso de activación.

## Activación (cuando OPS tenga HTTPS)

1. Confirmar decisión de límites (abajo). 2. Backup de BD + migración `--apply`. 3. Revisar/ejecutar pruebas con autorización: `node --test scripts/crm-delivery.test.mjs`. 4. Fijar variables en el servidor (fuera de Git/chat) con `ENABLED=false`, arrancar worker (queda inactivo). 5. Prueba controlada con `ENABLED=true`. 6. Observar `needs_review`.

Desactivar: `JRNW_OPS_CRM_ENABLED=false` y reiniciar Next y worker; la cola y los mensajes se conservan. Mensajes históricos **no** se importan.

Recuperación: reiniciar worker (leases expiran solos); `needs_review` → corregir causa → `requeue`. No borrar filas ni cambiar IDs.

## Límites (resuelto)

OPS amplió sus límites (confirmado por el agente de OPS; pruebas de OPS sin ejecutar). Landing no recorta nada: `client_name` 200, `title` 200, `message` 5000, `client_email` 254, `client_phone` 50, cuerpo JSON 32768 bytes UTF-8. Constantes en `lib/crm-delivery/payload.mjs` (`OPS_LIMITS`). Los mismos límites de la landing (200/200/5000) ya coinciden; lo que aún exceda (p. ej. cuerpo > 32 KB por caracteres de control) se guarda local y queda en `needs_review`, sin truncar.

**Activar solo cuando OPS con estos cambios esté desplegado**: si la landing enviara mensajes largos a un OPS con límites viejos, recibiría 400 y pasarían a `needs_review` (recuperables con `requeue`).

## Otros pendientes

n8n sin revisar (se conserva tal cual). Copia exacta de la VPS no confirmada (build activo puede diferir de GitHub). Outlook no tocado.
