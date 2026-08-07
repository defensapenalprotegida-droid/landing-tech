# Backend de contacto vía SES (AWS) — diseño

## Contexto y problema

El formulario de contacto de landing-tech (`src/components/ContactSection.tsx`) envía a `/api/contact`
(función Vercel, `api/contact.ts`), que usa `nodemailer` contra SMTP de Gmail/Workspace. El endpoint
responde `ok:true` pero el correo nunca llega a `CONTACT_TO_EMAIL` — ni siquiera a spam. La causa exacta
no se pudo confirmar sin acceso a la consola de Vercel/Gmail, pero el patrón (200 OK sin entrega real) es
típico de relays SMTP de consumo poco confiables para envío transaccional desde una app.

Decisión: reemplazar ese envío por un backend propio en AWS usando SES, reutilizando el patrón ya
probado en `rental-notificaciones-main/src/modulos/notificaciones/canales/email-dispatcher` (SDK de SES
directo, sin nodemailer).

## Alcance

- Solo email de notificación interna (el despacho se entera de un nuevo lead). WhatsApp y respuesta
  automática por agente IA quedan fuera de este spec — son fases futuras, no se diseñan aquí.
- Nuevo stack SAM, independiente de los backends existentes de RentoQ. No se toca ningún backend de
  RentoQ.
- Se mantiene el contrato actual entre `ContactSection.tsx` y el backend: `{ ok: boolean, message?: string }`.
  No se rediseña el formulario ni su validación (`leadSchema`).

## Arquitectura

```
Browser (arteagayaldunate.cl)
  → POST /contact  [x-api-key]
    → API Gateway (HTTP API)
      → Lambda contact-handler (Node 20 / TypeScript)
        → SSM Parameter Store: /arteagayaldunate/contact/recipients (StringList)
        → SES: SendEmailCommand
```

Sin DynamoDB, EventBridge ni S3: es un formulario simple de una sola notificación, no necesita el
músculo completo de `email-dispatcher` (que soporta adjuntos, reintentos con estado y eventos de fallo
a EventBridge). Se toma de ahí únicamente el patrón de invocar SES vía `@aws-sdk/client-ses` en lugar de
SMTP.

Stack nuevo: `arteagayaldunate-contact-backend`, SAM, en la misma cuenta/región AWS que el resto de
proyectos RentoQ salvo indicación contraria.

## Componentes

### API Gateway
- HTTP API, único recurso `POST /contact`.
- Autenticación: API Key + usage plan. La key se guarda como variable de entorno en Vercel
  (`CONTACT_API_KEY` o similar), nunca expuesta en el bundle del frontend — la llamada sigue siendo
  server-to-server porque `leadApi.ts` seguirá golpeando una función propia de landing-tech, que a su vez
  reenvía a este endpoint AWS (ver sección "Integración con landing-tech").
- CORS: restringido al dominio canónico `https://arteagayaldunate.cl` (no `defensapenalprotegida.cl`,
  que es residuo de la plantilla original — ver nota abajo).

### Lambda `contact-handler`
- Node.js 20, TypeScript, ARM64 (consistente con el resto de Lambdas RentoQ).
- Valida los campos requeridos del payload (mismo shape que `leadSchema` de landing-tech: `name`,
  `email`, `phone`, `area`, `message`, campos condicionales por área).
- Lee la lista de destinatarios desde SSM Parameter Store en cada invocación (permite agregar/quitar
  correos sin redeploy).
- Arma el email (asunto + texto + HTML, similar a `buildLeadEmail` en `api/emailTemplate.ts`) y llama
  `SendEmailCommand` de `@aws-sdk/client-ses`.
- Responde `{ ok: true }` en éxito o `{ ok: false, message }` en fallo — nunca un `ok:true` falso: si
  `SendEmailCommand` lanza error, se captura, se loguea en CloudWatch con detalle, y se responde
  `ok:false` con un mensaje genérico para el usuario final.

### SES
- Identidad de dominio verificada: `arteagayaldunate.cl`, con registros SPF y DKIM en el DNS del dominio.
  **Este paso toca DNS de producción — requiere aprobación explícita antes de aplicarlo**, conforme a la
  regla de no modificar infraestructura/dominios sin autorización.
- Remitente: `no-responder@arteagayaldunate.cl` (o el que se defina al momento de verificar el dominio).
- Cuenta SES probablemente en sandbox inicialmente — hay que salir de sandbox (solicitud a AWS) para
  enviar a destinatarios no verificados individualmente; se deja como tarea explícita del plan.

### Lista de destinatarios
- SSM Parameter Store, tipo `StringList`, path `/arteagayaldunate/contact/recipients`.
- Valor inicial: `luis.guerrero.godoy@gmail.com`.
- Agregar/quitar correos después es editar el parámetro (consola AWS o CLI) — sin tocar código, sin
  redeploy.

## Integración con landing-tech

`src/lib/leadApi.ts` deja de llamar a `/api/contact` (la función Vercel con nodemailer) y pasa a llamar
al nuevo endpoint de API Gateway, incluyendo el header `x-api-key` desde una variable de entorno de
Vercel. El contrato de respuesta (`{ ok, message? }`) se mantiene idéntico, por lo que `ContactSection.tsx`
no requiere cambios.

`api/contact.ts` y `api/emailTemplate.ts` (la implementación actual con nodemailer) quedan obsoletos y se
eliminan una vez confirmado que el nuevo flujo funciona en producción.

**Nota aparte, fuera de este spec:** el CORS de `vercel.json` sigue apuntando a `defensapenalprotegida.cl`
en vez del dominio canónico. Habrá que corregirlo para que el navegador no bloquee las llamadas del
frontend hacia cualquier endpoint (el actual o el nuevo), pero es un cambio de configuración de
producción que se solicitará y aplicará por separado, con confirmación explícita del usuario.

## Manejo de errores

- Payload inválido (falta `name`/`email`/`message`): 400, `{ ok:false, message: "Falta el campo: X" }`.
- SES falla (dominio no verificado, throttling, etc.): 500, `{ ok:false, message: "..." }` genérico +
  log detallado en CloudWatch para diagnóstico.
- API Key inválida o ausente: rechazado por API Gateway (401/403) antes de llegar a la Lambda.

## Testing

- Tests unitarios del handler con Vitest (mismo framework que el resto del proyecto y que
  `qa-vitest-contract-tester` de RentoQ espera): validación de payload, armado del contenido del email,
  manejo de error de SES (mock del cliente SES).
- No se prueba contra SES real en CI; se verifica manualmente en un ambiente de staging/cert antes de
  apuntar producción al nuevo endpoint.

## Fuera de alcance (fases futuras, no diseñadas aquí)

- Notificación por WhatsApp (patrón de referencia: `whatsapp-dispatcher` en
  `defenderops-notificaciones-main`, ya tiene Secrets Manager pero está "dormido").
- Agente IA que analiza el mensaje del formulario y responde automáticamente al cliente (no existe nada
  construido hoy; como referencia de invocación de Claude/Bedrock solo existe el Knowledge Base RAG de
  `rental-configuracion-backend-main`, que no aplica directamente a este caso de uso).
