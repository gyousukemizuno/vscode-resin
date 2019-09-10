import * as vscode from "vscode";
import { ResinModel } from "./ResinModel";
import * as fs from "fs";
import * as path from "path";

export class ResinServerProvider implements vscode.TreeDataProvider<ResinItem> {

    private _onDidChangeTreeData: vscode.EventEmitter<ResinItem | undefined> = new vscode.EventEmitter<ResinItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<ResinItem | undefined> = this._onDidChangeTreeData.event;

    constructor(private model: ResinModel) {
    }

    public refresh(element: ResinItem | undefined): void {
        this._onDidChangeTreeData.fire(element);
    }

    getTreeItem(element: ResinItem): ResinItem {
        return element;
    }

    async getChildren(element?: ResinItem | undefined): Promise<ResinItem[]> {
        if (!element) {
            return this.model.getServers();
        }
        if (element.contextValue === ResinItem.SERVER_TYPE) {
            const webappsDir = path.join(element.resinRoot, 'webapps');
            const dirs = fs.readdirSync(webappsDir);
            const children: ResinItem[] = [];
            dirs.forEach(dir => {
                if (dir !== "ROOT") {
                    children.push(ResinItem.buildContent(dir));
                }
            });
            return children;
        }
        return [];
    }

    dispose(): void {
    }
}

export class ResinItem extends vscode.TreeItem {

    public static SERVER_TYPE = 'server';
    public static CONTENT_TYPE = 'contet';
    public static APPLICATION_TYPE = 'app';

    constructor(public readonly contextValue: string,
        public readonly label: string,
        public readonly resinRoot: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Expanded) {
        super(label, collapsibleState);
    }

    static buildContent(root: string): ResinItem {
        const label: string = path.basename(root);
        return new ResinItem(ResinItem.CONTENT_TYPE, label, root, vscode.TreeItemCollapsibleState.Collapsed);
    }

    static buildServer(resinRoot: string): ResinItem {
        const resinPath = path.join(resinRoot, "bin/resin.sh");
        if (!fs.existsSync(resinPath)) {
            throw new Error('resin.exe not found.');
        }
        const label = path.basename(resinRoot);
        return new ResinItem(ResinItem.SERVER_TYPE, label, resinRoot);
    }

    getResinJar(): string {
        return path.join(this.resinRoot, "lib/resin.jar");
    }

    isServer(): boolean {
        return this.contextValue === ResinItem.SERVER_TYPE;
    }
}