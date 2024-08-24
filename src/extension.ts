import * as vscode from 'vscode';

import {
	Disposable
} from "vscode";

import {
	sealedStates
} from "./commands";

import { FlutterPlusConfig } from './config/config';
import { wrapWith } from './utils';


import {
	dartCodeExtensionIdentifier,
	flutterExtensionIdentifier,
} from "./constants";

/* import fs from 'fs';
import path from 'path'; */

import {
	SdkCommands,
} from './utils';
import { CodeActionWrap } from './code-actions';

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
	var wraps = $registerWrappers(context);
	const disposable = vscode.workspace.onDidChangeConfiguration(event => {
		if (!event.affectsConfiguration('flutter-plus')) {
			return;
		}

		$unregisterWrappers(wraps);
		wraps = $registerWrappers(context);
	});

	context.subscriptions.push(disposable);
}

function $unregisterWrappers(disposables: Array<Disposable>) {
	disposables.forEach((disposable) => disposable.dispose());
}

function $registerWrappers(context: vscode.ExtensionContext): Array<Disposable> {
	const configWraps = FlutterPlusConfig.getInstance().getCustomWraps();
	const wraps: Array<CodeWrap> = configWraps.map((wrap) => {
		return {
			commandId: "flutter-plus.wrapWith." + wrap.name.toLowerCase().replace(/\s/g, "-"),
			title: "Wrap with " + wrap.name,
			command: () => wrapWith((selectedText) => wrap.body.join("\n").replace("\${widget}", selectedText)),
		};
	});

	const subscriptions = wraps.map((wrap) => {
		return vscode.commands.registerCommand(wrap.commandId, wrap.command);
	});

	context.subscriptions.push(
		...subscriptions,
		vscode.languages.registerCodeActionsProvider(DART_MODE, new CodeActionWrap(wraps)),
	);

	return subscriptions;
}


export function deactivate() { }

export type CodeWrap = {
	commandId: string,
	title: string,
	command: () => void,
};