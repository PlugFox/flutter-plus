# How to

## How to add widget wrappper

1. Add command to package.json

```json
{
  "contributes": {
    "commands": [
      {
        "command": "flutter-plus.wrap-listenablebuilder",
        "title": "Wrap with ListenableBuilder"
      }
    ]
  }
}
```

2. Add snippet to src/commands/wrap-with.command.ts

```ts
const snippetListenableBuilder = (widget: string) => {
  return `ListenableBuilder(
  listenable: \${1:listenable},
  builder: (context, _) =>
    ${widget},
)`;
};

export const wrapWithListenableBuilder = async () =>
  wrapWith(snippetListenableBuilder);
```

3. Add command to src/extension.ts

```ts
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(
      "flutter-plus.wrap-listenablebuilder",
      wrapWithListenableBuilder
    )
  );
}
```
