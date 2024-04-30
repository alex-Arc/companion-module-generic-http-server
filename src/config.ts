import { type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	folder: string
	redirect: boolean
	path: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'folder',
			label: 'Folder',
			width: 8,
		},
		{
			type: 'checkbox',
			id: 'redirect',
			label: 'Reddirect from top level path',
			default: false,
			width: 8,
			tooltip: 'Use this to redirect the path "ip:port/" to "ip:port/RedirectPath"',
		},
		{
			type: 'textinput',
			id: 'path',
			label: 'Redirect path',
			default: '/index.html',
			width: 8,
			isVisible: (options) => options.redirect == true,
		},
	]
}
