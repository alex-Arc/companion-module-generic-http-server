import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import { type Server } from 'node:http'
import { stat } from 'node:fs'
import express from 'express'

export const app = express()

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	private server: null | Server = null

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.startServer()
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.server?.close()
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.server?.close()
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

			this.server = app.listen(this.config.port)
			app.use(express.static(this.config.folder))

			this.updateStatus(InstanceStatus.Ok)
		} catch (err) {
			this.updateStatus(InstanceStatus.UnknownError, String(err))
		}
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	// updateActions(): void {}

	// updateFeedbacks(): void {
	// 	UpdateFeedbacks(this)
	// }

	// updateVariableDefinitions(): void {
	// 	UpdateVariableDefinitions(this)
	// }
}

runEntrypoint(ModuleInstance, UpgradeScripts)
