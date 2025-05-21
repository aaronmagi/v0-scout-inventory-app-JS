"use client"
import { css } from "@emotion/css"
import type { GrafanaTheme2 } from "@grafana/data"

type AppConfigProps = {}

export function AppConfig({ ...props }: AppConfigProps) {
  // const styles = useStyles2(getStyles)
  // const [apiUrl, setApiUrl] = useState("http://inventory-api.example.com")
  // const [vaultPath, setVaultPath] = useState("secret/data/redfish")
  // const [isSaving, setIsSaving] = useState(false)
  // const [saveSuccess, setSaveSuccess] = useState(false)
  // const [saveError, setSaveError] = useState<string | null>(null)

  // const handleSave = async () => {
  //   setIsSaving(true)
  //   setSaveSuccess(false)
  //   setSaveError(null)

  //   try {
  //     // In a real implementation, this would save to Grafana's app settings
  //     // For now, we'll just simulate the API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000))

  //     setSaveSuccess(true)
  //     setIsSaving(false)
  //   } catch (err) {
  //     console.error("Error saving configuration:", err)
  //     setSaveError("Failed to save configuration. Please try again.")
  //     setIsSaving(false)
  //   }
  // }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Scout Inventory Plugin Configuration</h1>
      <p>
        This is a placeholder for the Grafana plugin configuration. The actual configuration is handled in the main
        application.
      </p>
    </div>
  )
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      max-width: 800px;
      margin: 0 auto;
    `,
    readOnlyField: css`
      padding: 8px 10px;
      background-color: ${theme.colors.background.secondary};
      border-radius: 4px;
      color: ${theme.colors.text.secondary};
    `,
    buttonContainer: css`
      margin-top: 24px;
    `,
  }
}
