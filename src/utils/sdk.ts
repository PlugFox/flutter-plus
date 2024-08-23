import * as vscode from "vscode";

export class SdkCommands {
    // TODO: Find an easy way to share the API signature class.
    constructor(context: vscode.ExtensionContext, private dartExtensionApi: any) {

        // context.subscriptions.push(vs.commands.registerCommand("flutter.createSampleProject",
        // 	(_) => this.runFunctionIfSupported(dartExtensionApi.flutterCreateSampleProject)));
    }

    private async runFunctionIfSupported<T>(f: () => Promise<T>): Promise<T | undefined> {
        if (!f) {
            this.showApiMismatchError();
            return undefined;
        }

        return f();
    }

    private showApiMismatchError(): void {
        vscode.window.showErrorMessage("The installed version of the Dart extension does not support this feature.");
    }
}