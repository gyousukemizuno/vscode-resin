import * as vscode from 'vscode';
import { ResinServerProvider, ResinItem } from './ResinServerProvider';
import { ResinServerController } from './ResinServerController';
import { ResinModel } from './ResinModel';
import * as os from "os";

export function activate(context: vscode.ExtensionContext) {
	let storagePath = context.storagePath;
	if (!storagePath) {
		storagePath = os.tmpdir();
	}
	const resinModel = new ResinModel(storagePath);
	const resinServerController = new ResinServerController(resinModel);
	const resinServerProvider = new ResinServerProvider(resinModel);
	context.subscriptions.push(resinServerProvider);
	context.subscriptions.push(vscode.window.registerTreeDataProvider('resinServerExplorer', resinServerProvider));
	context.subscriptions.push(vscode.commands.registerCommand('resin.server.add', () => {
		resinServerController.add();
	}));
	context.subscriptions.push(vscode.commands.registerCommand('resin.server.delete', (server: ResinItem | undefined) => {
		resinServerController.delete(server);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('resin.server.start', (server: ResinItem | undefined) => {
		resinServerController.start(server);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('resin.server.stop', (server: ResinItem | undefined) => {
		resinServerController.stop(server);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('resin.server.restart', (server: ResinItem | undefined) => {
		resinServerController.restart(server);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('resin.tree.refresh', (server: ResinItem | undefined) => {
		resinServerProvider.refresh(server);
	}));

}

export function deactivate() { }
