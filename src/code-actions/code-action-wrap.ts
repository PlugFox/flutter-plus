/* eslint-disable curly */

import { CodeAction, CodeActionKind, CodeActionProvider, window, workspace } from "vscode";
import { getSelectedText } from "../utils";
import { CustomWrapConfig } from "../config/config";


export class CodeActionWrap implements CodeActionProvider {
    // create constructor that takes Array<CustomWrapConfig> 
    // as a parameter and assign it to a private field
    private customWraps: Array<CustomWrapConfig>;

    constructor(customWraps: Array<CustomWrapConfig>) {
        this.customWraps = customWraps;
    }

    public provideCodeActions(): CodeAction[] {
        const editor = window.activeTextEditor;
        if (!editor) return [];

        const selectedText = editor.document.getText(getSelectedText(editor));
        if (selectedText === "") return [];

        const customCommands = this.customWraps.map((wrap) => {
            return {
                command: wrap.id,
                title: wrap.name,
            };
        });

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
            },
            ...customCommands,
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