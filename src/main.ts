import {
	CompanionHTTPRequest,
	CompanionHTTPResponse,
	InstanceBase,
	runEntrypoint,
	InstanceStatus,
	SomeCompanionConfigField,
} from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import { stat, existsSync, readFileSync } from 'node:fs'
import { join, extname } from 'node:path'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.startServer()
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.startServer()
	}

	private startServer() {
		try {
			this.updateStatus(InstanceStatus.Connecting)
			stat(this.config.folder, (err, info) => {
				if (err) {
					this.updateStatus(InstanceStatus.UnknownError, 'Failed to read folder')
					return
				}
				if (!info.isDirectory()) {
					this.updateStatus(InstanceStatus.UnknownError, 'The provided path is not a folder')
					return
				}
			})
			this.updateStatus(InstanceStatus.Ok)
		} catch (err) {
			this.updateStatus(InstanceStatus.UnknownError, String(err))
		}
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	public handleHttpRequest(request: CompanionHTTPRequest): CompanionHTTPResponse {
		if (request.method != 'GET') {
			return { status: 404, body: 'Only GET requests are supported' }
		}

		if (request.path === '/' && this.config.redirect) {
			return { status: 307, headers: { Location: request.baseUrl + this.config.path } }
		}

		const fullPath = join(this.config.folder, request.path)

		if (existsSync(fullPath)) {
			const extension = extname(fullPath)
			const mime = fileMIME[extension]

			if (!mime) {
				return {
					status: 404,
					body: `the extension type ${extension} is not supported`,
				}
			}

			const body = readFileSync(fullPath).toString()
			return { status: 200, body: body, headers: { 'Content-Type': mime } }
		}

		return {
			status: 404,
			body: 'nothing hit',
		}
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)

const fileMIME: Record<string, string> = {
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'application/javascript',
}
