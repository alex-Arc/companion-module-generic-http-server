import { type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	folder: string
	port: number
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
			type: 'number',
			id: 'port',
			label: 'Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 8001,
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
