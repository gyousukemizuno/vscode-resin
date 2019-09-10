import * as vscode from 'vscode';
import { ResinItem } from "./ResinServerProvider";
import * as path from "path";
import { ResinModel } from './ResinModel';
import * as child_process from "child_process";

export class ResinServerController {

    private outputChannel: vscode.OutputChannel;

    constructor(private model: ResinModel) {
        this.outputChannel = vscode.window.createOutputChannel('vscode-resin');
    }

    async add(): Promise<ResinItem | undefined> {
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
        const server = ResinItem.buildServer(installPath);
        this.model.add(server);
    }

    async delete(server: ResinItem | undefined) {
        if (!server) {
            return;
        }
        this.model.delete(server);
    }

    async start(server: ResinItem | undefined) {
        if (!server) {
            return;
        }
        const process: Promise<void> = this.execute('java', ['-jar', server.getResinJar(), '--verbose', 'console'], { shell: true });
        await process;
    }

    async stop(server: ResinItem | undefined) {
        if (!server) {
            return;
        }
        const process: Promise<void> = this.execute('java', ['-jar', server.getResinJar(), 'stop'], { shell: true });
        await process;
    }

    async restart(server: ResinItem | undefined) {
        if (!server) {
            return;
        }
        const process: Promise<void> = this.execute('java', ['-jar', server.getResinJar(), 'restart'], { shell: true });
        await process;
    }

    async execute(command: string, args?: string[], options?: child_process.SpawnOptions) {
        await new Promise((resolve: () => void, reject: (e: Error) => void): void => {
            this.outputChannel.show();
            let stderr: string = '';
            const p: child_process.ChildProcess = child_process.spawn(command, args, options);
            p.stdout.on('data', (data: string | Buffer): void =>
                this.outputChannel.append(data.toString()));
            p.stderr.on('data', (data: string | Buffer) => {
                stderr = stderr.concat(data.toString());
                this.outputChannel.append(data.toString());
            });
            p.on('error', (err: Error) => {
                reject(err);
            });
            p.on('exit', (code: number) => {
                if (code !== 0) {
                    reject(new Error('resin command error.'));
                }
                resolve();
            });
        });
    }
}
