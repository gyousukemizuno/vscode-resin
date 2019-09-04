import * as vscode from 'vscode';
import { ResinServer } from "./ResinServerProvider";
import * as path from "path";
import { ResinModel } from './ResinModel';

export class ResinServerController {

    constructor(private model: ResinModel) {
    }

    async add(): Promise<ResinServer | undefined> {
        const uri = await vscode.window.showOpenDialog({
            defaultUri: vscode.workspace.rootPath ? vscode.Uri.file(vscode.workspace.rootPath) : undefined,
            canSelectFiles: false,
            canSelectFolders: true,
            openLabel: 'Select Resin Directory'
        });
        if (uri === undefined || !uri[0].fsPath) {
            return;
        }
        const installPath = uri[0].fsPath;
        const serverName: string = path.basename(installPath);
        const server = new ResinServer(serverName, installPath);
        this.model.add(server);
    }

    async delete(server: ResinServer | undefined) {
        if (!server) {
            return;
        }
        this.model.delete(server);
    }
}