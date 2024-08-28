import * as vscode from 'vscode';
import { Disposable } from "vscode";
import { sealedStates } from "./commands";
import { FlutterPlusConfig } from './config/config';
import { wrapWith } from './utils';
import { dartCodeExtensionIdentifier, flutterExtensionIdentifier } from "./constants";
import { CodeActionWrap } from './code-actions';
import { SdkCommands } from './utils';

const DART_MODE = { language: "dart", scheme: "file" };

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	// Ensure we have a Dart extension.
	const dartExt = vscode.extensions.getExtension(dartCodeExtensionIdentifier);
	if (!dartExt) {
		vscode.window.showErrorMessage("The Dart extension is not installed. Flutter extension cannot be activated.");
		return;
	}
	await dartExt.activate();

	if (!dartExt.exports) {
		console.error("The Dart extension did not provide an exported API. It may have failed to activate or is not the latest version.");
		return;
	}

	// Ensure we have a Flutter extension.
	const flutterExt = vscode.extensions.getExtension(flutterExtensionIdentifier);
	if (!flutterExt) {
		vscode.window.showErrorMessage("The Flutter extension is not installed. Flutter Plus extension cannot be activated.");
		return;
	}
	await flutterExt.activate();

	// Register SDK commands.
	const sdkCommands = new SdkCommands(context, dartExt.exports);

	registerCommands(context);
	registerWrappers(context);
}

/// Register all commands.
function registerCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand("flutter-plus.sealed-states", sealedStates),
	);
}

/// Register all wrappers (Wrap With...).
function registerWrappers(context: vscode.ExtensionContext) {
	let wrappers = registerWrapperCommands(context);
	const disposable = vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('flutter-plus')) {
			unregisterWrappers(wrappers);
			wrappers = registerWrapperCommands(context);
		}
	});

	context.subscriptions.push(disposable);
}

function unregisterWrappers(disposables: Disposable[]) {
	disposables.forEach(disposable => disposable.dispose());
}

function registerWrapperCommands(context: vscode.ExtensionContext): Disposable[] {
	try {
		const configWraps = FlutterPlusConfig.getInstance().getCustomWraps();
		const wraps: CodeWrap[] = configWraps.map(wrap => ({
			commandId: `flutter-plus.wrapWith.${wrap.name.toLowerCase().replace(/\s/g, "-")}`,
			title: `Wrap with ${wrap.name}`,
			command: () => wrapWith(selectedText => wrap.body.join("\n").replace("${widget}", selectedText)),
		}));

		const filteredWraps = wraps.filter((wrap, index, self) =>
			index === self.findIndex(t => t.commandId === wrap.commandId)
		);

		if (filteredWraps.length < wraps.length) {
			const duplicates = wraps.filter((wrap, index, self) =>
				index !== self.findIndex(t => t.commandId === wrap.commandId)
			);

			vscode.window.showWarningMessage(`Multiple wraps with the same command ID found: ${duplicates.map(d => d.commandId).join(", ")}`);
		}

		const subscriptions = filteredWraps.map(wrap =>
			vscode.commands.registerCommand(wrap.commandId, wrap.command)
		);

		subscriptions.push(vscode.languages.registerCodeActionsProvider(DART_MODE, new CodeActionWrap(wraps)));
		context.subscriptions.push(...subscriptions);

		return subscriptions;
	} catch (error) {
		vscode.window.showErrorMessage(`Error registering wraps: ${error}`);
		return [];
	}
}

export function deactivate() { }

export type CodeWrap = {
	commandId: string;
	title: string;
	command: () => void;
};