import * as vscode from 'vscode';

import {
    commands,
    ExtensionContext,
    languages,
    InputBoxOptions,
    OpenDialogOptions,
    Uri,
    window,
    workspace,
  } from "vscode";

export const sealedStates = async (uri: Uri) => {
  vscode.window.showInformationMessage('Hello World from Flutter Plus!');
  return;
};