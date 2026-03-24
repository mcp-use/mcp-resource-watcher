import { z } from "zod";
const propSchema = z.object({
  config: z.record(z.string(), z.string()),
  featureFlags: z.record(z.string(), z.boolean())
});
export {
  propSchema
};
//# sourceMappingURL=types.js.map
