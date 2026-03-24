import { z } from "zod";

export const propSchema = z.object({
  config: z.record(z.string(), z.string()),
  featureFlags: z.record(z.string(), z.boolean()),
});

export type ConfigPanelProps = z.infer<typeof propSchema>;
