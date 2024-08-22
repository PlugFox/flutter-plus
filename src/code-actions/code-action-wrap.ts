/* eslint-disable curly */

import { CodeAction, CodeActionKind, CodeActionProvider, window } from "vscode";
import { getSelectedText } from "../utils";

export class CodeActionWrap implements CodeActionProvider {
    public provideCodeActions(): CodeAction[] {
        const editor = window.activeTextEditor;
        if (!editor) return [];

        const selectedText = editor.document.getText(getSelectedText(editor));
        if (selectedText === "") return [];

        return [
            {
                command: "flutter-plus.wrap-sizedbox",
                title: "Wrap with SizedBox",
            },
            {
                command: "flutter-plus.wrap-listenablebuilder",
                title: "Wrap with ListenableBuilder",
            },
            {
                command: "flutter-plus.wrap-valuelistenablebuilder",
                title: "Wrap with ValueListenableBuilder<T>",
            },
            /* TODO: Convert between ListenableBuilder <--> ValueListenableBuilder */
            {
                command: "flutter-plus.wrap-repaintboundary",
                title: "Wrap with RepaintBoundary",
            }
        ].map((c) => {
            let action = new CodeAction(c.title, CodeActionKind.Refactor);
            action.command = {
                command: c.command,
                title: c.title,
            };
            return action;
        });
    }
}