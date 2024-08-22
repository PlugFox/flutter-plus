import * as vscode from 'vscode';

import {
	commands,
	languages,
	Disposable
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
import { FlutterPlusConfig } from './config/config';
import { wrapWith } from './utils';

const DART_MODE = { language: "dart", scheme: "file" };

export function activate(context: vscode.ExtensionContext) {
	var commands = $registerCommands();

	const disposable = vscode.workspace.onDidChangeConfiguration(event => {
		if (!event.affectsConfiguration('flutterplus')) {
			return;
		}

		$unregisterCommands(commands);

		commands = $registerCommands();

		context.subscriptions.push(
			...commands
		);
	});

	context.subscriptions.push(
		disposable,
		...commands,
	);
}

function $unregisterCommands(disposables: Array<Disposable>) {
	disposables.forEach((disposable) => disposable.dispose());
}

function $registerCommands(): Array<Disposable> {
	const customWraps = FlutterPlusConfig.getInstance().getCustomWraps();

	const customCommands = customWraps.map((wrap) => {
		return commands.registerCommand(wrap.id, () => wrapWith((widget) => wrap.body.join('\n').replace("${widget}", widget)),);
	});

	return [
		...customCommands,
		commands.registerCommand("flutter-plus.sealed-states", sealedStates),
		commands.registerCommand("flutter-plus.wrap-sizedbox", wrapWithSizedBox),
		commands.registerCommand("flutter-plus.wrap-listenablebuilder", wrapWithListenableBuilder),
		commands.registerCommand("flutter-plus.wrap-valuelistenablebuilder", wrapWithValueListenableBuilder),
		commands.registerCommand("flutter-plus.wrap-repaintboundary", wrapWithRepaintBoundary),
		languages.registerCodeActionsProvider(
			DART_MODE,
			new CodeActionWrap(customWraps),
		),];
}

export function deactivate() { }