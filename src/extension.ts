import * as vscode from 'vscode';

import {
	commands,
	languages
} from "vscode";

import {
	sealedStates,
	wrapWithListenableBuilder,
	wrapWithRepaintBoundary,
	wrapWithSizedBox,
	wrapWithValueListenableBuilder,
} from "./commands";

import {
	CodeActionWrap,
} from './code-actions';


import {
	dartCodeExtensionIdentifier,
	flutterExtensionIdentifier,
} from "./constants";
import { SdkCommands } from './utils/sdk';

const DART_MODE = { language: "dart", scheme: "file" };

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	// Ensure we have a Dart extension.
	const dartExt = vscode.extensions.getExtension(dartCodeExtensionIdentifier);
	if (!dartExt) {
		// This should not happen since the Flutter extension has a dependency on the Dart one
		// but just in case, we'd like to give a useful error message.
		throw new Error("The Dart extension is not installed, Flutter extension is unable to activate.");
	}
	await dartExt.activate();
	if (!dartExt.exports) {
		console.error("The Dart extension did not provide an exported API. Maybe it failed to activate or is not the latest version?");
		return;
	}

	// Ensure we have a Flutter extension.
	const flutterExt = vscode.extensions.getExtension(flutterExtensionIdentifier);
	if (!flutterExt) {
		// This should not happen since the Flutter extension has a dependency on the Dart one
		// but just in case, we'd like to give a useful error message.
		throw new Error("The Flutter extension is not installed, Flutter Plus extension is unable to activate.");
	}
	await flutterExt.activate();

	// Register SDK commands.
	const sdkCommands = new SdkCommands(context, dartExt.exports);

	//console.log('Congratulations, your extension "flutter-plus" is now active!');

	registerCommands(context);
	registerWrappers(context);
}

/// Register all commands.
function registerCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		/* vscode.commands.registerCommand('flutter-plus.helloWorld', () => {
			vscode.window.showInformationMessage('Hello World from Flutter Plus!');
		}), */
		commands.registerCommand("flutter-plus.sealed-states", sealedStates),
	);
}

/// Register all wrappers (Wrap With...).
function registerWrappers(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand("flutter-plus.wrap-sizedbox", wrapWithSizedBox),
		commands.registerCommand("flutter-plus.wrap-listenablebuilder", wrapWithListenableBuilder),
		commands.registerCommand("flutter-plus.wrap-valuelistenablebuilder", wrapWithValueListenableBuilder),
		commands.registerCommand("flutter-plus.wrap-repaintboundary", wrapWithRepaintBoundary),
		languages.registerCodeActionsProvider(
			DART_MODE,
			new CodeActionWrap(),
		),
	);
}

export function deactivate() { }
