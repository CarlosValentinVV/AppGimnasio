/**
 * Avisa si Node o npm están por debajo de las versiones recomendadas, sin
 * detener la ejecución. Se ejecuta automáticamente desde los hooks `pre*` de
 * package.json antes de arrancar, compilar o probar la aplicación.
 *
 * Las versiones mínimas se leen de `engines` en package.json para no duplicarlas.
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Versiones declaradas en package.json. */
const { engines, packageManager } = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
const nodeMinimo = engines?.node?.replace(/^[^\d]*/, '') ?? '24.0.0';
const npmMinimo = engines?.npm?.replace(/^[^\d]*/, '') ?? '11.0.0';
/** Versión exacta recomendada de npm (packageManager), si está declarada. */
const npmRecomendado = packageManager?.replace(/^npm@/, '') ?? npmMinimo;

/**
 * Compara dos versiones componente a componente (major, minor, patch).
 *
 * @param actual Versión instalada, por ejemplo `22.14.0`.
 * @param minimo Versión mínima recomendada, por ejemplo `24.0.0`.
 * @returns `true` si la instalada cumple el mínimo, `false` si va por debajo.
 */
function cumpleVersion(actual, minimo) {
  const partesActuales = String(actual).split('.').map((parte) => Number(parte) || 0);
  const partesMinimas = String(minimo).split('.').map((parte) => Number(parte) || 0);

  for (let i = 0; i < partesMinimas.length; i++) {
    const valorActual = partesActuales[i] ?? 0;
    if (valorActual > partesMinimas[i]) return true;
    if (valorActual < partesMinimas[i]) return false;
  }
  return true;
}

/**
 * Obtiene la versión de npm que está ejecutando el script.
 *
 * @returns Versión de npm, o `null` si no se puede determinar.
 */
function versionNpm() {
  // npm expone su versión en el user agent cuando el script se lanza con `npm run`.
  const agente = process.env.npm_config_user_agent ?? '';
  const coincidencia = agente.match(/npm\/([\d.]+)/);
  if (coincidencia) return coincidencia[1];

  // Si el script se ejecuta directamente con `node`, se consulta a npm.
  try {
    return execSync('npm --version', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

/** Versión de Node del proceso actual. */
const nodeActual = process.versions.node;
/** Versión de npm detectada. */
const npmActual = versionNpm();

// Aviso para Node: informativo, el script termina con código 0.
if (!cumpleVersion(nodeActual, nodeMinimo)) {
  console.warn(
    `⚠️  Node ${nodeActual} detectado. Se recomienda Node ${nodeMinimo} o superior. ` +
      'La compilación puede fallar; puedes instalar la versión recomendada con `nvm install && nvm use`.',
  );
}

// Aviso para npm: informativo, el script termina con código 0.
if (npmActual && !cumpleVersion(npmActual, npmRecomendado)) {
  console.warn(
    `⚠️  npm ${npmActual} detectado. Se recomienda npm ${npmRecomendado} o superior ` +
      `(mínimo declarado: ${npmMinimo}). Puedes activar la versión del proyecto con \`corepack enable\`.`,
  );
}
