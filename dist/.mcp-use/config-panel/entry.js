import { jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import "./styles.css";
import Component from "/Users/e.t./Projects/mcp-use/mcp-servers/templates/resource-watcher/resources/config-panel/widget.tsx";
const container = document.getElementById("widget-root");
if (container && Component) {
  const root = createRoot(container);
  root.render(/* @__PURE__ */ jsx(Component, {}));
}
//# sourceMappingURL=entry.js.map
