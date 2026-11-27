# Jimnasio

[![Deploy a GitHub Pages](https://github.com/CarlosValentinVV/AppGimnasio/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/CarlosValentinVV/AppGimnasio/actions/workflows/deploy-pages.yml)
[![Angular](https://img.shields.io/badge/Angular-22.2-DD0031?logo=angular&logoColor=white)](https://angular.dev/)

Aplicación **SPA (Single Page Application)** desarrollada con Angular para **Jimnasio**, un gimnasio de alto rendimiento en Madrid.

La aplicación se usa **principalmente desde GitHub Pages**: cada cambio en la rama principal se compila y se publica de forma automática en <https://carlosvalentinvv.github.io/AppGimnasio/>. Este README explica ese despliegue, cómo ejecutar y compilar el proyecto en local y cómo están organizados y documentados los componentes.

---

## Índice

- [Web en GitHub Pages (despliegue principal)](#web-en-github-pages-despliegue-principal)
- [Características de la aplicación](#características-de-la-aplicación)
- [Tecnologías y requisitos](#tecnologías-y-requisitos)
- [Instalación local](#instalación-local)
- [Desarrollo en local](#desarrollo-en-local)
- [Compilación local](#compilación-local)
- [Pruebas unitarias](#pruebas-unitarias)
- [Comentarios en el código](#comentarios-en-el-código)
- [Funcionamiento y uso de los componentes](#funcionamiento-y-uso-de-los-componentes)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Formato y convenciones de código](#formato-y-convenciones-de-código)

---

## Web en GitHub Pages (despliegue principal)

La URL pública de la aplicación es:

**👉 <https://carlosvalentinvv.github.io/AppGimnasio/>**

Lo que se publica **no es el código fuente**, sino el resultado de la compilación de producción que genera Angular en `dist/AppGimnasio/browser`.

### Cómo se publica automáticamente

El repositorio incluye el flujo [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml), que se lanza:

- automáticamente con cada `push` a `master` (o `main`);
- manualmente desde la pestaña **Actions → Deploy a GitHub Pages → Run workflow**.

Los pasos del workflow son:

1. Descargar el repositorio (`actions/checkout`).
2. Instalar Node.js 24 y restaurar la caché de npm (`actions/setup-node`).
3. Instalar dependencias con `npm ci` (usa `package-lock.json`).
4. Compilar con `npm run build -- --base-href "/<nombre-del-repositorio>/"`.
5. Generar `404.html` con `node scripts/postbuild-pages.mjs`.
6. Preparar GitHub Pages, subir `dist/AppGimnasio/browser` como artefacto y publicarlo (`actions/deploy-pages`).

> El `--base-href` se calcula con el nombre real del repositorio, así que funciona aunque el proyecto se renombre. La ruta de salida `dist/AppGimnasio/browser` está ligada al nombre del proyecto en `angular.json` (`AppGimnasio`).

### Configuración inicial en GitHub (solo una vez)

1. Entrar en el repositorio → **Settings** → **Pages**.
2. En **Build and deployment**, elegir **Source: GitHub Actions**.
3. Hacer `push` a la rama principal y esperar a que termine el workflow.

### Por qué funcionan las rutas al recargar

GitHub Pages es un alojamiento de archivos estáticos: no sabe que `/AppGimnasio/perfil` es una ruta de Angular. Se solucionan con tres piezas:

- **`baseHref` absoluto** (`/AppGimnasio/` en `angular.json`, sobrescrito por el workflow): permite que los archivos JS, CSS e imágenes se resuelvan igual desde cualquier ruta.
- **`404.html`**: [`scripts/postbuild-pages.mjs`](scripts/postbuild-pages.mjs) copia `index.html` como `404.html`. GitHub Pages sirve ese archivo cuando la ruta no existe como archivo físico, de modo que Angular arranca y resuelve la URL.
- **`public/.nojekyll`**: archivo vacío que evita que GitHub Pages procese el sitio con Jekyll.

Gracias a esto, enlaces como `/AppGimnasio/login` o `/AppGimnasio/perfil` funcionan también al recargar la página o al compartirlos.

### Otros detalles de la versión publicada

- GitHub Pages sirve por **HTTPS**, requisito necesario para que la API Web Crypto (`crypto.subtle`) pueda cifrar contraseñas.
- El cambio de tema claro/oscuro es global y se comparte entre todas las pantallas, pero **no se guarda** entre recargas.
- El inicio de sesión es **de práctica**: los usuarios viven en el `localStorage` de cada navegador; no es un sistema seguro para usuarios reales.

---

## Características de la aplicación

1. **Página de inicio** (`/home`; la raíz `/` redirige aquí): presentación del gimnasio, filtro de clases por categoría (fuerza, cardio, mente), planes con precio mensual/anual, opiniones de clientes y preguntas frecuentes.
2. **Perfil del cliente** (`/perfil`, protegido por guard de sesión): estadísticas, gráfico de asistencia, objetivo mensual, logros, visitas recientes, datos personales y membresía, organizado en tres pestañas (Resumen, Asistencia, Datos).
3. **Acceso** (`/login`): inicio de sesión y registro con formularios reactivos y validaciones; al entrar o registrarse se navega al perfil.
4. **Modo claro / oscuro** compartido por toda la aplicación y controlado desde el header.
5. **Diseño adaptable** a móvil con menú hamburguesa.

### Rutas

| Pantalla                  | URL                          | Cómo llegar desde la web                                        |
|---------------------------|------------------------------|-----------------------------------------------------------------|
| Inicio                    | `/home`                      | Logo **JIMNASIO** del header (la raíz `/` redirige aquí)        |
| Perfil del cliente        | `/perfil`                    | Botón **Mi perfil** del header (requiere sesión iniciada)       |
| Acceso (login / registro) | `/login`                     | Botón **Acceso** del header (en móvil, dentro del menú)         |

En GitHub Pages, las mismas rutas se escriben con el prefijo `/AppGimnasio/` (por ejemplo, `https://carlosvalentinvv.github.io/AppGimnasio/perfil`). Cualquier URL desconocida redirige a `/home`.

Los enlaces del header *Por qué elegirnos, Clases, Planes, Opiniones y Preguntas* son anclas a secciones de la página de inicio (`#caracteristicas`, `#clases`, `#planes`, `#testimonios`, `#faq`).

### Uso del login

1. Entrar en `/login` y abrir la pestaña **Registrarse**.
2. Rellenar nombre (mínimo 3 caracteres), correo dos veces, fecha de nacimiento (no puede ser futura) y contraseña (mínimo 8 caracteres, dos veces), y pulsar **Crear cuenta**.
3. La cuenta se crea, se abre la sesión y la aplicación navega directamente a `/perfil`.
4. Para volver a entrar, usar **Iniciar sesión** con el correo y la contraseña. Desde el header se puede cerrar la sesión.

> Los usuarios se guardan en `localStorage` (clave `app.usuarios`) y la sesión en `sessionStorage` (clave `app.sesion`). La contraseña **nunca** se guarda en texto plano: se almacena un hash PBKDF2-SHA256 con sal. Es un sistema **de práctica**, no seguro para usuarios reales: los datos solo existen en ese navegador y cualquiera puede verlos con las herramientas de desarrollo. El cifrado exige `localhost` o HTTPS.

---

## Tecnologías y requisitos

- **Framework:** Angular 22.2+ (componentes standalone, sin NgModules).
- **Lenguaje:** TypeScript 6.x.
- **Estilos:** CSS3 (sin frameworks de UI).
- **Navegación:** Angular Router con scroll a anclas.
- **Formularios:** Angular Reactive Forms.
- **Estado reactivo:** `signal` / `computed` de Angular.
- **Pruebas:** Vitest + jsdom (`@angular/build:unit-test`).
- **Formato:** EditorConfig (`.editorconfig`); no se usa Prettier ni ESLint.

### Prerrequisitos para trabajar en local

- **Node.js 24+**
- **npm 11+**
- Angular CLI 22.2+ *(opcional: el proyecto incluye su propia copia y se puede usar con `npm`)*

El requisito está **declarado en el proyecto**, pero **no bloquea** el trabajo: si usas una versión anterior verás un aviso y podrás seguir compilando.

| Archivo | Para qué sirve |
|---------|----------------|
| `package.json` | `"engines": { "node": ">=24", "npm": ">=11" }` declara las versiones mínimas recomendadas. |
| `.npmrc` | `engine-strict=false`: npm muestra el aviso `EBADENGINE` pero **no falla**; además anula un `engine-strict=true` que puedas tener en tu configuración global. |
| `scripts/check-versiones.mjs` | Compara las versiones instaladas con `engines` y `packageManager` y muestra un aviso (`⚠️`) por consola sin detener el proceso. |
| Hooks `prestart`, `prebuild`, `prebuild:pages`, `prewatch`, `pretest` | Ejecutan el script anterior antes de arrancar, compilar o probar, para que el aviso aparezca también en esos comandos. |
| `.nvmrc` | Indica `24` para [nvm](https://github.com/nvm-sh/nvm): desde la raíz del repo, `nvm install && nvm use`. |
| `packageManager` | `npm@11.19.0` en `package.json`: con [Corepack](https://nodejs.org/api/corepack.html) (`corepack enable`) se usa esa versión exacta de npm. |

Comprobar versiones con `node --version` y `npm --version`. Si no cumples el requisito verás el aviso, pero `npm install`, `npm start` y `npm run build` continuarán. Ten en cuenta que una versión muy antigua puede hacer que la compilación falle por características no soportadas.

---

## Instalación local

```bash
git clone https://github.com/CarlosValentinVV/AppGimnasio.git
cd AppGimnasio
npm install
```

`npm install` solo hace falta la primera vez (o cuando cambie `package.json`). Crea la carpeta `node_modules`.

> **Windows / PowerShell:** si aparece un error `UnauthorizedAccess` al usar `npm`, ejecutar una vez:
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

---

## Desarrollo en local

```bash
npm start
```

Equivale a `ng serve` con la configuración de desarrollo. Cuando la consola muestre `Local: http://localhost:4200/`, abrir esa dirección. La aplicación se recarga sola al guardar cambios. Para detenerla, pulsar `Ctrl + C`.

> El cifrado de contraseñas necesita un contexto seguro: `localhost` cumple este requisito, igual que HTTPS en GitHub Pages.

---

## Compilación local

| Objetivo | Comando | Resultado |
|----------|---------|-----------|
| Desarrollo (sin optimizar, con source maps) | `npm run build -- --configuration development` | `dist/AppGimnasio/browser` |
| Producción (la que se publica en Pages) | `npm run build` | `dist/AppGimnasio/browser` con `baseHref="/AppGimnasio/"`, hash en los archivos y presupuestos de tamaño |
| Producción + `404.html` para enlaces profundos | `npm run build:pages` | Igual que producción y además `dist/AppGimnasio/browser/404.html` |
| Recompilar al guardar cambios | `npm run watch` | Reconstruye la configuración de desarrollo en `dist/` |

El script `build:pages` ejecuta `ng build && node scripts/postbuild-pages.mjs`. Es la forma de reproducir en local exactamente lo que hace el workflow de GitHub Pages (el workflow pasa además el `--base-href` con el nombre del repositorio).

### Ver la compilación en local

Para comprobar el resultado de la compilación antes de subirlo:

```bash
npm run build:pages
npx http-server dist/AppGimnasio/browser -p 8080
```

Después abrir <http://localhost:8080/AppGimnasio/>. Si `npx` pide instalar `http-server`, confirmar con `y`. Para probar los enlaces profundos (`/AppGimnasio/perfil`, `/AppGimnasio/login`) de forma fiable, usar la versión publicada en GitHub Pages.

---

## Pruebas unitarias

Ejecutar todas las pruebas:

```bash
npm test
```

Ejecutar solo las de un archivo y salir al terminar:

```bash
npm test -- --include=src/app/features/login/login.spec.ts --watch=false
```

Sin `--watch=false` las pruebas se quedan vigilando cambios; pulsar `q` para salir. Hay especificaciones para el componente raíz, home, login, header, footer, perfil, el adaptador de perfil y el guard de sesión.

---

## Comentarios en el código

El proyecto prioriza la legibilidad: **todos los archivos `.ts` de componentes, servicios, modelos y utilidades incluyen documentación**, y las plantillas más extensas llevan comentarios de sección. Se usan tres niveles:

1. **JSDoc de clase / función**: describe qué hace el elemento, su finalidad y, en los componentes, `@author` y `@version`.

   ```ts
   /**
    * Componente principal de la página de inicio (home).
    *
    * Muestra las estadísticas, las clases filtradas por categoría, los planes
    * de membresía, los testimonios y las preguntas frecuentes.
    *
    * @author Carlos Valentin Santamaria
    * @version 1.0
    */
   ```

2. **Comentarios inline**: explican el propósito de cada señal, entrada, método, opción del decorador `@Component` y paso relevante de la lógica (por ejemplo, por qué se usa un valor mínimo de 1 para evitar divisiones por cero).

   ```ts
   /** Mayor número de visitas en un día, con un mínimo de 1 para evitar divisiones por cero. */
   readonly maxVisitas = computed(() =>
     Math.max(...this.asistencias().map((dia) => dia.visitas), 1),
   );
   ```

3. **Comentarios HTML**: delimitan las secciones de las plantillas para que sea fácil localizarlas.

   ```html
   <!-- Sección hero: presentación principal del gimnasio -->
   <section class="hero">...</section>
   ```

Al añadir un componente nuevo se recomienda mantener la misma convención: JSDoc con descripción, autor y versión, comentario para cada `input()` y comentarios en los bloques principales de su plantilla.

---

## Funcionamiento y uso de los componentes

### Arquitectura general

```text
src/index.html  →  main.ts  →  App (app-root)
                                 ├── Header (app-header)  ── navegación, tema, sesión
                                 ├── RouterOutlet          ── Home / Login / PantallaUsuario
                                 └── Footer (app-footer)   ── enlaces, contacto, volver arriba
```

- `main.ts` arranca `App` con la configuración de `app.config.ts` (router, scroll a anclas y escuchadores de errores).
- `app.routes.ts` define las rutas; `/perfil` usa `sesionGuard` y redirige a `/login` si no hay sesión.
- Los componentes son **standalone** y se importan directamente en el `imports` de quien los usa; no hay NgModules.
- El estado se maneja con **signals** (`signal`, `computed`) y la detección de cambios usa `OnPush` en todas las páginas y componentes compartidos excepto en `App`.
- No hay `output()`/`EventEmitter`: los componentes hijos son presentacionales y reciben todo por `input()`.

### Componentes raíz, compartidos y páginas

| Componente | Selector | Función | Entradas |
|------------|----------|---------|----------|
| `App` (`src/app/app.ts`) | `app-root` | Compone header, outlet y footer; aplica la clase de tema al elemento raíz. | — |
| `Header` (`shared/components/header/header.ts`) | `app-header` | Enlaces a secciones, botón de tema, menú móvil y accesos de sesión (Mi perfil / Acceso / Cerrar sesión). | — |
| `Footer` (`shared/components/footer/footer.ts`) | `app-footer` | Enlaces a secciones y planes, datos de contacto, año actual y «Volver arriba». | — |
| `HomeComponent` (`features/home/home.ts`) | `app-home` | Página pública: hero, estadísticas, características, clases filtrables, planes, testimonios, FAQ y CTA. | — |
| `Login` (`features/login/login.ts`) | `app-login` | Pestañas de acceso y registro; valida los formularios y delega en `AUTENTICACION`. | — |
| `PantallaUsuario` (`features/pantalla-usuario/pages/pantalla-usuario.ts`) | `app-pantalla-usuario` | Perfil en tres pestañas; obtiene la identidad del usuario de la sesión y reparte los datos a sus hijos. | — |

**Uso en el router** (`app.routes.ts`):

```ts
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'perfil', component: PantallaUsuario, canActivate: [sesionGuard] },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'home' },
];
```

**Comportamiento destacado:**

- `HomeComponent` usa `selectedCategory` + `computed filteredClasses` para filtrar las clases, `billingCycle` para alternar precios y `openFaqIndex` para el acordeón. Las animaciones de entrada se logran con `IntersectionObserver` sobre los elementos `.reveal`, que se limpia en `ngOnDestroy`.
- `Login` usa dos formularios reactivos. El validador `coinciden()` compara correos (normalizando mayúsculas y espacios) y contraseñas; `fechaNoFutura()` impide fechas posteriores a hoy. Tras registrarse o entrar, navega a `/perfil`.
- `Header` calcula `haySesion` a partir de `auth.sesion()` y muestra u oculta las opciones en consecuencia.
- `PantallaUsuario` calcula `porcentajeNivel` con `computed` y usa `setPestana()` para cambiar entre Resumen, Asistencia y Datos. Los datos de ejemplo se adaptan al usuario autenticado mediante `construirPerfilDeUsuario()`.

### Componentes hijos del perfil

Los ocho componentes de `features/pantalla-usuario/components/` son independientes, usan `OnPush` y reciben **todas** sus entradas con `input.required<>()`. No inyectan servicios: se limitan a presentar los datos que les pasa `PantallaUsuario`.

| Componente | Selector | Entradas (`input.required`) | Qué muestra / calcula |
|------------|----------|-----------------------------|-----------------------|
| `PerfilCabecera` | `app-perfil-cabecera` | `usuario: Usuario`, `porcentajeNivel: number` | Avatar (foto o iniciales), nombre, chips de plan/antigüedad/ciudad y barra de progreso de nivel. |
| `EstadisticasPerfil` | `app-estadisticas-perfil` | `estadisticas: EstadisticaUsuario[]` | Rejilla de tarjetas; el icono se elige con `@switch` según el tipo de métrica. |
| `ListaVisitas` | `app-lista-visitas` | `visitas: VisitaReciente[]` | Historial con fecha, día, zona, hora de entrada y duración. |
| `ListaLogros` | `app-lista-logros` | `logros: Logro[]` | Medallas conseguidas/bloqueadas; `computed logrosConseguidos` cuenta las desbloqueadas. |
| `GraficoAsistencia` | `app-grafico-asistencia` | `asistencias: AsistenciaDia[]` | Barras CSS por día; `computed maxVisitas` (mínimo 1) escala las barras y `computed total` suma las visitas. |
| `AnilloObjetivo` | `app-anillo-objetivo` | `diasMes: number`, `meta: number` | Anillo SVG con `computed porcentaje`, `restantes` y `circunferencia = 2π · 52`. |
| `ListaDatos` | `app-lista-datos` | `datos: DatoPersonal[]` | Lista etiqueta/valor con icono para cada dato personal. |
| `TarjetaMembresia` | `app-tarjeta-membresia` | `plan: string`, `miembroDesde: string`, `membresia: Membresia` | Plan contratado, estado de la cuota, próxima renovación y antigüedad. |

**Ejemplo de uso** (basado en la plantilla del perfil): las señales del padre se pasan con el nombre del input y se invocan con `()` en la plantilla:

```html
<app-perfil-cabecera [porcentajeNivel]="porcentajeNivel()" [usuario]="usuario()" />

<app-grafico-asistencia [asistencias]="asistenciasSemana()" />
<app-anillo-objetivo [diasMes]="objetivo().diasMes" [meta]="objetivo().meta" />
```

Si se quiere reutilizar uno de estos componentes en otra pantalla, basta con importarlo en el array `imports` del componente standalone que lo vaya a usar y pasarle las entradas obligatorias del tipo correspondiente (definido en `models/usuario.models.ts`).

### Servicios y utilidades que dan soporte a los componentes

| Archivo | Función |
|---------|---------|
| `shared/services/theme.service.ts` | `ThemeService` (`providedIn: 'root'`) mantiene el estado claro/oscuro en una signal y expone `isDarkMode` de solo lectura, `toggle()` y `setDarkMode()`. |
| `core/auth/autenticacion.token.ts` | Token de inyección `AUTENTICACION`: desacopla los componentes de la implementación de autenticación. |
| `core/auth/autenticacion.model.ts` | Interfaces `UsuarioPublico` (sin contraseña), `DatosRegistro`, `ServicioAutenticacion` y la clase `ErrorAutenticacion`. |
| `core/auth/autenticacion-local.ts` | Implementación de práctica: usuarios en `localStorage`, sesión en `sessionStorage` y hash PBKDF2 vía Web Crypto. |
| `core/auth/sesion.guard.ts` | Guard funcional que permite `/perfil` solo con sesión y redirige a `/login` en caso contrario. |
| `features/pantalla-usuario/data/perfil-sesion.ts` | Adapta los datos de ejemplo al usuario autenticado (nombre, iniciales, correo y fecha de nacimiento). |
| `features/home/data/home.data.ts`, `features/pantalla-usuario/data/usuario.data.ts` | Contenido estático de demostración tipado con sus modelos. |

---

## Estructura del proyecto

```text
src/
├── index.html                 # Única página real; Angular se monta en <app-root>
├── main.ts                    # Arranque de la aplicación
├── styles.css                 # Estilos globales
└── app/
    ├── app.ts / app.html      # Componente raíz: header + <router-outlet> + footer
    ├── app.config.ts          # Configuración global (router, scroll a anclas, errores)
    ├── app.routes.ts          # Rutas: '', 'home', 'perfil', 'login', '**'
    ├── core/auth/             # Modelo, token, implementación local y guard de sesión
    ├── features/
    │   ├── home/              # Página de inicio (datos y modelos propios)
    │   ├── login/             # Acceso y registro
    │   └── pantalla-usuario/  # Perfil: página, 8 componentes hijos, modelos y datos
    └── shared/
        ├── components/        # Header y footer globales
        └── services/          # ThemeService (modo claro / oscuro)
public/                        # Recursos estáticos servidos desde la raíz (.nojekyll, iconos, logos)
scripts/                       # postbuild-pages.mjs: genera 404.html para GitHub Pages
.github/workflows/             # deploy-pages.yml: compilación y publicación automáticas
```

---

## Formato y convenciones de código

El proyecto **no usa Prettier ni ESLint**. El formato se rige por `.editorconfig`, la única fuente de verdad:

| Regla                  | Valor       |
|------------------------|-------------|
| Sangría                | 2 espacios  |
| Fin de línea           | LF (`\n`)   |
| Salto de línea final   | Sí          |
| Espacios finales       | Se eliminan (excepto en Markdown) |
| Comillas en TypeScript | Simples     |

Además, `.gitattributes` fuerza `eol=lf` para evitar cambios de archivos por diferencias de final de línea.

**WebStorm / IntelliJ**

1. `Settings → Languages & Frameworks → EditorConfig` → habilitar el plugin.
2. `Settings → Editor → Code Style` → elegir el perfil **EditorConfig** en TypeScript, CSS y HTML.

**Visual Studio Code**

- `.vscode/settings.json` ya activa `editor.formatOnSave` con los formateadores nativos. VS Code lee `.editorconfig` de forma nativa, sin extensiones adicionales.

### Nomenclatura y patrones

- **Componentes:** `PantallaUsuario`, `Login`, `HomeComponent`.
- **Archivos:** sin sufijo `.component` (`pantalla-usuario.ts`, `login.html`).
- **Variables:** `usuarioActivo`, `pestanaActiva`.
- **Componentes standalone**, sin NgModules.
- **Signals** (`signal`, `computed`) para el estado reactivo e `input()`/`input.required()` para las entradas.
- **Inyección de dependencias** con `inject()` en lugar de constructores.
- **`ChangeDetectionStrategy.OnPush`** en páginas y componentes compartidos (el componente raíz `App` usa la estrategia por defecto).
- **Sintaxis de control de flujo** de Angular 17+ (`@if`, `@for`, `@switch`).
- **JSDoc y comentarios HTML** en clases, métodos públicos, entradas y secciones de plantilla.
