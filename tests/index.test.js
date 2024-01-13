import {
  getFixedFromInertial,
  getInertialFromFixed,
} from '../src/position-conversions';
import {Epoch} from 'otk-time-systems';
import {Vector} from 'otk-linear-algebra';

test('getFixedFromInertial', () => {
  const pos = new Vector(10000.0, 40000.0, -5000.0);
  const epoch = new Epoch('2021-12-25T04:42:42.424Z');
  const truth = new Vector(1173.544602365, -41216.97127606, -4978.360362079);
  const result = getFixedFromInertial(epoch, pos);
  expect(result.minus(truth).magnitude()).toBeCloseTo(0.0, 0);
  expect(result[0]).toBeCloseTo(truth[0], 0);
  expect(result[1]).toBeCloseTo(truth[1], 0);
  expect(result[2]).toBeCloseTo(truth[2], 0);
});

test('getFixedFromInertial', () => {
  const pos = new Vector(1173.544602365, -41216.97127606, -4978.360362079);
  const epoch = new Epoch('2021-12-25T04:42:42.424Z');
  const truth = new Vector(10000.0, 40000.0, -5000.0);
  const result = getInertialFromFixed(epoch, pos);
  expect(result.minus(truth).magnitude()).toBeCloseTo(0.0, 0);
  expect(result[0]).toBeCloseTo(truth[0], 0);
  expect(result[1]).toBeCloseTo(truth[1], 0);
  expect(result[2]).toBeCloseTo(truth[2], 0);
});
