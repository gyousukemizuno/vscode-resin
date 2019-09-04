import * as vscode from "vscode";
import { ResinModel } from "./ResinModel";


export class ResinServerProvider implements vscode.TreeDataProvider<ResinServer> {

    private _onDidChangeTreeData: vscode.EventEmitter<ResinServer | undefined> = new vscode.EventEmitter<ResinServer | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ResinServer | undefined> = this._onDidChangeTreeData.event;

    constructor(private model: ResinModel) {
    }

    public refresh(element: ResinServer|undefined): void {
        this._onDidChangeTreeData.fire(element);
    }

    getTreeItem(element: ResinServer): ResinServer {
        return element;
    }

    async getChildren(element?: ResinServer | undefined): Promise<ResinServer[]> {
        if (!element) {
            return this.model.getServers();
        }
        return [];
    }

    dispose(): void {
    }
}

export class ResinServer extends vscode.TreeItem {
    constructor(public readonly label: string, public readonly installPath: string, public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Expanded) {
        super(label, collapsibleState);
    }
}