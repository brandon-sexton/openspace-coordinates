import {Vector} from 'vector-matrix-math';
import {
  getNutationMatrix,
  getPrecessionMatrix,
  getRotationMatrix,
} from './geocentric-transformation-matrices';

/**
 * @function getFixedFromInertial
 * @description Transforms an inertial position to a fixed position.
 * @param {Epoch} epoch - The epoch for which the position is valid
 * @param {Vector} position - The position in inertial coordinates
 * @return {Vector} - The position in fixed coordinates
 */
export function getFixedFromInertial(epoch, position) {
  const r = getRotationMatrix(epoch);
  const n = getNutationMatrix(epoch);
  const p = getPrecessionMatrix(epoch);
  return r.timesVector(n.timesVector(p.timesVector(position)));
}

/**
 * @function getInertialFromFixed
 * @description Transforms a fixed position to an inertial position.
 * @param {Epoch} epoch - The epoch for which the position is valid
 * @param {Vector} position - The position in fixed coordinates
 * @return {Vector} - The position in inertial coordinates
 */
export function getInertialFromFixed(epoch, position) {
  const r = getRotationMatrix(epoch).transpose();
  const n = getNutationMatrix(epoch).transpose();
  const p = getPrecessionMatrix(epoch).transpose();
  return p.timesVector(n.timesVector(r.timesVector(position)));
}

/**
 * @function getSphericalFromCartesian
 * @description Returns spherical coordinates of given cartesian coordinates.
 * @param {Vector} position - The cartesian coordinates
 * @return {Vector} - The spherical coordinates
 */
export function getSphericalFromCartesian(position) {
  const r = position.magnitude();
  const rightAscension = Math.atan2(position[1], position[0]);
  if (rightAscension < 0) {
    rightAscension += 2 * Math.PI;
  }
  const declination = Math.atan2(
      position[2],
      Math.sqrt(position[0] * position[0] + position[1] * position[1]),
  );
  return new Vector(r, rightAscension, declination);
}
