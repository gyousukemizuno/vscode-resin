import * as vscode from "vscode";
import { ResinModel } from "./ResinModel";


export class ResinServerProvider implements vscode.TreeDataProvider<ResinServer> {

    public eventEmitter: vscode.EventEmitter<vscode.TreeItem> = new vscode.EventEmitter<vscode.TreeItem>();
    public readonly event: vscode.Event<vscode.TreeItem> = this.eventEmitter.event;

    constructor(private model: ResinModel) {
        this.eventEmitter.fire();
    }

    public refresh(element: ResinServer|undefined): void {
        this.eventEmitter.fire(element);
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
}

export class ResinServer extends vscode.TreeItem {
    constructor(public readonly label: string, public readonly installPath: string, public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Expanded) {
        super(label, collapsibleState);
    }
}