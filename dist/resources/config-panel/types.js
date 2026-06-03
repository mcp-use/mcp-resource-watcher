// resources/config-panel/types.ts
import { z } from "zod";
var propSchema = z.object({
  config: z.record(z.string(), z.string()),
  featureFlags: z.record(z.string(), z.boolean())
});
export {
  propSchema
};
//# sourceMappingURL=types.js.map
