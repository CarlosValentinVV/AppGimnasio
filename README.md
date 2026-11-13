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

Compilación de producción:
```bash
npm run build
```

> **Aviso:** ahora mismo la compilación de producción falla por el límite de tamaño (`budgets`) de `angular.json`,
> porque las fuentes de Google Fonts que se insertan en línea superan los 8 kB permitidos. La compilación de
> desarrollo y `npm start` funcionan con normalidad.

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
```

## Nomenclatura
- **Componentes:** `PantallaUsuario`, `Login`
- **Archivos:** `pantalla-usuario.ts`, `login.html`
- **Variables:** `usuarioActivo`, `pestanaActiva`
