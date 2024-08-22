import { window, workspace } from "vscode";

export type CustomWrapConfig = {
  name: string,
  id: string,
  body: Array<string>,
};

export class FlutterPlusConfig {
  private static instance: FlutterPlusConfig;

  public static getInstance(): FlutterPlusConfig {
    if (!FlutterPlusConfig.instance) {
      FlutterPlusConfig.instance = new FlutterPlusConfig();
    }
    return FlutterPlusConfig.instance;
  }

  public getCustomWraps(): Array<CustomWrapConfig> {
    const config = workspace.getConfiguration('flutterplus');
    const customWraps = config.get<Array<CustomWrapConfig>>('customWraps');

    return customWraps || [];
  }
}