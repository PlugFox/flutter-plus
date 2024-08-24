import * as vscode from 'vscode';

// Execute a command in the terminal
export function executeCommand(command: string) {
    const terminal = vscode.window.createTerminal('Flutter Plus');
    terminal.sendText(command);
    terminal.show();
}