import { useCallback, useState } from "react"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
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

	// Using a lazy initializer so it reads once at mount
	const [imagesBaseUri] = useState(() => {
		const w = window as any
		return w.IMAGES_BASE_URI || ""
	})

	return (
		<Tab>
			<TabContent className="flex flex-col gap-5">
				<h2 className="m-0 p-0">{t("welcome:greeting")}</h2>
				<div>{t("welcome:introduction")}</div>
				<div>{t("welcome:chooseProvider")}</div>

				<div className="mb-4">
					<h4 className="mt-3 mb-2">{t("welcome:startRouter")}</h4>

					<div className="flex gap-4">
						<a
							href={getRequestyAuthUrl(uriScheme)}
							className="flex-1 border border-vscode-panel-border rounded p-4 flex flex-col items-center cursor-pointer transition-all hover:bg-vscode-button-hoverBackground hover:border-vscode-button-border no-underline text-inherit"
							target="_blank"
							rel="noopener noreferrer">
							<div className="w-16 h-16 flex items-center justify-center rounded mb-2 overflow-hidden bg-white relative">
								<img
									src={`${imagesBaseUri}/requesty.png`}
									alt="Requesty"
									className="w-full h-full object-contain p-2"
								/>
							</div>
							<div className="text-center">
								<div className="font-bold">Requesty</div>
								<div className="text-sm text-vscode-descriptionForeground">
									{t("welcome:requestyDescription")}
								</div>

								<div className="text-sm font-bold">$1 free credit</div>
							</div>
						</a>
						<a
							href={getOpenRouterAuthUrl(uriScheme)}
							className="flex-1 border border-vscode-panel-border rounded p-4 flex flex-col items-center cursor-pointer transition-all hover:bg-vscode-button-hoverBackground hover:border-vscode-button-border no-underline text-inherit"
							target="_blank"
							rel="noopener noreferrer">
							<div className="w-16 h-16 flex items-center justify-center rounded mb-2 overflow-hidden bg-white relative">
								<img
									src={`${imagesBaseUri}/openrouter.png`}
									alt="OpenRouter"
									className="w-full h-full object-contain p-2"
								/>
							</div>
							<div className="text-center">
								<div className="font-bold">OpenRouter</div>
								<div className="text-sm text-vscode-descriptionForeground">
									{t("welcome:openRouterDescription")}
								</div>
							</div>
						</a>
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
