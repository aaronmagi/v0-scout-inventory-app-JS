type AppProps = {}

export function App({ ...props }: AppProps) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Scout Inventory Plugin</h1>
      <p>
        This is a placeholder for the Grafana plugin. The actual functionality is implemented in the main application.
      </p>
    </div>
  )
}
