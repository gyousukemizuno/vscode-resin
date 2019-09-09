import * as vscode from "vscode";
import { ResinModel } from "./ResinModel";
import * as fs from "fs";
import * as path from "path";
import { inherits } from "util";


export class ResinServerProvider implements vscode.TreeDataProvider<ResinServer> {

    private _onDidChangeTreeData: vscode.EventEmitter<ResinServer | undefined> = new vscode.EventEmitter<ResinServer | undefined>();
    readonly onDidChangeTreeData: vscode.Event<ResinServer | undefined> = this._onDidChangeTreeData.event;

    constructor(private model: ResinModel) {
    }

    public refresh(element: ResinServer | undefined): void {
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

    /**
     * Jar filename.
     */
    private jarFiles: string[] = [];

    constructor(public readonly label: string, public readonly resinRoot: string, public readonly installPath: string, public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Expanded) {
        super(label, collapsibleState);
    }

    static build(installPath: string): ResinServer {
        const resinRoot = path.join(installPath, "../..");
        const resinPath = path.join(resinRoot, "bin/resin.sh");
        if (!fs.existsSync(resinPath)) {
            throw new Error('resin.exe not found.');
        }
        const libPath = path.join(installPath, "WEB-INF/lib");
        if (!fs.existsSync(libPath)) {
            throw new Error('WEB-INF/lib directory not found.');
        }
        const label = path.basename(resinRoot) + '/' + path.basename(installPath);
        return new ResinServer(label, resinRoot, installPath);
    }

    getResinJar(): string {
        return path.join(this.resinRoot, "lib/resin.jar");
    }
}