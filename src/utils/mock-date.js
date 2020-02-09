export const RealDate = Date;

export function mockDate (isoDate) {
  return class extends RealDate {
    constructor () {
      return new RealDate(isoDate)
    }
  }
}