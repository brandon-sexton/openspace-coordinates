import {degreesToRadians, dmsToDegrees} from 'otk-unit-conversions';
import {Matrix, Vector} from 'otk-linear-algebra';

const COEFF_A = degreesToRadians(dmsToDegrees(0, 0, 46.815));
const COEFF_B = degreesToRadians(dmsToDegrees(0, 0, 0.00059));
const COEFF_C = degreesToRadians(dmsToDegrees(0, 0, 0.001813));
const COEFF_D = degreesToRadians(-0.0048);
const COEFF_E = degreesToRadians(0.0004);
const COEFF_F = degreesToRadians(dmsToDegrees(0, 0, 2306.2181));
const COEFF_G = degreesToRadians(dmsToDegrees(0, 0, 0.30188));
const COEFF_H = degreesToRadians(dmsToDegrees(0, 0, 0.017998));
const COEFF_I = degreesToRadians(dmsToDegrees(0, 0, 2004.3109));
const COEFF_J = degreesToRadians(dmsToDegrees(0, 0, 0.42665));
const COEFF_K = degreesToRadians(dmsToDegrees(0, 0, 0.041833));
const COEFF_L = degreesToRadians(dmsToDegrees(0, 0, 0.7928));
const COEFF_M = degreesToRadians(dmsToDegrees(0, 0, 0.000205));
const COEFF_N = degreesToRadians(0.0026);
const COEFF_O = degreesToRadians(0.0002);

/**
 * @function getPrecessionMatrix
 * @description Returns the precession matrix for the given epoch.
 * @param {Epoch} epoch
 * @return {Matrix}
 */
export function getRotationMatrix(epoch) {
  const d = epoch.getDaysPastJ2000();
  const arg1 = degreesToRadians(125.0 - 0.05295 * d);
  const arg2 = degreesToRadians(200.9 + 1.97129 * d);
  const dpsi = COEFF_D * Math.sin(arg1) - COEFF_E * Math.sin(arg2);
  const eps = getObliquityAtEpoch(epoch);
  const gmst = epoch.getGMST();
  const gast = dpsi * Math.cos(eps) + gmst;

  const c = Math.cos(-gast);
  const s = Math.sin(-gast);

  return new Matrix(
      new Vector(c, -s, 0.0),
      new Vector(s, c, 0.0),
      new Vector(0.0, 0.0, 1.0),
  );
}

/**
 * @function getNutationMatrix
 * @description Returns the nutation matrix for the given epoch.
 * @param {Epoch} epoch - The epoch for which to calculate the nutation matrix.
 * @return {Matrix}
 */
export function getNutationMatrix(epoch) {
  const d = epoch.getDaysPastJ2000();
  const arg1 = degreesToRadians(125.0 - 0.05295 * d);
  const arg2 = degreesToRadians(200.9 + 1.97129 * d);
  const dpsi = COEFF_D * Math.sin(arg1) - COEFF_E * Math.sin(arg2);
  const deps = COEFF_N * Math.cos(arg1) + COEFF_O * Math.cos(arg2);
  const eps = getObliquityAtEpoch(epoch);

  const ce = Math.cos(eps);
  const se = Math.sin(eps);

  return new Matrix(
      new Vector(1.0, -dpsi * ce, -dpsi * se),
      new Vector(dpsi * ce, 1.0, -deps),
      new Vector(dpsi * se, deps, 1.0),
  );
}

/**
 * @function getPrecessionMatrix
 * @description Returns the precession matrix for the given epoch.
 * @param {Epoch} epoch
 * @return {Matrix}
 */
export function getPrecessionMatrix(epoch) {
  const t = epoch.getJulianCenturiesPastJ2000();
  const x = COEFF_F * t + COEFF_G * t * t + COEFF_H * t * t * t;
  const y = COEFF_I * t - COEFF_J * t * t - COEFF_K * t * t * t;
  const z = x + COEFF_L * t * t + COEFF_M * t * t * t;

  const sz = Math.sin(z);
  const sy = Math.sin(y);
  const sx = Math.sin(x);
  const cz = Math.cos(z);
  const cy = Math.cos(y);
  const cx = Math.cos(x);

  return new Matrix(
      new Vector(-sz * sx + cz * cy * cx, -sz * cx - cz * cy * sx, -cz * sy),
      new Vector(cz * sx + sz * cy * cx, cz * cx - sz * cy * sx, -sz * sy),
      new Vector(sy * cx, -sy * sx, cy),
  );
}

/**
 * @function getObliquityAtEpoch
 * @description Returns the obliquity of the ecliptic at the given epoch.
 * @param {Epoch} epoch
 * @return {number} Obliquity of the ecliptic in radians.
 */
function getObliquityAtEpoch(epoch) {
  const t = epoch.getJulianCenturiesPastJ2000();
  const OBLIQUITY_J2000 = 0.4091051766674715;
  return OBLIQUITY_J2000 - COEFF_A * t - COEFF_B * t * t + COEFF_C * t * t * t;
}
