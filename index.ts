import { MCPServer, text, widget, object } from "mcp-use/server";
import { z } from "zod";

const server = new MCPServer({
  name: "resource-watcher",
  title: "Resource Watcher",
  version: "1.0.0",
  description:
    "Resource subscriptions, dynamic lists, and roots — showcasing live resource updates",
  baseUrl: process.env.MCP_URL || "http://localhost:3000",
});

let config: Record<string, string> = {
  theme: "light",
  language: "en",
  notifications: "on",
};

let featureFlags: Record<string, boolean> = {
  darkMode: true,
  betaFeatures: false,
};

server.onRootsChanged(async (roots) => {
  console.log("Client roots changed:", JSON.stringify(roots));
});

server.resource(
  {
    name: "settings",
    uri: "config://settings",
    title: "Application Settings",
    description: "Current application configuration",
    mimeType: "application/json",
  },
  async () => object(config)
);

server.tool(
  {
    name: "show-config",
    description:
      "Display the configuration panel showing current settings and feature flags",
    schema: z.object({}),
    widget: {
      name: "config-panel",
      invoking: "Loading config...",
      invoked: "Config loaded",
    },
  },
  async () => {
    return widget({
      props: { config, featureFlags },
      output: text("Config loaded"),
    });
  }
);

server.tool(
  {
    name: "update-config",
    description: "Update a configuration setting by key and value",
    schema: z.object({
      key: z.string().describe("Configuration key to update"),
      value: z.string().describe("New value for the key"),
    }),
    widget: {
      name: "config-panel",
      invoking: "Updating config...",
      invoked: "Config updated",
    },
  },
  async ({ key, value }, ctx) => {
    config[key] = value;

    server.notifyResourceUpdated("config://settings");

    await ctx.sendNotification("custom/config-changed", { key, value });

    return widget({
      props: { config, featureFlags },
      output: text(`Updated "${key}" to "${value}"`),
    });
  }
);

server.tool(
  {
    name: "toggle-feature",
    description: "Toggle a feature flag on or off",
    schema: z.object({
      feature: z.string().describe("Feature flag name"),
      enabled: z.boolean().describe("Whether to enable the feature"),
    }),
  },
  async ({ feature, enabled }) => {
    featureFlags[feature] = enabled;

    await server.sendToolsListChanged();

    return text(
      `Feature "${feature}" ${enabled ? "enabled" : "disabled"}`
    );
  }
);

server.tool(
  {
    name: "list-roots",
    description: "List the client workspace roots (if supported by the client)",
    schema: z.object({}),
  },
  async (_params, ctx) => {
    try {
      const roots = await server.listRoots(ctx.session?.sessionId) ?? [];
      return text(
        `Client roots (${roots.length}):\n${roots.map((r: any, i: number) => `  ${i + 1}. ${r.uri ?? r.name ?? JSON.stringify(r)}`).join("\n")}`
      );
    } catch (err: any) {
      return text(
        `Could not list roots: ${err.message ?? "client does not support roots/list"}`
      );
    }
  }
);

server.listen().then(() => console.log("Resource Watcher running"));
