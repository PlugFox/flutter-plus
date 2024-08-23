import * as vscode from 'vscode';

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

/* import fs from 'fs';
import path from 'path'; */

import {
	SdkCommands,
} from './utils';

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
	//registerActionButtons(context);
	registerWrappers(context);
}

/// Register all commands.
function registerCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		/* vscode.commands.registerCommand('flutter-plus.helloWorld', () => {
			vscode.window.showInformationMessage('Hello World from Flutter Plus!');
		}), */
		vscode.commands.registerCommand("flutter-plus.sealed-states", sealedStates),
	);
}

/* function registerActionButtons(context: vscode.ExtensionContext) {
	function runPubGet() {
		// Example of running `dart pub get` or `flutter pub get`
		const pubspecPath = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', 'pubspec.yaml');
		if (fs.existsSync(pubspecPath)) {
			const pubspecContent = fs.readFileSync(pubspecPath, 'utf8');
			const isFlutterApp = pubspecContent.includes('flutter:');
			const command = isFlutterApp ? 'flutter pub get' : 'dart pub get';
			executeCommand(command);
		}
	}
	context.subscriptions.push(vscode.commands.registerCommand('flutter-plus.pub-get', () => {
		runPubGet();
	}));
} */

/// Register all wrappers (Wrap With...).
function registerWrappers(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand("flutter-plus.wrap-sizedbox", wrapWithSizedBox),
		vscode.commands.registerCommand("flutter-plus.wrap-listenablebuilder", wrapWithListenableBuilder),
		vscode.commands.registerCommand("flutter-plus.wrap-valuelistenablebuilder", wrapWithValueListenableBuilder),
		vscode.commands.registerCommand("flutter-plus.wrap-repaintboundary", wrapWithRepaintBoundary),
		vscode.languages.registerCodeActionsProvider(
			DART_MODE,
			new CodeActionWrap(),
		),
	);
}

export function deactivate() { }
