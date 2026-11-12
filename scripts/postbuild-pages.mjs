/**
 * Copia index.html como 404.html en la salida de compilación.
 *
 * GitHub Pages sirve 404.html para cualquier ruta que no exista como archivo,
 * así que los enlaces profundos de la SPA (/AppGimnasio/perfil, /AppGimnasio/login...)
 * cargan la aplicación en lugar de mostrar un 404. Como el <base href> del build es
 * absoluto, los recursos (JS, CSS, imágenes) se resuelven igual desde cualquier ruta.
 */
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const outputDir = join(process.cwd(), 'dist', 'AppGimnasio', 'browser');
const indexFile = join(outputDir, 'index.html');
const notFoundFile = join(outputDir, '404.html');

if (!existsSync(indexFile)) {
  console.error(`No se encontró ${indexFile}. Ejecuta "npm run build" antes.`);
  process.exit(1);
}

copyFileSync(indexFile, notFoundFile);
console.log(`Creado ${notFoundFile}`);
