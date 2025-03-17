import { useCallback, useState } from "react"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { VSCodeButtonLink } from "../common/VSCodeButtonLink"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { validateApiConfiguration } from "../../utils/validate"
import { vscode } from "../../utils/vscode"
import ApiOptions from "../settings/ApiOptions"
import { Tab, TabContent } from "../common/Tab"
import { useAppTranslation } from "../../i18n/TranslationContext"
import { getRequestyAuthUrl, getOpenRouterAuthUrl } from "../../oauth/urls"

const WelcomeView = () => {
	const { apiConfiguration, currentApiConfigName, setApiConfiguration, uriScheme } = useExtensionState()
	const { t } = useAppTranslation()
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

	const handleSubmit = useCallback(() => {
		const error = validateApiConfiguration(apiConfiguration)

		if (error) {
			setErrorMessage(error)
			return
		}

		setErrorMessage(undefined)
		vscode.postMessage({ type: "upsertApiConfiguration", text: currentApiConfigName, apiConfiguration })
	}, [apiConfiguration, currentApiConfigName])

	return (
		<Tab>
			<TabContent className="flex flex-col gap-5">
				<h2 className="m-0 p-0">{t("welcome:greeting")}</h2>
				<div>{t("welcome:introduction")}</div>
				<div>{t("welcome:chooseProvider")}</div>

				<div className="mb-4">
					<h4 className="mt-3 mb-2">{t("welcome:startRouter")}</h4>

					<div className="flex gap-4">
						<div className="flex-1 border border-vscode-panel-border rounded p-4 flex flex-col items-center">
							<VSCodeButtonLink
								href={getRequestyAuthUrl(uriScheme)}
								className="bg-blue-500 text-white w-16 h-16 flex items-center justify-center rounded mb-2 text-xl font-bold no-underline">
								REQ
							</VSCodeButtonLink>
							<div className="text-center">
								<div className="font-bold">Requesty</div>
								<div className="text-sm text-vscode-descriptionForeground">
									{t("welcome:requestyDescription")}
								</div>

								<div className="text-sm text-blue-400 font-bold">$1 free credit</div>
							</div>
						</div>
						<div className="flex-1 border border-vscode-panel-border rounded p-4 flex flex-col items-center">
							<VSCodeButtonLink
								href={getOpenRouterAuthUrl(uriScheme)}
								className="bg-blue-500 text-white w-16 h-16 flex items-center justify-center rounded mb-2 text-xl font-bold no-underline">
								OR
							</VSCodeButtonLink>
							<div className="text-center">
								<div className="font-bold">OpenRouter</div>
								<div className="text-sm text-vscode-descriptionForeground">
									{t("welcome:openRouterDescription")}
								</div>
							</div>
						</div>
					</div>

					<div className="text-center my-4">or</div>
					<h4 className="mt-3 mb-2">{t("welcome:startCustom")}</h4>
					<ApiOptions
						fromWelcomeView
						apiConfiguration={apiConfiguration || {}}
						uriScheme={uriScheme}
						setApiConfigurationField={(field, value) => setApiConfiguration({ [field]: value })}
						errorMessage={errorMessage}
						setErrorMessage={setErrorMessage}
					/>
				</div>
			</TabContent>
			<div className="sticky bottom-0 bg-vscode-sideBar-background p-5">
				<div className="flex flex-col gap-1">
					<VSCodeButton onClick={handleSubmit} appearance="primary">
						{t("welcome:start")}
					</VSCodeButton>
					{errorMessage && <div className="text-vscode-errorForeground">{errorMessage}</div>}
				</div>
			</div>
		</Tab>
	)
}

export default WelcomeView
