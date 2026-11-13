# Jimnasio

## Descripción
Aplicación SPA (Single Page Application) hecha con Angular para **Jimnasio**, un gimnasio de alto rendimiento en Madrid.
Incluye la página pública del gimnasio (clases, planes, opiniones y preguntas frecuentes), un área de perfil del cliente
con el seguimiento de su actividad y una pantalla de acceso con inicio de sesión y registro.

## Características Principales
1. **Página de inicio** (`/`): presentación del gimnasio, filtro de clases por categoría (fuerza, cardio, mente),
   planes con precio mensual/anual, opiniones de clientes y preguntas frecuentes.
2. **Perfil del cliente** (`/perfil`): resumen de estadísticas, gráfico de asistencia, objetivo mensual, logros,
   visitas recientes, datos personales y membresía, organizado en pestañas (Resumen, Asistencia, Datos).
3. **Acceso** (`/login`): inicio de sesión y registro con formularios reactivos y validaciones.
4. **Modo claro / oscuro** compartido por toda la aplicación desde el header.
5. **Diseño adaptable** a móvil con menú hamburguesa.

## Tecnologías Utilizadas
- **Framework:** Angular 22.2+ (componentes standalone)
- **Lenguaje:** TypeScript
- **Styling:** CSS3
- **Routing:** Angular Router
- **Formularios:** Angular Reactive Forms
- **Pruebas unitarias:** Vitest + jsdom (`@angular/build:unit-test`)

## Instalación y/o configuración

### Prerrequisitos
- Node.js 24+
- npm 11+
- Angular CLI 22.2+ (opcional; el proyecto incluye su propia copia y se puede usar con `npm`)

### 1. Clonar el repositorio
```bash
git clone https://github.com/CarlosValentinVV/AppGimnasio.git
cd AppGimnasio
```

### 2. Instalar las dependencias
```bash
npm install
```
Solo hace falta la primera vez (o cuando cambie `package.json`). Crea la carpeta `node_modules`.

> **Windows / PowerShell:** si aparece un error `UnauthorizedAccess` al usar `npm`, ejecuta una vez:
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

## Ejecución en desarrollo
```bash
npm start
```
Equivale a `ng serve`. Cuando la consola muestre `Local: http://localhost:4200/`, abre el navegador en esa dirección.
La aplicación se recarga sola al guardar cambios. Para pararla, pulsa `Ctrl + C` en la terminal.

## Cómo acceder a cada pantalla
Con el servidor arrancado:

| Pantalla | URL | Cómo llegar desde la web |
|---|---|---|
| Inicio | http://localhost:4200/ | Logo **JIMNASIO** del header |
| Perfil del cliente | http://localhost:4200/perfil | Botón **Mi perfil** del header |
| Acceso (login / registro) | http://localhost:4200/login | Botón **Acceso** del header (en móvil, dentro del menú) |

Los enlaces del header *Por qué elegirnos, Clases, Planes, Opiniones y Preguntas* llevan a cada sección de la página de inicio.

### Uso del login
1. Entra en `/login` y abre la pestaña **Registrarse**.
2. Rellena nombre, correo (dos veces), fecha de nacimiento y contraseña (mínimo 8 caracteres, dos veces) y pulsa **Crear cuenta**.
3. Vuelve automáticamente a **Iniciar sesión** con el correo ya puesto; escribe la contraseña y pulsa **Entrar**.
4. Con la sesión iniciada aparece el saludo y el botón **Cerrar sesión**.

> Los usuarios se guardan en el `localStorage` del navegador (clave `app.usuarios`) y la sesión en `sessionStorage`
> (clave `app.sesion`). La contraseña **nunca** se guarda: solo un hash PBKDF2 con sal. Es un sistema **de práctica**,
> no seguro para usuarios reales: los datos solo existen en ese navegador y cualquiera puede verlos con F12.
> El cifrado necesita abrir la app desde `localhost` o HTTPS.

## Compilación
Compilación de desarrollo (genera la app en `dist/AppGimnasio`):
```bash
npm run build -- --configuration development
```

Compilación de producción (es la que se publica en GitHub Pages):
```bash
npm run build
```

El resultado queda en `dist/AppGimnasio/browser`. La configuración de producción ya incluye
`baseHref: "/AppGimnasio/"` en `angular.json`, necesario para servir la app desde una subcarpeta.

Compilación preparada para GitHub Pages (compila y genera `404.html`):

```bash
npm run build:pages
```

### Ver la compilación en local

Para comprobar exactamente lo que se publica:

```bash
npx http-server dist/AppGimnasio/browser -o http://localhost:8080/AppGimnasio/
```

## Despliegue en GitHub Pages

El repositorio incluye el flujo de trabajo [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml),
que compila la app y la publica automáticamente en cada `push` a la rama principal (`master`, o `main` si la renombras;
también se puede lanzar a mano desde la pestaña **Actions** con *Run workflow*).

**Configuración inicial (solo una vez):**

1. Entra en el repositorio en GitHub → **Settings** → **Pages**.
2. En **Build and deployment** elige **Source: GitHub Actions**.
3. Haz `git push` a `master` y espera a que termine el workflow *Deploy a GitHub Pages*.

La web quedará publicada en:

**https://carlosvalentinvv.github.io/AppGimnasio/**

Notas sobre la configuración:

- El workflow pasa `--base-href "/<nombre-del-repositorio>/"`, así que si renombras el repositorio no hay que tocar nada.
- `public/.nojekyll` evita que GitHub Pages procese los archivos con Jekyll.
- `scripts/postbuild-pages.mjs` copia `index.html` como `404.html`. GitHub Pages sirve ese archivo para cualquier
  ruta inexistente, así que enlaces como `/AppGimnasio/perfil` o `/AppGimnasio/login` cargan la aplicación (rutas de Angular) en lugar de dar un 404, incluso al recargar o compartir el enlace.
- Los datos del login se guardan en el navegador; GitHub Pages sirve por HTTPS, así que el cifrado funciona.

## Pruebas unitarias
Ejecutar todas las pruebas:
```bash
npm test
```
Ejecutar solo las de un componente (por ejemplo, el login) y salir al terminar:
```bash
npm test -- --include=src/app/features/login/login.spec.ts --watch=false
```
Sin `--watch=false` las pruebas se quedan vigilando cambios; pulsa `q` para salir.

## Estructura del proyecto
```
src/
├── index.html                 # Única página real; Angular se inyecta en <app-root>
├── main.ts                    # Arranque de la aplicación
├── styles.css                 # Estilos globales
└── app/
    ├── app.ts / app.html      # Componente raíz: header + <router-outlet> + footer
    ├── app.config.ts          # Configuración global (router, scroll a anclas)
    ├── app.routes.ts          # Rutas: '', 'perfil', 'login'
    ├── core/
    │   └── auth/              # Autenticación: modelo, implementación con localStorage y token de inyección
    ├── features/              # Pantallas
    │   ├── home/              # Página de inicio (datos en home.json)
    │   ├── login/             # Inicio de sesión y registro
    │   └── pantalla-usuario/  # Perfil del cliente
    │       ├── pages/         # Componente de página
    │       ├── components/    # Componentes de la pantalla (anillo, gráfico, listas, tarjetas...)
    │       ├── models/        # Interfaces de datos
    │       └── data/          # usuario.json con los datos de ejemplo
    └── shared/
        ├── components/        # header y footer globales
        └── services/          # ThemeService (modo claro / oscuro)
public/                        # Recursos estáticos (favicon, logos) servidos desde la raíz
scripts/                       # Tareas de compilación (copia de 404.html para GitHub Pages)
.github/workflows/             # Despliegue automático en GitHub Pages
```

## Nomenclatura
- **Componentes:** `PantallaUsuario`, `Login`
- **Archivos:** `pantalla-usuario.ts`, `login.html`
- **Variables:** `usuarioActivo`, `pestanaActiva`
