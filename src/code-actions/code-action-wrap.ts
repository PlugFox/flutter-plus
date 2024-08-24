/* eslint-disable curly */

import { CodeAction, CodeActionKind, CodeActionProvider, window } from "vscode";
import { getSelectedText } from "../utils";
import { CodeWrap } from "../extension";

export class CodeActionWrap implements CodeActionProvider {
    private wraps: Array<CodeWrap>;

    constructor(customWraps: Array<CodeWrap>) {
        this.wraps = customWraps;
    }

    public provideCodeActions(): CodeAction[] {
        const editor = window.activeTextEditor;
        if (!editor) return [];

        const selectedText = editor.document.getText(getSelectedText(editor));
        if (selectedText === "") return [];

        return this.wraps.map((c) => {
            let action = new CodeAction(c.title, CodeActionKind.Refactor);
            action.command = {
                command: c.commandId,
                title: c.title,
            };
            return action;
        });
    }
}