import { workspace } from "vscode";

export type CustomWrapConfig = {
  name: string,
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
    const config = workspace.getConfiguration('flutter-plus');
    const customWraps = config.get<Array<CustomWrapConfig>>('wraps');

    return customWraps || [];
  }
}