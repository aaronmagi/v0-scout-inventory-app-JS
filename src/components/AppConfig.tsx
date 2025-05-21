"use client"

import { useState } from "react"
import { FieldSet, Field, Input, Button, Alert, useStyles2 } from "@grafana/ui"
import { css } from "@emotion/css"
import type { GrafanaTheme2 } from "@grafana/data"

export function AppConfig() {
  const styles = useStyles2(getStyles)
  const [apiUrl, setApiUrl] = useState("http://inventory-api.example.com")
  const [vaultPath, setVaultPath] = useState("secret/data/redfish")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    setSaveError(null)

    try {
      // In a real implementation, this would save to Grafana's app settings
      // For now, we'll just simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaveSuccess(true)
      setIsSaving(false)
    } catch (err) {
      console.error("Error saving configuration:", err)
      setSaveError("Failed to save configuration. Please try again.")
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.container}>
      <h3>Scout Inventory Configuration</h3>

      {saveSuccess && (
        <Alert title="Success" severity="success">
          Configuration saved successfully.
        </Alert>
      )}

      {saveError && (
        <Alert title="Error" severity="error">
          {saveError}
        </Alert>
      )}

      <FieldSet label="API Configuration">
        <Field label="Inventory API URL" description="The base URL for the Scout Inventory API">
          <Input
            value={apiUrl}
            onChange={(e) => setApiUrl(e.currentTarget.value)}
            placeholder="https://api.example.com"
            width={40}
          />
        </Field>

        <Field label="Vault Path" description="The HashiCorp Vault path for Redfish credentials">
          <Input
            value={vaultPath}
            onChange={(e) => setVaultPath(e.currentTarget.value)}
            placeholder="secret/data/redfish"
            width={40}
          />
        </Field>
      </FieldSet>

      <FieldSet label="Authentication">
        <Field label="Authentication Method" description="Method used to authenticate with the API">
          <div className={styles.readOnlyField}>Microsoft Entra ID (Azure AD)</div>
        </Field>
      </FieldSet>

      <div className={styles.buttonContainer}>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
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
