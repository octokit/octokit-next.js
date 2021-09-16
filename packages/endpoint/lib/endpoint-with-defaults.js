import { merge } from "./merge.js";
import { parse } from "./parse.js";

export function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}
