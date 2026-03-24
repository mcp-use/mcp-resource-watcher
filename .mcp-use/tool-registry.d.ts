// Auto-generated tool registry types - DO NOT EDIT MANUALLY
// This file is regenerated whenever tools are added, removed, or updated during development
// Generated at: 2026-03-24T12:31:02.365Z

declare module "mcp-use/react" {
  interface ToolRegistry {
    "list-roots": {
      input: Record<string, never>;
      output: Record<string, unknown>;
    };
    "show-config": {
      input: Record<string, never>;
      output: Record<string, unknown>;
    };
    "toggle-feature": {
      input: { "feature": string; "enabled": boolean };
      output: Record<string, unknown>;
    };
    "update-config": {
      input: { "key": string; "value": string };
      output: Record<string, unknown>;
    };
  }
}

export {};
