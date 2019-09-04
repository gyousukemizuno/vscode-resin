import * as vscode from 'vscode';
import { ResinServerProvider, ResinServer } from './ResinServerProvider';
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
	context.subscriptions.push(vscode.commands.registerCommand('resin.server.delete', (server: ResinServer | undefined) => {
		resinServerController.delete(server);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('resin.tree.refresh', (server: ResinServer | undefined) => {
		resinServerProvider.refresh(server);
	}));
}

export function deactivate() { }
