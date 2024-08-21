import * as vscode from 'vscode';

import {
	commands,
	languages
} from "vscode";

import {
	sealedStates,
	wrapWithListenableBuilder,
	wrapWithValueListenableBuilder,
} from "./commands";

import {
	CodeActionWrap,
} from './code-actions';

const DART_MODE = { language: "dart", scheme: "file" };

export function activate(context: vscode.ExtensionContext) {
	//console.log('Congratulations, your extension "flutter-plus" is now active!');

	context.subscriptions.push(
		/* vscode.commands.registerCommand('flutter-plus.helloWorld', () => {
			vscode.window.showInformationMessage('Hello World from Flutter Plus!');
		}), */
		commands.registerCommand("flutter-plus.sealed-states", sealedStates),
		commands.registerCommand("flutter-plus.wrap-listenablebuilder", wrapWithListenableBuilder),
		commands.registerCommand("flutter-plus.wrap-valuelistenablebuilder", wrapWithValueListenableBuilder),

		languages.registerCodeActionsProvider(
			DART_MODE,
			new CodeActionWrap(),
		),
	);
}

export function deactivate() { }
