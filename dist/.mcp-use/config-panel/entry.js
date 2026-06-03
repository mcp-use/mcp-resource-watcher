// .mcp-use/config-panel/entry.tsx
import { createRoot } from "react-dom/client";

// resources/config-panel/widget.tsx
import {
  McpUseProvider,
  useCallTool,
  useWidget
} from "mcp-use/react";
import { useCallback, useState } from "react";

// resources/config-panel/types.ts
import { z } from "zod";
var propSchema = z.object({
  config: z.record(z.string(), z.string()),
  featureFlags: z.record(z.string(), z.boolean())
});

// resources/config-panel/widget.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function EditableRow({
  configKey,
  value,
  onSave,
  isSaving
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const handleSave = () => {
    if (draft !== value) {
      onSave(configKey, draft);
    }
    setEditing(false);
  };
  return /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-100 dark:border-gray-700/50 last:border-0", children: [
    /* @__PURE__ */ jsx("td", { className: "py-2 pr-3 text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap", children: configKey }),
    /* @__PURE__ */ jsx("td", { className: "py-2", children: editing ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: draft,
          onChange: (e) => setDraft(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setDraft(value);
              setEditing(false);
            }
          },
          autoFocus: true,
          className: "flex-1 px-2 py-1 text-xs rounded border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleSave,
          disabled: isSaving,
          className: "px-2 py-1 text-[10px] font-medium rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors",
          children: "Save"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setDraft(value);
            setEditing(false);
          },
          className: "px-2 py-1 text-[10px] font-medium rounded border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
          children: "Cancel"
        }
      )
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between group/row", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-400", children: value }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setEditing(true),
          className: "opacity-0 group-hover/row:opacity-100 px-1.5 py-0.5 text-[10px] font-medium rounded text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all",
          children: "Edit"
        }
      )
    ] }) })
  ] });
}
function FeatureToggle({
  feature,
  enabled,
  onToggle,
  isToggling
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2", children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-700 dark:text-gray-300", children: feature }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onToggle(feature, !enabled),
        disabled: isToggling,
        className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-1 disabled:opacity-50 ${enabled ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`,
        children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ${enabled ? "translate-x-4 ml-0.5" : "translate-x-0 ml-0.5"}`
          }
        )
      }
    )
  ] });
}
var ConfigPanel = () => {
  const { props, isPending, sendFollowUpMessage } = useWidget();
  const { callTool: updateConfig, isPending: isUpdating } = useCallTool("update-config");
  const { callTool: toggleFeature, isPending: isToggling } = useCallTool("toggle-feature");
  const handleUpdateConfig = useCallback(
    (key, value) => {
      updateConfig({ key, value });
    },
    [updateConfig]
  );
  const handleToggleFeature = useCallback(
    (feature, enabled) => {
      toggleFeature({ feature, enabled });
    },
    [toggleFeature]
  );
  if (isPending) {
    return /* @__PURE__ */ jsx(McpUseProvider, { autoSize: true, children: /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Loading config..." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-8 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
        },
        i
      )) })
    ] }) });
  }
  const configEntries = Object.entries(props?.config ?? {});
  const flagEntries = Object.entries(props?.featureFlags ?? {});
  return /* @__PURE__ */ jsx(McpUseProvider, { autoSize: true, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: "Configuration" }),
        (isUpdating || isToggling) && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs text-blue-500", children: [
          /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-blue-500 animate-pulse" }),
          "Saving..."
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => sendFollowUpMessage("Please show the current config"),
          className: "px-2.5 py-1 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
          children: "Refresh"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2", children: "Settings" }),
        /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden", children: /* @__PURE__ */ jsx("table", { className: "w-full", children: /* @__PURE__ */ jsxs("tbody", { children: [
          configEntries.map(([key, value]) => /* @__PURE__ */ jsx(
            EditableRow,
            {
              configKey: key,
              value,
              onSave: handleUpdateConfig,
              isSaving: isUpdating
            },
            key
          )),
          configEntries.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
            "td",
            {
              colSpan: 2,
              className: "py-4 text-center text-xs text-gray-400 dark:text-gray-500",
              children: "No settings configured"
            }
          ) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2", children: "Feature Flags" }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700/50 px-3", children: [
          flagEntries.map(([feature, enabled]) => /* @__PURE__ */ jsx(
            FeatureToggle,
            {
              feature,
              enabled,
              onToggle: handleToggleFeature,
              isToggling
            },
            feature
          )),
          flagEntries.length === 0 && /* @__PURE__ */ jsx("div", { className: "py-4 text-center text-xs text-gray-400 dark:text-gray-500", children: "No feature flags" })
        ] })
      ] })
    ] })
  ] }) });
};
var widget_default = ConfigPanel;

// .mcp-use/config-panel/entry.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var container = document.getElementById("widget-root");
if (container && widget_default) {
  const root = createRoot(container);
  root.render(/* @__PURE__ */ jsx2(widget_default, {}));
}
//# sourceMappingURL=entry.js.map
