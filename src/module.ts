import { AppPlugin } from "@grafana/data"
import { App } from "./components/App"
import { AppConfig } from "./components/AppConfig"
import { ServerDetailsPage } from "./pages/ServerDetailsPage"
import { FiltersPage } from "./pages/FiltersPage"

export const plugin = new AppPlugin<{}>()
  .setRootPage(App)
  .addConfigPage({
    title: "Configuration",
    icon: "cog",
    body: AppConfig,
    id: "configuration",
  })
  .addRootPage({
    title: "Server Details",
    icon: "server",
    url: "/server-details",
    component: ServerDetailsPage,
  })
  .addRootPage({
    title: "Filters",
    icon: "filter",
    url: "/filters",
    component: FiltersPage,
  })
