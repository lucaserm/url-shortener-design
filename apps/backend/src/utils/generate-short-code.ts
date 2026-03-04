import Hashids from "hashids";

export function generateShortCode() {
  const hashids = new Hashids(process.env.SHORT_SECRET, 6);
  const short = hashids.encode(Date.now());
  return short;
}
