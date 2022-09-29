import { withDefaults } from "./lib/with-defaults.js";
import { DEFAULTS } from "./lib/defaults.js";
export { VERSION } from "./lib/version.js";

export const endpoint = withDefaults(null, DEFAULTS);
