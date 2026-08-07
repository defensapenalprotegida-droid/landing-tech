# Backend de contacto vía SES (AWS) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el envío de email del formulario de contacto de landing-tech (nodemailer/SMTP Gmail, que no entrega) por un backend AWS propio (API Gateway + Lambda + SES), manteniendo el contrato `{ ok, message? }` que ya consume `ContactSection.tsx`.

**Architecture:** Nuevo stack SAM independiente `arteagayaldunate-contact-backend` (Node 20 / TypeScript / ARM64), con `POST /contact` protegido por API Key, que valida el payload, arma el email y lo envía vía `@aws-sdk/client-ses`, leyendo la lista de destinatarios desde un parámetro `StringList` en SSM Parameter Store. `api/contact.ts` en landing-tech pasa de implementar SMTP a ser un proxy delgado que reenvía la petición del navegador al endpoint AWS, guardando la API key solo en variables de entorno server-side de Vercel (nunca en el bundle del cliente).

**Tech Stack:** AWS SAM, Lambda Node.js 20 (ARM64), API Gateway (REST, `AWS::Serverless::Api`), `@aws-sdk/client-ses` `^3.600.0`, `@aws-sdk/client-ssm` `^3.600.0`, SSM Parameter Store, Vitest + `aws-sdk-client-mock`, esbuild (vía `Metadata.BuildMethod: esbuild` de SAM, sin config propia).

## Global Constraints

- Runtime `nodejs20.x`, arquitectura `arm64`, `Handler: app.handler` — consistente con las Lambdas de `rental-notificaciones-main`.
- `tsconfig.json`: `target: ES2022`, `module: commonjs`, `strict: true`, `rootDir: ./src`, `outDir: ./dist` (mismo patrón que los backends RentoQ existentes).
- Nunca commitear la API key ni credenciales AWS en el repo. La API key vive solo como variable de entorno server-side en Vercel.
- Dominio canónico del frontend: `https://arteagayaldunate.cl` (sin `www`) — usar este valor exacto en CORS, nunca `defensapenalprotegida.cl`.
- Cualquier paso que modifique DNS de producción, `vercel.json`, o variables de entorno ya existentes en Vercel/AWS de producción requiere **confirmación explícita del usuario antes de ejecutarse** — están marcados con ⚠️ en este plan. No ejecutar esos comandos sin ese sí explícito, aunque el resto del task ya esté aprobado.
- El contrato de respuesta hacia el frontend se mantiene igual en todo momento: `{ ok: boolean, message?: string }`. No se modifica `ContactSection.tsx` ni `leadSchema`.

---

## File Structure

Nuevo repo, sibling de los demás bajo `/Users/lfgg/paldunate/`:

```
arteagayaldunate-contact-backend/
├── package.json
├── tsconfig.json
├── template.yaml
├── samconfig.toml            # generado por `sam deploy --guided` (Task 6)
└── src/
    └── handlers/
        └── contact/
            ├── app.ts        # handler + validación + armado de email + envío SES
            └── app.test.ts   # tests unitarios (mock de SES y SSM)
```

Modificaciones en `landing-tech/`:

```
api/
├── contact.ts        # reescrito: proxy delgado hacia el endpoint AWS
└── emailTemplate.ts   # eliminado (el armado del email ahora vive en la Lambda)
└── emailTemplate.test.ts  # eliminado junto con emailTemplate.ts
```

---

### Task 1: Scaffold del proyecto SAM

**Files:**
- Create: `arteagayaldunate-contact-backend/package.json`
- Create: `arteagayaldunate-contact-backend/tsconfig.json`
- Create: `arteagayaldunate-contact-backend/.gitignore`

**Interfaces:**
- Produces: estructura de proyecto sobre la que corren `npm install`, `npm test` y `sam build` en los tasks siguientes.

- [ ] **Step 1: Crear el directorio y `package.json`**

```bash
mkdir -p /Users/lfgg/paldunate/arteagayaldunate-contact-backend/src/handlers/contact
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend
git init
```

```json
{
  "name": "arteagayaldunate-contact-backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@aws-sdk/client-ses": "^3.600.0",
    "@aws-sdk/client-ssm": "^3.600.0"
  },
  "devDependencies": {
    "@types/aws-lambda": "^8.10.138",
    "@types/node": "^20.14.0",
    "aws-sdk-client-mock": "^4.0.0",
    "typescript": "^5.5.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Crear `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Crear `.gitignore`**

```
node_modules/
dist/
.aws-sam/
samconfig.toml
```

- [ ] **Step 4: Instalar dependencias**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend
npm install
```

Expected: `npm install` termina sin errores, se genera `package-lock.json`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json .gitignore
git commit -m "chore: scaffold arteagayaldunate-contact-backend"
```

---

### Task 2: Validación del payload (TDD)

**Files:**
- Create: `arteagayaldunate-contact-backend/src/handlers/contact/app.ts`
- Test: `arteagayaldunate-contact-backend/src/handlers/contact/app.test.ts`

**Interfaces:**
- Produces: `validatePayload(data: Partial<ContactPayload>): string | null` — retorna `null` si el payload es válido, o un mensaje de error si falta un campo requerido. `ContactPayload` interface con campos `name`, `email`, `message` (requeridos) y `phone`, `area`, `urgencia`, `situacionPenal`, `materiaFamilia`, `laboralParte`, `laboralSituacion`, `monto`, `horario`, `website` (opcionales).

- [ ] **Step 1: Escribir el test que falla**

```ts
// src/handlers/contact/app.test.ts
import { describe, test, beforeEach } from 'vitest';
import assert from 'node:assert/strict';
import { validatePayload } from './app';

describe('validatePayload', () => {
  test('retorna null cuando name, email y message están presentes', () => {
    const result = validatePayload({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      message: 'Necesito asesoría',
    });
    assert.equal(result, null);
  });

  test('retorna mensaje de error cuando falta name', () => {
    const result = validatePayload({
      email: 'juan@example.com',
      message: 'Necesito asesoría',
    });
    assert.equal(result, 'Falta el campo: name');
  });

  test('retorna mensaje de error cuando falta email', () => {
    const result = validatePayload({
      name: 'Juan Pérez',
      message: 'Necesito asesoría',
    });
    assert.equal(result, 'Falta el campo: email');
  });

  test('retorna mensaje de error cuando falta message', () => {
    const result = validatePayload({
      name: 'Juan Pérez',
      email: 'juan@example.com',
    });
    assert.equal(result, 'Falta el campo: message');
  });
});
```

- [ ] **Step 2: Correr el test para verificar que falla**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend
npx vitest run src/handlers/contact/app.test.ts
```

Expected: FAIL — `Cannot find module './app'` (el archivo `app.ts` todavía no existe).

- [ ] **Step 3: Implementación mínima**

```ts
// src/handlers/contact/app.ts
export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  area?: string;
  message: string;
  urgencia?: string;
  situacionPenal?: string;
  materiaFamilia?: string;
  laboralParte?: string;
  laboralSituacion?: string;
  monto?: string;
  horario?: string;
  website?: string;
}

const REQUIRED_FIELDS = ['name', 'email', 'message'] as const;

export function validatePayload(data: Partial<ContactPayload>): string | null {
  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      return `Falta el campo: ${field}`;
    }
  }
  return null;
}
```

- [ ] **Step 4: Correr el test para verificar que pasa**

```bash
npx vitest run src/handlers/contact/app.test.ts
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/handlers/contact/app.ts src/handlers/contact/app.test.ts
git commit -m "feat: validación de payload del formulario de contacto"
```

---

### Task 3: Armado del contenido del email (TDD)

**Files:**
- Modify: `arteagayaldunate-contact-backend/src/handlers/contact/app.ts`
- Test: `arteagayaldunate-contact-backend/src/handlers/contact/app.test.ts`

**Interfaces:**
- Consumes: `ContactPayload` de Task 2.
- Produces: `buildEmailContent(data: ContactPayload): { subject: string; text: string; html: string }`.

- [ ] **Step 1: Escribir el test que falla**

```ts
// agregar a src/handlers/contact/app.test.ts
import { buildEmailContent } from './app';

describe('buildEmailContent', () => {
  test('arma subject, text y html con los campos presentes', () => {
    const result = buildEmailContent({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      area: 'penal',
      message: 'Necesito asesoría urgente',
    });
    assert.match(result.subject, /Juan Pérez/);
    assert.match(result.subject, /penal/);
    assert.match(result.text, /Nombre: Juan Pérez/);
    assert.match(result.text, /Email: juan@example\.com/);
    assert.match(result.text, /Mensaje: Necesito asesoría urgente/);
    assert.match(result.html, /<strong>Nombre:<\/strong> Juan Pérez/);
  });

  test('escapa HTML en el mensaje para prevenir inyección', () => {
    const result = buildEmailContent({
      name: 'Juan',
      email: 'juan@example.com',
      message: '<script>alert(1)</script>',
    });
    assert.doesNotMatch(result.html, /<script>/);
    assert.match(result.html, /&lt;script&gt;/);
  });
});
```

- [ ] **Step 2: Correr el test para verificar que falla**

```bash
npx vitest run src/handlers/contact/app.test.ts
```

Expected: FAIL — `buildEmailContent is not a function`.

- [ ] **Step 3: Implementación mínima**

```ts
// agregar a src/handlers/contact/app.ts

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function buildEmailContent(
  data: ContactPayload
): { subject: string; text: string; html: string } {
  const subject = `Nueva consulta: ${data.name} (${data.area ?? 'sin área'})`;

  const fields: Array<[string, string | undefined]> = [
    ['Nombre', data.name],
    ['Email', data.email],
    ['Teléfono', data.phone],
    ['Área', data.area],
    ['Urgencia', data.urgencia],
    ['Mensaje', data.message],
  ];

  const present = fields.filter(([, value]) => value);

  const text = present.map(([label, value]) => `${label}: ${value}`).join('\n');

  const html = `<div>${present
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
    .join('')}</div>`;

  return { subject, text, html };
}
```

- [ ] **Step 4: Correr el test para verificar que pasa**

```bash
npx vitest run src/handlers/contact/app.test.ts
```

Expected: 6 tests PASS (los 4 de `validatePayload` + los 2 nuevos).

- [ ] **Step 5: Commit**

```bash
git add src/handlers/contact/app.ts src/handlers/contact/app.test.ts
git commit -m "feat: armado de contenido de email para el lead"
```

---

### Task 4: Handler completo — envío exitoso vía SES (TDD)

**Files:**
- Modify: `arteagayaldunate-contact-backend/src/handlers/contact/app.ts`
- Test: `arteagayaldunate-contact-backend/src/handlers/contact/app.test.ts`

**Interfaces:**
- Consumes: `validatePayload`, `buildEmailContent` de Tasks 2-3.
- Produces: `handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>`. Requiere `process.env.SES_FROM_EMAIL` y `process.env.RECIPIENTS_PARAMETER_NAME` seteados. Lee destinatarios vía `GetParameterCommand` de `@aws-sdk/client-ssm` (parámetro `StringList`, valor separado por comas) y envía vía `SendEmailCommand` de `@aws-sdk/client-ses`.

- [ ] **Step 1: Escribir el test que falla**

```ts
// agregar a src/handlers/contact/app.test.ts
import { mockClient } from 'aws-sdk-client-mock';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { handler } from './app';

const ses = mockClient(SESClient);
const ssm = mockClient(SSMClient);

function buildEvent(body: unknown) {
  return { body: JSON.stringify(body) } as any;
}

describe('handler', () => {
  beforeEach(() => {
    ses.reset();
    ssm.reset();
    process.env.SES_FROM_EMAIL = 'no-responder@arteagayaldunate.cl';
    process.env.RECIPIENTS_PARAMETER_NAME = 'arteagayaldunate/contact/recipients-test';
  });

  test('envía el email y responde ok:true cuando el payload es válido', async () => {
    ssm.on(GetParameterCommand).resolves({
      Parameter: { Value: 'destino1@example.com,destino2@example.com' },
    });
    ses.on(SendEmailCommand).resolves({ MessageId: 'abc-123' });

    const result = await handler(
      buildEvent({
        name: 'Juan Pérez',
        email: 'juan@example.com',
        message: 'Necesito asesoría',
      })
    );

    assert.equal(result.statusCode, 200);
    assert.deepEqual(JSON.parse(result.body), { ok: true });
    assert.equal(ses.commandCalls(SendEmailCommand).length, 1);

    const call = ses.commandCalls(SendEmailCommand)[0].args[0].input;
    assert.deepEqual(call.Destination?.ToAddresses, [
      'destino1@example.com',
      'destino2@example.com',
    ]);
    assert.deepEqual(call.ReplyToAddresses, ['juan@example.com']);
  });

  test('responde ok:false con status 400 cuando falta un campo requerido', async () => {
    const result = await handler(buildEvent({ name: 'Juan Pérez' }));
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), {
      ok: false,
      message: 'Falta el campo: email',
    });
    assert.equal(ses.commandCalls(SendEmailCommand).length, 0);
  });

  test('responde ok:true sin enviar email cuando el honeypot "website" viene lleno', async () => {
    const result = await handler(
      buildEvent({
        name: 'Bot',
        email: 'bot@example.com',
        message: 'spam',
        website: 'http://spam.example.com',
      })
    );
    assert.equal(result.statusCode, 200);
    assert.deepEqual(JSON.parse(result.body), { ok: true });
    assert.equal(ses.commandCalls(SendEmailCommand).length, 0);
  });
});
```

- [ ] **Step 2: Correr el test para verificar que falla**

```bash
npx vitest run src/handlers/contact/app.test.ts
```

Expected: FAIL — `handler is not a function`.

- [ ] **Step 3: Implementación mínima**

```ts
// agregar a src/handlers/contact/app.ts
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const sesClient = new SESClient({});
const ssmClient = new SSMClient({});

async function getRecipients(): Promise<string[]> {
  const parameterName = process.env.RECIPIENTS_PARAMETER_NAME;
  if (!parameterName) {
    throw new Error('RECIPIENTS_PARAMETER_NAME no configurado');
  }
  const result = await ssmClient.send(new GetParameterCommand({ Name: parameterName }));
  const value = result.Parameter?.Value ?? '';
  return value
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let data: Partial<ContactPayload>;
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: JSON_HEADERS,
      body: JSON.stringify({ ok: false, message: 'JSON inválido' }),
    };
  }

  if (data.website) {
    return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify({ ok: true }) };
  }

  const validationError = validatePayload(data);
  if (validationError) {
    return {
      statusCode: 400,
      headers: JSON_HEADERS,
      body: JSON.stringify({ ok: false, message: validationError }),
    };
  }

  try {
    const recipients = await getRecipients();
    const { subject, text, html } = buildEmailContent(data as ContactPayload);
    const fromEmail = process.env.SES_FROM_EMAIL;
    if (!fromEmail) {
      throw new Error('SES_FROM_EMAIL no configurado');
    }

    await sesClient.send(
      new SendEmailCommand({
        Source: `Arteaga & Aldunate Abogados <${fromEmail}>`,
        Destination: { ToAddresses: recipients },
        ReplyToAddresses: [data.email as string],
        Message: {
          Subject: { Data: subject },
          Body: {
            Text: { Data: text },
            Html: { Data: html },
          },
        },
      })
    );

    return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Error enviando email de contacto:', err);
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        ok: false,
        message: 'No se pudo enviar tu consulta. Intenta nuevamente.',
      }),
    };
  }
};
```

- [ ] **Step 4: Correr el test para verificar que pasa**

```bash
npx vitest run src/handlers/contact/app.test.ts
```

Expected: 9 tests PASS (los 6 anteriores + los 3 nuevos).

- [ ] **Step 5: Commit**

```bash
git add src/handlers/contact/app.ts src/handlers/contact/app.test.ts
git commit -m "feat: handler de contacto con envío exitoso vía SES"
```

---

### Task 5: Manejo de error cuando SES falla (TDD)

**Files:**
- Modify: `arteagayaldunate-contact-backend/src/handlers/contact/app.test.ts` (el código de `app.ts` ya soporta este caso desde Task 4 — este task solo agrega la cobertura de test que falta)

**Interfaces:**
- Consumes: `handler` de Task 4.

- [ ] **Step 1: Escribir el test que falla**

```ts
// agregar a src/handlers/contact/app.test.ts
test('responde ok:false con status 500 cuando SES lanza un error', async () => {
  ssm.on(GetParameterCommand).resolves({
    Parameter: { Value: 'destino1@example.com' },
  });
  ses.on(SendEmailCommand).rejects(new Error('Throttling'));

  const result = await handler(
    buildEvent({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      message: 'Necesito asesoría',
    })
  );

  assert.equal(result.statusCode, 500);
  assert.deepEqual(JSON.parse(result.body), {
    ok: false,
    message: 'No se pudo enviar tu consulta. Intenta nuevamente.',
  });
});
```

- [ ] **Step 2: Correr el test para verificar que falla o pasa**

```bash
npx vitest run src/handlers/contact/app.test.ts
```

Expected: PASS de inmediato — el `catch` del handler ya maneja este caso desde Task 4. Si falla, revisar que el `try/catch` alrededor de `sesClient.send` en Task 4 esté implementado tal como se muestra ahí.

- [ ] **Step 3: Commit**

```bash
git add src/handlers/contact/app.test.ts
git commit -m "test: cobertura de fallo de SES en el handler de contacto"
```

---

### Task 6: Template SAM (API Gateway + Lambda + SSM)

**Files:**
- Create: `arteagayaldunate-contact-backend/template.yaml`

**Interfaces:**
- Consumes: `src/handlers/contact/app.ts` (Handler: `app.handler`) de Tasks 2-5.
- Produces: recursos `RecipientsParameter` (SSM), `ContactApi` (API Gateway REST + API Key + Usage Plan), `ContactFunction` (Lambda). Output `ContactApiUrl`.

- [ ] **Step 1: Crear `template.yaml`**

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Backend de contacto para arteagayaldunate.cl (formulario -> SES)

Parameters:
  Stage:
    Type: String
    Default: prod
    AllowedValues:
      - dev
      - prod
  SesFromEmail:
    Type: String
    Description: Dirección remitente verificada en SES
    Default: no-responder@arteagayaldunate.cl
  InitialRecipients:
    Type: String
    Description: Lista inicial de destinatarios separados por coma
    Default: defensapenalprotegida@gmail.com

Globals:
  Function:
    Runtime: nodejs20.x
    MemorySize: 256
    Timeout: 15
    Architectures:
      - arm64

Resources:
  RecipientsParameter:
    Type: AWS::SSM::Parameter
    Properties:
      Name: !Sub /arteagayaldunate/contact/recipients-${Stage}
      Type: StringList
      Value: !Ref InitialRecipients
      Description: Correos que reciben notificación de nuevos leads del formulario de contacto

  ContactApi:
    Type: AWS::Serverless::Api
    Properties:
      Name: !Sub arteagayaldunate-contact-api-${Stage}
      StageName: !Ref Stage
      Cors:
        AllowMethods: "'POST,OPTIONS'"
        AllowHeaders: "'Content-Type,X-Api-Key'"
        AllowOrigin: "'https://arteagayaldunate.cl'"
      Auth:
        ApiKeyRequired: true
        UsagePlan:
          CreateUsagePlan: PER_API
          UsagePlanName: !Sub arteagayaldunate-contact-usage-${Stage}

  ContactFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub arteagayaldunate-contact-handler-${Stage}
      CodeUri: src/handlers/contact/
      Handler: app.handler
      Description: Recibe el formulario de contacto de arteagayaldunate.cl y notifica por SES
      Environment:
        Variables:
          SES_FROM_EMAIL: !Ref SesFromEmail
          RECIPIENTS_PARAMETER_NAME: !Sub arteagayaldunate/contact/recipients-${Stage}
      Policies:
        - SSMParameterReadPolicy:
            ParameterName: !Sub arteagayaldunate/contact/recipients-${Stage}
        - Statement:
            - Effect: Allow
              Action:
                - ses:SendEmail
                - ses:SendRawEmail
              Resource: '*'
      Events:
        ContactPost:
          Type: Api
          Properties:
            RestApiId: !Ref ContactApi
            Path: /contact
            Method: post
    Metadata:
      BuildMethod: esbuild
      BuildProperties:
        Minify: true
        Target: es2022
        Sourcemap: true
        EntryPoints:
          - app.ts
        External:
          - '@aws-sdk/*'

Outputs:
  ContactApiUrl:
    Description: URL del endpoint de contacto
    Value: !Sub https://${ContactApi}.execute-api.${AWS::Region}.amazonaws.com/${Stage}/contact
  ContactApiId:
    Description: ID de la API (para recuperar la API key con `aws apigateway get-api-keys`)
    Value: !Ref ContactApi
```

- [ ] **Step 2: Validar el template**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend
sam validate --lint
```

Expected: `template.yaml is a valid SAM Template` sin errores de lint.

- [ ] **Step 3: Commit**

```bash
git add template.yaml
git commit -m "feat: template SAM para API Gateway + Lambda + SSM"
```

---

### Task 7: Build y deploy a AWS ⚠️ requiere confirmación explícita

**Files:** ninguno (solo comandos de infraestructura)

Este task crea recursos reales en la cuenta AWS (API Gateway, Lambda, SSM Parameter, IAM roles). **No ejecutar sin que el usuario confirme explícitamente la cuenta/región AWS de destino y dé el sí para desplegar.**

- [ ] **Step 1: Build**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend
sam build --parallel
```

Expected: build exitoso, sin errores de esbuild.

- [ ] **Step 2: Correr los tests una vez más antes de desplegar**

```bash
npx vitest run
```

Expected: todos los tests (9 de Tasks 2-4 + 1 de Task 5 = 10) PASS.

- [ ] **Step 3: ⚠️ Deploy guiado (pausar y confirmar con el usuario antes de este paso)**

```bash
sam deploy --guided \
  --stack-name arteagayaldunate-contact-backend-prod \
  --parameter-overrides Stage=prod SesFromEmail=no-responder@arteagayaldunate.cl InitialRecipients=defensapenalprotegida@gmail.com
```

Expected: deploy exitoso. Guardar de los Outputs: `ContactApiUrl` y `ContactApiId`.

- [ ] **Step 4: Recuperar el valor de la API key generada**

```bash
aws apigateway get-api-keys --name-query arteagayaldunate-contact-usage-prod --include-values
```

Expected: un `apiKey.value` — este es el valor que se usará como `CONTACT_BACKEND_API_KEY` en Vercel (Task 9).

- [ ] **Step 5: Commit (solo si hubo cambios en `samconfig.toml` que sí se quieran versionar; por defecto está en `.gitignore`)**

No se requiere commit de código en este task — es puramente de infraestructura.

---

### Task 8: Verificación de dominio SES ⚠️ requiere confirmación explícita (toca DNS de producción)

**Files:** ninguno (solo comandos de infraestructura + registros DNS)

Este task modifica el DNS de `arteagayaldunate.cl`. **No ejecutar ni comunicar registros DNS al proveedor de dominio sin que el usuario lo confirme explícitamente**, conforme a la regla de no tocar infraestructura/dominios de producción sin autorización.

- [ ] **Step 1: Iniciar verificación del dominio en SES**

```bash
aws sesv2 create-email-identity --email-identity arteagayaldunate.cl
```

Expected: respuesta con los tokens DKIM (`DkimSigningAttributes.Tokens`, 3 valores) y el estado `VerificationStatus: PENDING`.

- [ ] **Step 2: ⚠️ Agregar los registros DNS (pausar y confirmar con el usuario antes de aplicar esto en el proveedor de DNS)**

Para cada uno de los 3 tokens DKIM devueltos, agregar un registro CNAME:
```
<token>._domainkey.arteagayaldunate.cl  CNAME  <token>.dkim.amazonses.com
```

Además, agregar un registro TXT SPF (o extender el existente) autorizando a Amazon SES:
```
arteagayaldunate.cl  TXT  "v=spf1 include:amazonses.com ~all"
```

- [ ] **Step 3: Confirmar verificación**

```bash
aws sesv2 get-email-identity --email-identity arteagayaldunate.cl
```

Expected: `VerificationStatus: SUCCESS` (puede tardar hasta 72 horas en propagar DNS).

- [ ] **Step 4: Solicitar salida de sandbox de SES (si la cuenta está en sandbox)**

```bash
aws sesv2 get-account
```

Expected: revisar `ProductionAccessEnabled`. Si es `false`, solicitar salida de sandbox desde la consola de AWS (Service Quotas → SES → "Amazon SES Sending Limits") — es un trámite manual con AWS Support, no un comando CLI. Documentar el ticket abierto en el ledger de progreso del proyecto.

No hay commit en este task — es puramente de infraestructura/DNS.

---

### Task 9: Actualizar `api/contact.ts` en landing-tech para hacer proxy al backend AWS

**Files:**
- Modify: `landing-tech/api/contact.ts`
- Delete: `landing-tech/api/emailTemplate.ts`
- Delete: `landing-tech/api/emailTemplate.test.ts`
- Modify: `landing-tech/package.json` (quitar dependencia `nodemailer`)

**Interfaces:**
- Consumes: `ContactApiUrl` y la API key de Task 7 (vía variables de entorno `CONTACT_BACKEND_URL` y `CONTACT_BACKEND_API_KEY` en Vercel).
- Produces: mismo contrato HTTP que hoy consume `src/lib/leadApi.ts` — `POST /api/contact` responde `{ ok: boolean, message?: string }`. **No se modifica `leadApi.ts` ni `ContactSection.tsx`.**

- [ ] **Step 1: Reescribir `api/contact.ts` como proxy**

```ts
// landing-tech/api/contact.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function handlePOST(req: VercelRequest, res: VercelResponse) {
  const backendUrl = process.env.CONTACT_BACKEND_URL;
  const backendApiKey = process.env.CONTACT_BACKEND_API_KEY;

  if (!backendUrl || !backendApiKey) {
    return res.status(500).json({
      ok: false,
      message: "Falta configuración del backend de contacto.",
    });
  }

  try {
    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": backendApiKey,
      },
      body: JSON.stringify(req.body || {}),
    });

    const data = await backendRes.json().catch(() => ({}));
    return res.status(backendRes.status).json(data);
  } catch (err) {
    console.error("Error reenviando /api/contact al backend AWS:", err);
    return res.status(500).json({
      ok: false,
      message: "Error de conexión con el backend de contacto.",
    });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    return handlePOST(req, res);
  }

  return res.status(405).json({
    ok: false,
    message: "Método no permitido",
  });
}
```

- [ ] **Step 2: Eliminar los archivos obsoletos de armado de email**

```bash
cd /Users/lfgg/paldunate/landing-tech
rm api/emailTemplate.ts api/emailTemplate.test.ts
```

- [ ] **Step 3: Quitar `nodemailer` de las dependencias**

```bash
npm uninstall nodemailer
```

- [ ] **Step 4: Verificar que el resto de tests de landing-tech siguen pasando**

```bash
npm test
```

Expected: todos los tests existentes (incluyendo `src/components/ContactSection.test.tsx`) siguen en PASS — no dependen de `api/contact.ts`.

- [ ] **Step 5: Commit**

```bash
git add api/contact.ts package.json package-lock.json
git rm api/emailTemplate.ts api/emailTemplate.test.ts
git commit -m "feat: api/contact.ts como proxy hacia el backend AWS/SES"
```

---

### Task 10: Configurar variables de entorno en Vercel y verificación end-to-end ⚠️ requiere confirmación explícita

**Files:** ninguno (configuración de Vercel + verificación manual en el navegador)

Este task agrega/reemplaza variables de entorno de producción en Vercel. **Pausar y confirmar con el usuario antes de aplicar cambios en el dashboard/CLI de Vercel**, y antes de eliminar las variables SMTP antiguas (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`) que ya no se usan.

- [ ] **Step 1: ⚠️ Agregar en Vercel (Production) las nuevas variables**

```
CONTACT_BACKEND_URL=<ContactApiUrl del Output de Task 7>
CONTACT_BACKEND_API_KEY=<valor recuperado en Task 7, Step 4>
```

- [ ] **Step 2: Redeploy de landing-tech en Vercel**

(Vía dashboard de Vercel o `vercel --prod`, según cómo se despliega normalmente este proyecto.)

- [ ] **Step 3: Verificación manual en el navegador**

Llenar el formulario en `https://arteagayaldunate.cl/#contacto` con datos de prueba y confirmar:
1. El toast de éxito aparece ("Consulta enviada").
2. El correo llega a `defensapenalprotegida@gmail.com` (revisar también spam) dentro de 1-2 minutos.
3. El campo "Responder a" del correo recibido corresponde al email ingresado en el formulario.

- [ ] **Step 4: ⚠️ Limpiar las variables SMTP antiguas en Vercel (solo tras confirmar que el paso 3 funcionó)**

Eliminar `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` de las variables de entorno de Vercel.

No hay commit de código en este task.
