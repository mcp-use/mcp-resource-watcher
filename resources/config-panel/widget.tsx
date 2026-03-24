import {
  McpUseProvider,
  useCallTool,
  useWidget,
  type WidgetMetadata,
} from "mcp-use/react";
import React, { useCallback, useState } from "react";
import "../styles.css";
import { propSchema, type ConfigPanelProps } from "./types";

export const widgetMetadata: WidgetMetadata = {
  description: "Configuration panel with live settings and feature flag toggles",
  props: propSchema,
  exposeAsTool: false,
  metadata: {
    prefersBorder: true,
    invoking: "Loading config...",
    invoked: "Config loaded",
  },
};

function EditableRow({
  configKey,
  value,
  onSave,
  isSaving,
}: {
  configKey: string;
  value: string;
  onSave: (key: string, value: string) => void;
  isSaving: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    if (draft !== value) {
      onSave(configKey, draft);
    }
    setEditing(false);
  };

  return (
    <tr className="border-b border-gray-100 dark:border-gray-700/50 last:border-0">
      <td className="py-2 pr-3 text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        {configKey}
      </td>
      <td className="py-2">
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") {
                  setDraft(value);
                  setEditing(false);
                }
              }}
              autoFocus
              className="flex-1 px-2 py-1 text-xs rounded border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-2 py-1 text-[10px] font-medium rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setDraft(value);
                setEditing(false);
              }}
              className="px-2 py-1 text-[10px] font-medium rounded border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between group/row">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {value}
            </span>
            <button
              onClick={() => setEditing(true)}
              className="opacity-0 group-hover/row:opacity-100 px-1.5 py-0.5 text-[10px] font-medium rounded text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
            >
              Edit
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

function FeatureToggle({
  feature,
  enabled,
  onToggle,
  isToggling,
}: {
  feature: string;
  enabled: boolean;
  onToggle: (feature: string, enabled: boolean) => void;
  isToggling: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
        {feature}
      </span>
      <button
        onClick={() => onToggle(feature, !enabled)}
        disabled={isToggling}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-1 disabled:opacity-50 ${
          enabled
            ? "bg-blue-500"
            : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ${
            enabled ? "translate-x-4 ml-0.5" : "translate-x-0 ml-0.5"
          }`}
        />
      </button>
    </div>
  );
}

const ConfigPanel: React.FC = () => {
  const { props, isPending, sendFollowUpMessage } =
    useWidget<ConfigPanelProps>();

  const { callTool: updateConfig, isPending: isUpdating } =
    useCallTool("update-config");
  const { callTool: toggleFeature, isPending: isToggling } =
    useCallTool("toggle-feature");

  const handleUpdateConfig = useCallback(
    (key: string, value: string) => {
      updateConfig({ key, value });
    },
    [updateConfig]
  );

  const handleToggleFeature = useCallback(
    (feature: string, enabled: boolean) => {
      toggleFeature({ feature, enabled });
    },
    [toggleFeature]
  );

  if (isPending) {
    return (
      <McpUseProvider autoSize>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Loading config...
            </span>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-8 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        </div>
      </McpUseProvider>
    );
  }

  const configEntries = Object.entries(props?.config ?? {});
  const flagEntries = Object.entries(props?.featureFlags ?? {});

  return (
    <McpUseProvider autoSize>
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Configuration
            </h3>
            {(isUpdating || isToggling) && (
              <span className="inline-flex items-center gap-1.5 text-xs text-blue-500">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                Saving...
              </span>
            )}
          </div>
          <button
            onClick={() =>
              sendFollowUpMessage("Please show the current config")
            }
            className="px-2.5 py-1 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="p-4 space-y-5">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Settings
            </h4>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full">
                <tbody>
                  {configEntries.map(([key, value]) => (
                    <EditableRow
                      key={key}
                      configKey={key}
                      value={value}
                      onSave={handleUpdateConfig}
                      isSaving={isUpdating}
                    />
                  ))}
                  {configEntries.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="py-4 text-center text-xs text-gray-400 dark:text-gray-500"
                      >
                        No settings configured
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Feature Flags
            </h4>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700/50 px-3">
              {flagEntries.map(([feature, enabled]) => (
                <FeatureToggle
                  key={feature}
                  feature={feature}
                  enabled={enabled}
                  onToggle={handleToggleFeature}
                  isToggling={isToggling}
                />
              ))}
              {flagEntries.length === 0 && (
                <div className="py-4 text-center text-xs text-gray-400 dark:text-gray-500">
                  No feature flags
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </McpUseProvider>
  );
};

export default ConfigPanel;
