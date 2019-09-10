import { ResinItem } from "./ResinServerProvider";
import * as path from "path";
import * as fse from "fs-extra";
import * as vscode from "vscode";

export class ResinModel {

  private servers: ResinItem[] = [];
  private serversJsonFile: string = "";

  constructor(public storagePath: string) {
    this.serversJsonFile = path.join(storagePath, "servers.json");
    this.load();
  }

  private load(): void {
    const objs = fse.readJSONSync(this.serversJsonFile);
    if (objs !== undefined) {
      this.servers = this.servers.concat(objs.map((obj: { type:string, label: string, resinRoot: string }) => {
        return new ResinItem(obj.type, obj.label, obj.resinRoot);
      }));
    }
  }

  /**
   * 指定されたサーバーをサーバーリストに追加します。
   * 指定されたサーバーがサーバーリストに追加されている場合は、サーバーリストから削除し、新規追加します。
   * 
   * @param server サーバー
   */
  add(server: ResinItem): void {
    const index = this.servers.findIndex((s: ResinItem) => server.resinRoot === s.resinRoot);
    if (index > -1) {
      this.servers.splice(index, 1);
    }
    this.servers.push(server);
    this.save();
  }

  delete(server: ResinItem): void {
    const index = this.servers.findIndex((s: ResinItem) => server.resinRoot === s.resinRoot);
    if (index > -1) {
      this.servers.splice(index, 1);
    }
    this.save();
  }

  private async save(): Promise<void> {
    await fse.outputJSONSync(this.serversJsonFile, this.servers.map((s: ResinItem) => {
      return { type: s.contextValue, label: s.label, resinRoot: s.resinRoot };
    }));
    vscode.commands.executeCommand('resin.tree.refresh');
  }

  getServers(): ResinItem[] {
    return this.servers;
  }
}