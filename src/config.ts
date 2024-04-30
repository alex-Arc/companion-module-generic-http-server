import { type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	folder: string
	port: number
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
	]
}
