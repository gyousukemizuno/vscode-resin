import { ResinServer } from "./ResinServerProvider";
import * as path from "path";
import * as fse from "fs-extra";
import * as vscode from "vscode";

export class ResinModel {

  private servers: ResinServer[] = [];
  private serversJsonFile: string = "";

  constructor(public storagePath: string) {
    this.serversJsonFile = path.join(storagePath, "servers.json");
    this.load();
  }

  private load(): void {
    try {
      const objs = fse.readJSONSync(this.serversJsonFile);
      if (objs !== undefined) {
        this.servers = this.servers.concat(objs.map((obj: { label: string, installPath: string }) => { return new ResinServer(obj.label, obj.installPath); }));
      }
    } catch (e) {
      // ignore;
    }
  }

  /**
   * 指定されたサーバーをサーバーリストに追加します。
   * 指定されたサーバーがサーバーリストに追加されている場合は、サーバーリストから削除し、新規追加します。
   * 
   * @param server サーバー
   */
  add(server: ResinServer): void {
    const index = this.servers.findIndex((s:ResinServer) => server.installPath === s.installPath);
    if (index > -1) {
      this.servers.splice(index, 1);
    }
    this.servers.push(server);
    this.save();
  }

  private async save(): Promise<void> {
    await fse.outputJSONSync(this.serversJsonFile, this.servers.map((s: ResinServer) => {
      return { label: s.label, installPath: s.installPath };
    }));
    vscode.commands.executeCommand('resin.tree.refresh');
  }

  getServers(): ResinServer[] {
    return this.servers;
  }
}