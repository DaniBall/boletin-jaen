# PLAN.md — Boletín diario de Jaén

Documento vivo: marca las casillas al completar tareas. Las tarifas y los datos de mercado se comprobaron en septiembre de 2026; vuelve a verificarlos antes de cualquier decisión con coste.

## 1. Producto

- **Promesa (borrador):** lo útil de Jaén, cada mañana en tu WhatsApp, en menos de tres minutos.
- **Para quién:** gente que vive o trabaja en Jaén capital.
- **Alcance:** la capital y lo del entorno que afecte a quien vive en ella (accesos, La Guardia, Los Villares, Mancha Real, Torredelcampo…). De la provincia, solo lo que te cambie el día.
- **Frecuencia:** de lunes a viernes. El viernes incluye «Este finde». Sin edición en festivos (lista configurable).
- **Qué no es:** ni un periódico, ni una agenda exhaustiva, ni opinión política. Sucesos, solo si afectan a la seguridad o a la movilidad.
- **Ganchos de lanzamiento posibles:** la Feria de San Lucas (octubre) y el inicio de la campaña de la aceituna.
- **Contexto competitivo:** Logronews forma parte de una red de ediciones locales (Pamplona, Logroño, Bilbao, Tudela y Elche) que dice estar preparando ciudades nuevas. Identidad propia desde el primer día; como alternativa estratégica, proponerles colaborar.

## 2. Anatomía de una edición

| Orden | Sección | La escribe | Datos |
|---|---|---|---|
| 1 | Saludo, fecha, nº de edición y titular del día | Código + Claude (titular) | todo lo recogido |
| 2 | ☀️ El tiempo | Código | AEMET |
| 3 | 📅 Hoy en Jaén (viernes: 🎉 Este finde) | Claude | agenda |
| 4 | 🚧 Movilidad | Claude | cortes, obras, DGT |
| 5 | 📰 Te afecta (3–5 entradas) | Claude | noticias útiles |
| 6 | 💊 Farmacias de guardia | Código | Colegio de Farmacéuticos |
| 7 | ⛽ Gasolina más barata | Código | Ministerio |
| 8 | 🫒 El aceite | Código | precio en origen |
| 9 | Cierre: envía tu aviso y comparte | Código (textos rotativos) | — |

- Si una sección no tiene datos, se omite. Nunca «sin información».
- Objetivo: 3.000 caracteres como máximo (menos de 3 minutos de lectura). Si hay poco, la edición es corta.
- Numeración correlativa («Edición nº N») en el frontmatter.

Ejemplo de archivo (lo que va entre llaves son marcadores):

```markdown
---
fecha: 2026-09-21
numero: 12
estado: borrador
fuentes:
  - id: ayto-agenda
    nombre: Ayuntamiento de Jaén
    url: "{url}"
avisos:
  - "farmacias: la fuente no respondió; sección omitida"
---

¡Buenos días, Jaén! Lunes 21 de septiembre, edición nº 12. {titular del día}

## ☀️ El tiempo
Máxima de {máx}° y mínima de {mín}°. {lluvia y viento}. Fuente: AEMET.

## 📅 Hoy en Jaén
- **{Plan}**: {qué, cuándo, dónde y cuánto}. [Más info]({url})

## 📰 Te afecta
- **{Titular propio}**: {por qué te importa}. [Fuente]({url})

## ⛽ Gasolina más barata
- Gasóleo A: {precio} € en {estación} ({dirección})

---
¿Sabes algo que deberíamos contar? {enlace al buzón de avisos}
```

**Render a WhatsApp** (desde el AST de Markdown, no con expresiones regulares):

- `## Título` → `*Título*` en su propia línea, con una línea en blanco antes.
- `**x**` → `*x*`; `_x_` se queda igual; `~~x~~` → `~x~`.
- Viñetas → `• `.
- `[texto](url)` → `texto` y, en la línea siguiente, `👉 url` (URL limpia, sin parámetros `utm_`).
- Última línea: el enlace a la edición en la web.
- Tests con casos límite: `*` y `_` en URLs y nombres, emojis y listas vacías.

## 3. Guía de estilo (base de `prompts/redaccion.system.md`)

- Español de España, tuteo, cercano y útil. Humor ligero y de aquí, sin caricaturizar Jaén ni a los jiennenses.
- Cada entrada: un título propio en negrita y una o dos frases con lo práctico (qué, cuándo, dónde, cuánto y cómo).
- Prioridad: lo que cambia el día (cortes, plazos, ayudas, servicios, planes gratis), luego lo curioso y, al final, lo institucional.
- De las instituciones se cuenta el efecto práctico, sin valoraciones ni tono partidista.
- Fechas relativas a la edición («hoy», «mañana», «el sábado»). Horas y precios, solo si vienen en la fuente.
- Sin clickbait ni exclamaciones en cadena. Emojis solo en los títulos de sección.
- Se resume con palabras propias, sin reutilizar frases de las fuentes. Se atribuye cuando da confianza («según el Ayuntamiento»).
- Nunca se rellena: si hay poco, se dice poco.
- Nada del eslogan ni de las fórmulas de Pamplonews/Logronews.

## 4. Fuentes (inventario inicial por verificar)

El primer paso de cada colector es confirmar que la fuente existe, su formato y sus condiciones de uso. Orden de preferencia: API o RSS, luego HTML estable y, si no, nada. Con fuentes privadas, pedir permiso o limitarse a enlazar.

| Sección | Fuente candidata | Método probable | Notas |
|---|---|---|---|
| Tiempo | AEMET OpenData, municipio 23050 | API con clave gratuita | Citar «Fuente: AEMET». Open-Meteo solo para desarrollar (su plan gratuito es para uso no comercial) |
| Agenda | Ayuntamiento de Jaén (agenda y notas de prensa) | HTML o RSS | Fuente primaria |
| Agenda | EnJaen.es | HTML | Web privada: pedir permiso o solo enlazar |
| Agenda | Diputación (Jaén Paraíso Interior) | HTML | Es provincial: filtrar a la capital |
| Agenda | Universidad de Jaén, Teatro Infanta Leonor, Teatro Darymelia, Auditorio de la Alameda | HTML o RSS | Programación |
| Movilidad | Ayuntamiento (cortes y obras) | HTML o RSS | Lo que la Policía Local publica solo en redes sociales queda fuera |
| Movilidad | DGT, Punto de Acceso Nacional (DATEX II) | XML | Solo accesos a la capital (A-44, A-316) |
| Noticias | RSS de Diario JAÉN, Jaén Hoy, Viva Jaén, Lacontradejaén, Ideal Jaén, Hora Jaén y noticiasdejaen.es | RSS | Titular y enlace; el resumen es propio |
| Farmacias | Colegio Oficial de Farmacéuticos de Jaén | HTML | Investigar el formato |
| Carburantes | API REST de precios de carburantes del Ministerio | JSON sin clave | Sacar el IDMunicipio de Jaén del listado de la provincia |
| Aceite | Poolred o Infaoliva | HTML | Revisar condiciones de uso; dato del día anterior |
| Deporte (fase 1.5) | Real Jaén, Jaén Paraíso Interior FS | HTML | Partidos del finde |
| Bus (fase 2+) | Consorcio de Transporte Metropolitano del Área de Jaén | API de la red CTAN | Cambios de líneas y horarios |

## 5. Flujo diario

**Modo mañana (por defecto)**

1. Cron `17 4 * * 1-5` (UTC, es decir, 06:17 en verano y 05:17 en invierno): `collect` en paralelo, `select`, `draft`, `validate` y `render`.
2. El workflow abre el PR `edicion/AAAA-MM-DD` con la vista previa de WhatsApp en un bloque de código, la tabla de salud de las fuentes, los avisos del validador y lo que se ha descartado.
3. El editor lo revisa desde la app de GitHub y, si hace falta, edita el `.md` en el propio PR.
4. Merge → la web se despliega en uno o dos minutos.
5. El editor abre la edición, pulsa «Copiar para WhatsApp» y la pega en el Canal hacia las 07:30.

**Modo víspera:** cron `17 19 * * 0-4` (UTC), que genera la edición del día siguiente para revisarla por la noche. Pegarla en el Canal sigue siendo cosa de la mañana, salvo con WAHA (fase 1b).

Sin merge no se publica nada.

## 6. Redacción con Claude

- Una llamada por edición: modelo `claude-sonnet-5`; en `system`, la guía de estilo; en `user`, la fecha, el día de la semana y los items seleccionados en JSON (id, título, resumen de la fuente, fecha, lugar y URL).
- Salida con structured outputs (`output_config.format` con JSON Schema; comprueba en la documentación que el modelo lo admite):

```ts
type Entrada = { item_id: string; titulo: string; texto: string }; // sin URLs en `texto`

type Borrador = {
  titular: string; // una frase para el saludo
  secciones: {
    agenda: Entrada[];
    movilidad: Entrada[];
    te_afecta: Entrada[];
    finde?: Entrada[];
  };
  descartes: { item_id: string; motivo: string }[]; // se muestran en el PR
};
```

- `validate` comprueba que:
  - cada `item_id` existe y pertenece a su sección;
  - el `texto` no incluye URLs (el enlace lo pone el código a partir del item);
  - las cifras, horas y fechas del texto aparecen en el item (si no, genera un aviso);
  - se respetan las longitudes (título de 60 caracteres como máximo, texto de dos frases como máximo y edición de 3.000 caracteres como máximo);
  - no aparece ninguna expresión de la lista prohibida (eslóganes ajenos, clickbait).
- Volumen orientativo: unos 15.000 tokens de entrada y 2.000 de salida por edición (ver costes en la sección 9).

## 7. Web

- Páginas: inicio (edición de hoy y botón para seguir el Canal), `/ediciones/AAAA-MM-DD`, archivo, RSS de ediciones, aviso legal, privacidad y cookies.
- En cada edición: «Copiar para WhatsApp» (al portapapeles), «Compartir por WhatsApp» (`https://wa.me/?text=…`), créditos de las fuentes e imagen OG.
- Sin cookies. Analítica sin cookies (Cloudflare Web Analytics o GoatCounter).

**Brief de diseño.** Antes de programar la web, define los tokens (4–6 colores con su hex, las tipografías con su papel y un boceto del layout) y revísalos contra este brief:

- Trabajo principal: unirse al Canal con un toque, y leer y compartir la edición de hoy.
- Hero: la edición de hoy tal y como llega al WhatsApp, junto al botón «Seguir el canal».
- Identidad propuesta: el olivar y el aceite (verde oliva profundo y dorado de aceite nuevo) sobre blanco. Mascota posible: el Lagarto de la Malena, dibujado por alguien de Jaén.
- Un solo elemento audaz (la ilustración o el bloque de la edición) y el resto, sobrio.
- Evitar: la identidad de Logronews/Pamplonews, el fondo crema con serif y terracota, la maqueta de periódico con filetes, las tarjetas redondeadas idénticas con sombra, las etiquetas en mayúsculas espaciadas y las flechas «→» en los botones.
- Suelo de calidad: mobile-first, contraste AA, foco visible y respeto a `prefers-reduced-motion`.
- Textos con verbos claros: «Seguir el canal», «Leer la edición de hoy», «Copiar para WhatsApp», «Compartir».

## 8. Fases

### Fase 0: cimientos

- [ ] (Editor) Crear el repo. En Settings → Actions, permitir que Actions cree Pull Requests. En Settings → Pages, elegir «GitHub Actions» como origen.
- [ ] (Editor) Pedir la clave gratuita de AEMET OpenData y guardar `ANTHROPIC_API_KEY` y `AEMET_API_KEY` como secrets.
- [x] Astro con TypeScript estricto, ESLint y Prettier, Vitest, `.env.example` y `.gitignore` (incluida la caché del pipeline).
- [x] `pipeline/config.ts`: marca provisional, URL del Canal, alcance, zona horaria, secciones, festivos y flags.
- [x] Una edición de ejemplo escrita a mano en `content/ediciones/` y su página en la web.
- [x] Render de Markdown a WhatsApp, con tests.
- [x] Workflows `ci.yml` (typecheck, lint, test y build) y `deploy.yml` (Pages en cada push a `main`).

### Fase 1: MVP, salir en el Canal

- [ ] `pipeline/lib/http`: timeout, reintento, caché, `robots.txt` y User-Agent.
- [ ] Colectores mínimos, cada uno con fixture y test: tiempo (AEMET), carburantes, agenda (Ayuntamiento y una fuente más) y noticias (3–4 RSS).
- [ ] `select`: ventana de fechas, alcance, deduplicado (URL y similitud de título) y exclusión de lo publicado en los últimos 14 días.
- [ ] `draft` con structured outputs y prompts versionados en `prompts/`.
- [ ] `validate` y sección «Avisos».
- [ ] Workflow `borrador.yml` (cron y ejecución manual con `--fecha`) que abre el PR descrito en la sección 5.
- [ ] Página de edición con copiar y compartir, archivo y RSS.
- [ ] Landing con la edición de hoy y el botón «Seguir el canal».
- [ ] Páginas legales con huecos para los datos del titular.
- [ ] (Editor) Número dedicado con WhatsApp Business (la app gratuita): crear el Canal, añadir tu número personal como segundo admin y poner la URL en la config.
- [ ] Una semana de ensayo sin publicar para ajustar el prompt y las fuentes. Después, lanzamiento.

### Fase 1.5: más Jaén

- [ ] Colectores de farmacias, aceite, cortes y obras, DGT, Universidad de Jaén y teatros.
- [ ] Edición de viernes con «Este finde».
- [ ] Buzón de vecinos: el número de WhatsApp Business para avisos y un formulario de eventos.
- [ ] Imagen OG por edición.
- [ ] Si una fuente devuelve 0 items tres días seguidos, el workflow abre un issue.
- [ ] Bloques de patrocinio por sección, configurables en `pipeline/config.ts` y marcados como «Patrocinado» (sección 10).
- [ ] Página «Anúnciate» con los formatos y un contacto, sin precios públicos al principio.

### Fase 1b (opcional): publicar en el Canal sin tocar el móvil

- [ ] WAHA autoalojado en Docker, en un servidor pequeño siempre encendido, con el número dedicado. Publica a la hora fijada la edición ya aprobada.
- [ ] Detrás de un flag. Es una API no oficial y el número puede acabar bloqueado; por eso el Canal tiene un segundo admin.

### Fase 2: API oficial de WhatsApp

Infraestructura: Cloudflare Worker + D1 para el webhook y los suscriptores (revisar los límites del plan gratuito). La web sigue en Pages.

- [ ] Alta con consentimiento explícito: enlace `wa.me` con el texto «ALTA» (así el número llega verificado) o formulario (nombre, teléfono, CP 230xx opcional y casilla). Guardar la fecha y la versión del texto de consentimiento.
- [ ] Webhook con la firma `X-Hub-Signature-256` verificada. ALTA y BAJA; todo lo demás va al buzón de avisos.
- [ ] Plantilla de marketing aprobada por Meta: saludo, titular del día como variable (las variables no admiten saltos de línea; verificarlo), botón con la URL de la edición y opción de baja.
- [ ] Envío por lotes dentro de los límites del número, guardando estados (enviado, entregado, leído, error) y coste estimado.
- [ ] Panel mínimo: altas, bajas, entregas, lecturas y coste del mes.
- [ ] Bloque de patrocinio en la edición, marcado como publicidad.

Tarifas en España (agosto de 2026): 0,0509 € por mensaje de marketing entregado. Desde el 1 de octubre de 2026, Meta cobra también los mensajes de servicio dentro de la ventana de 24 h. Además, Meta puede no entregar algunos mensajes de marketing por sus límites por usuario, así que hay que medir y no reintentar en bucle.

### Criterio para pasar a la fase 2 (propuesta, ajústalo)

- [ ] 1.000 seguidores o más en el Canal, lectura estable y un patrocinio que cubra el coste estimado de los envíos (suelo de precio en la sección 10).

## 9. Costes

| Concepto | Fase 1 | Fase 2 |
|---|---|---|
| Claude API (Sonnet 5: 2 $ por millón de tokens de entrada y 10 $ de salida) | ≈ 1–2 $/mes | igual |
| GitHub Actions y Pages | 0 € | 0 € |
| Dominio | unos 10–15 €/año | igual |
| WhatsApp | 0 € (Canal) | ≈ 1,12 € por suscriptor y mes (22 envíos × 0,0509 €) |
| Servidor | 0 € (VPS pequeño solo si hay WAHA) | Worker + D1 (gratis o pocos euros) |

## 10. Financiación

**Referencia.** Logronews no publica cifras, pero funciona con el modelo de la red de Pamplonews, según las entrevistas a su fundador en la Revista de Innovación en Periodismo (diciembre de 2024) y en Tendenci@s (abril de 2026):

- Gratis para el lector: los ingresos vienen de empresas e instituciones locales. Encaja con el mercado, porque en España solo un 12 % paga por noticias (Digital News Report 2024).
- Casi sin publicidad clásica: ninguna en la web y muy poca en el boletín. Venden sobre todo visibilidad pactada con entidades que quieren que se destaquen sus actividades.
- Además: patrocinio de productos (su app de empleo la patrocinó la Cámara de Comercio de Navarra), herramientas para el comercio local (cupones y sorteos) y desarrollo de apps para entidades, que fue la línea que empezó a crecer sola.
- La tienda de merchandising fue un experimento con pocos ingresos y el primer evento no dejó dinero.
- Lo que lo hace viable es el coste: un equipo mínimo (tres personas para todas las ediciones en 2026) y tecnología compartida. El tono positivo y sin polémicas facilita los patrocinios.

### Principios

- El lector no paga y lo pagado nunca se disfraza: todo va marcado como «Patrocinado» o «Publicidad», como exige la LSSI.
- Como mucho un bloque patrocinado por edición, con exclusividad por categoría (un solo gimnasio, una sola almazara…).
- El patrocinador no decide ni revisa contenidos, y la información sobre él se trata como cualquier otra.
- Publicidad institucional sí, etiquetada y sin condicionar la información. Propaganda de partidos, apuestas y productos milagro, no.
- Ningún cliente por encima del 40 % de los ingresos (propuesta, ajústalo).
- Nada de tienda ni eventos propios al principio.

### Formatos

| Formato | Qué es | Clientes naturales en Jaén | Fase |
|---|---|---|---|
| Patrocinio de sección | «🫒 El aceite, con {marca}» o «☀️ El tiempo, con {marca}», por semanas o meses | Cooperativas, almazaras y denominaciones de origen del aceite; comercios y marcas locales | 1.5 |
| Visibilidad pactada | Destacar la programación de una entidad, con etiqueta | Ayuntamiento, Diputación, Universidad de Jaén, teatros y promotores | 1.5 |
| Sorteo patrocinado | Entradas, cenas o productos para los lectores | Hostelería, cultura y comercio | 1.5 |
| Patrocinio de una herramienta | Una utilidad propia (farmacias de guardia, precio del aceite, empleo) con su patrocinador | Cámara de Comercio, organizaciones empresariales y Diputación | 2 |
| Comercio local | Ofertas y cupones de comercios de barrio | Asociaciones de comerciantes | 2 |
| Servicios a medida | Webs y apps para entidades locales | Instituciones y empresas | Cuando surja |

### Precio

- Fase 1, sin tarifas públicas: un patrocinador fundador a precio simbólico a cambio de testimonio y opinión, y cinco conversaciones con posibles clientes antes de construir nada para anunciantes.
- Dossier comercial con datos reales: seguidores del Canal, visitas a la web por edición, clics salientes y avisos recibidos (en fase 2, también entregas y lecturas).
- Suelo en fase 2: los patrocinios del mes deben cubrir al menos el envío, unos 1,12 € por suscriptor. Con 2.000 suscriptores son unos 2.240 €/mes; repartido entre cuatro patrocinadores de sección, 560 € cada uno solo para empatar.

### Administración

- Para facturar hay que estar dado de alta (autónomo o sociedad): consúltalo con una gestoría antes del primer cobro.
- Acuerdo por escrito con cada patrocinador: formato, fechas, precio, etiqueta de publicidad y que no condiciona los contenidos.

### Tareas del editor

- [ ] Lista de 20 posibles clientes en Jaén, por categorías.
- [ ] Cinco conversaciones de validación antes de fijar precios.
- [ ] Patrocinador fundador.
- [ ] Dossier comercial con los datos de la fase 1.

## 11. Legal (mínimos; no es asesoramiento)

- Fase 1: aviso legal (LSSI: titular, NIF y contacto), política de privacidad y política de cookies (declarando que no hay). Solo se tratan los datos de quien envía avisos de forma voluntaria.
- Fase 2: RGPD completo (consentimiento, finalidad, conservación, derechos, baja inmediata, registro de actividades y encargados como Meta y Cloudflare), comunicaciones comerciales con consentimiento previo (LSSI) y publicidad identificable. Conviene revisarlo con una asesoría.
- Contenidos: resúmenes propios con enlace, imágenes propias o con licencia y atribución de los datos (AEMET, Ministerio).

## 12. Riesgos

| Riesgo | Mitigación |
|---|---|
| Una fuente cambia su HTML | Fixtures, issue automático y commit `:alien:` |
| Alucinaciones | Cifras por código, validador y revisión humana |
| Todo depende de una persona cada mañana | Modo víspera, WAHA o un colaborador local con permisos en el repo |
| Choque de marca con la red de Logronews | Identidad propia, o proponerles colaborar |
| Coste de la fase 2 | No activarla sin patrocinio; tope de gasto mensual con alertas |
| Depender de un solo cliente o institución | Tope del 40 % por cliente y cartera variada (sección 10) |
