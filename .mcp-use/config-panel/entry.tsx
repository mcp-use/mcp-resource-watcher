import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Component from '/private/tmp/mcp-template-bumps/mcp-resource-watcher/resources/config-panel/widget.tsx'

const container = document.getElementById('widget-root')
if (container && Component) {
  const root = createRoot(container)
  root.render(<Component />)
}
