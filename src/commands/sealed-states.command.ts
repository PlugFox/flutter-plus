import * as path from 'path';
import * as vscode from 'vscode';
import { Uri } from "vscode";

export const sealedStates = async (uri: Uri) => {
  // Extract the file name in a cross-platform way
  const fileName = path.basename(uri.fsPath, '.dart');
  if (!fileName) {
    vscode.window.showErrorMessage('Invalid file name.');
    return;
  }

  // Convert the file name to CamelCase
  let camelCaseName = fileName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Ensure the name ends with "State"
  if (camelCaseName.endsWith('State') || camelCaseName.endsWith('States')) {
    camelCaseName = camelCaseName.replace(/States?$/, 'State');
  } else {
    camelCaseName += 'State';
  }

  // Prompt the user for the class name with a default value of CamelCase file name
  const classNameInput = await vscode.window.showInputBox({
    prompt: 'Enter the class name',
    value: camelCaseName,
  });

  if (!classNameInput) {
    vscode.window.showErrorMessage('Class name input was cancelled.');
    return;
  }

  // Convert the classNameInput to snake_case
  const snakeCaseName = classNameInput
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]/g, '_')
    .toLowerCase();

  // Prompt the user for the list of states, defaulting to common states
  const statesInput = await vscode.window.showInputBox({
    prompt: 'Enter the states (camelCase) separated by commas',
    value: 'idle, processing, successful, error',
  });

  if (!statesInput) {
    vscode.window.showErrorMessage('Input was cancelled.');
    return;
  }

  // Prepare a dictionary with different state formats
  const states = statesInput.split(',').map(state => state.replace(/\s/g, '').trim())
    .filter((state) => state.length !== 0)
    .map(state => state.charAt(0).toLowerCase() + state.slice(1));
  if (states.length === 0) {
    vscode.window.showErrorMessage('Invalid states input.');
    return;
  }
  const stateFormats = states.reduce((acc, state) => {
    const capitalizedState = state.charAt(0).toUpperCase() + state.slice(1);
    acc[state] = {
      original: state,
      capitalized: capitalizedState,
      snakeCase: state.toLowerCase().replace(/ /g, '_')
    };
    return acc;
  }, {} as Record<string, { original: string, capitalized: string, snakeCase: string }>);

  const options = [
    { label: "Nullable data", picked: true, id: 'nullableData' },
    { label: "Generate pattern matching", picked: true, id: 'patternMatching' },
    { label: "Generate toString method", picked: true, id: 'toStringMethod' },
    { label: "Generate Initial state", picked: true, id: 'initialState' },
    { label: "Generate property getters", picked: true, id: 'propertyGetters' },
    { label: "Generate type alias", picked: true, id: 'typeAlias' },
    { label: "Generate equality operator (==)", picked: false, id: 'equalityOperator' },
  ];

  const selectedOptions = await vscode.window.showQuickPick(options, {
    canPickMany: true,
    placeHolder: 'Select the options you want to generate',
  }) ?? [];

  let nullableDataOption = selectedOptions.find(option => option.id === 'nullableData') !== undefined;
  let patternMatchingOption = selectedOptions.find(option => option.id === 'patternMatching') !== undefined;
  let equalityOperatorOption = selectedOptions.find(option => option.id === 'equalityOperator') !== undefined;
  let toStringMethodOption = selectedOptions.find(option => option.id === 'toStringMethod') !== undefined;
  let propertyGettersOption = selectedOptions.find(option => option.id === 'propertyGetters') !== undefined;
  let typeAliasOption = selectedOptions.find(option => option.id === 'typeAlias') !== undefined;
  let initialStateOption = selectedOptions.find(option => option.id === 'initialState') !== undefined;

  const dataType = nullableDataOption ? '\${1}Entity?' : '\${1}Entity';

  // Generate the code using a StringBuilder approach
  let codeBuilder: string[] = [];

  // Import statements
  codeBuilder.push(`import 'package:meta/meta.dart';`);
  codeBuilder.push('');
  codeBuilder.push(`/// Entity placeholder`);
  codeBuilder.push(`typedef \${1:${classNameInput}}Entity = \${0:Object};`);
  codeBuilder.push('');
  codeBuilder.push(`/// {@template \${2:${snakeCaseName}}}`);
  codeBuilder.push(`/// \${1}.`);
  codeBuilder.push(`/// {@endtemplate}`);
  codeBuilder.push(`sealed class \${1} extends _\\$\${1}Base {`);

  // Generate the factory constructors for each state
  Object.values(stateFormats).forEach(({ capitalized, original }) => {
    codeBuilder.push(`  /// ${capitalized}`);
    codeBuilder.push(`  /// {@macro \${2}}`);
    codeBuilder.push(`  const factory \${1}.${original}({`);
    codeBuilder.push(`    required ${dataType} data,`);
    codeBuilder.push(`    String message,`);
    codeBuilder.push(`  }) = \${1}\\$${capitalized};`);
    codeBuilder.push('');
  });

  // Initial state
  if (initialStateOption && Object.values(stateFormats).every(({ original }) => original !== 'initial')) {
    codeBuilder.push(`  /// Initial`);
    codeBuilder.push(`  /// {@macro \${2}}`);
    codeBuilder.push(`  factory \${1}.initial({`);
    codeBuilder.push(`    ${dataType} data,`);
    codeBuilder.push(`    String? message,`);
    codeBuilder.push(`  }) =>`);
    codeBuilder.push(`      \${1}\\$${Object.values(stateFormats)[0].capitalized}(`);
    codeBuilder.push(`        data: data,`);
    codeBuilder.push(`        message: message ?? 'Initial',`);
    codeBuilder.push(`      );`);
    codeBuilder.push('');
  }

  // Constructor
  codeBuilder.push(`  /// {@macro \${2}}`);
  codeBuilder.push(`  const \${1}({required super.data, required super.message});`);
  codeBuilder.push(`}`);
  codeBuilder.push('');

  // Generate the classes for each state
  Object.values(stateFormats).forEach(({ capitalized, snakeCase }) => {
    codeBuilder.push(`/// ${capitalized}`);
    codeBuilder.push(`final class \${1}\\$${capitalized} extends \${1} {`);
    codeBuilder.push(`  const \${1}\\$${capitalized}({required super.data, super.message = '${capitalized}'});`);

    if (typeAliasOption) {
      codeBuilder.push(`  @override`);
      codeBuilder.push(`  String get type => '${snakeCase}';`);
    }

    codeBuilder.push(`}`);
    codeBuilder.push('');
  });

  // Base class definition with pattern matching methods
  if (patternMatchingOption) {
    codeBuilder.push(`/// Pattern matching for [\${1}].`);
    codeBuilder.push(`typedef \${1}Match<R, S extends \${1}> = R Function(S element);`);
    codeBuilder.push('');
  }

  // Base class definition
  codeBuilder.push('@immutable');
  codeBuilder.push(`abstract base class _\\$\${1}Base {`);
  codeBuilder.push(`  const _\\$\${1}Base({required this.data, required this.message});`);
  codeBuilder.push('');

  // Type alias
  if (typeAliasOption) {
    codeBuilder.push(`  /// Type alias for [\${1}].`);
    codeBuilder.push(`  abstract final String type;`);
    codeBuilder.push('');
  }

  // Data entity payload
  codeBuilder.push(`  /// Data entity payload.`);
  codeBuilder.push(`  @nonVirtual`);
  codeBuilder.push(`  final ${dataType} data;`);
  codeBuilder.push('');

  // Message or description
  codeBuilder.push(`  /// Message or description.`);
  codeBuilder.push(`  @nonVirtual`);
  codeBuilder.push(`  final String message;`);
  codeBuilder.push('');

  // Check existence of data
  if (nullableDataOption) {
    codeBuilder.push(`  /// Has data?`);
    codeBuilder.push(`  bool get hasData => data != null;`);
    codeBuilder.push('');
  }

  // Property getters
  if (propertyGettersOption) {
    Object.values(stateFormats).forEach(({ capitalized, snakeCase }) => {
      codeBuilder.push(`  /// Check if is ${capitalized}.`);
      codeBuilder.push(`  bool get is${capitalized} => this is \${1}\\$${capitalized};`);
      codeBuilder.push('');
    });
  }

  // Pattern matching methods
  if (patternMatchingOption) {
    codeBuilder.push('');
    codeBuilder.push(`  /// Pattern matching for [\${1}].`);
    codeBuilder.push(`  R map<R>({`);
    Object.values(stateFormats).forEach(({ original, capitalized }) => {
      codeBuilder.push(`    required \${1}Match<R, \${1}\\$${capitalized}> ${original},`);
    });
    codeBuilder.push(`  }) =>`);
    codeBuilder.push(`      switch (this) {`);
    Object.values(stateFormats).forEach(({ capitalized, original }) => {
      codeBuilder.push(`        \${1}\\$${capitalized} s => ${original}(s),`);
    });
    codeBuilder.push(`        _ => throw AssertionError(),`);
    codeBuilder.push(`      };`);
    codeBuilder.push('');
    codeBuilder.push(`  /// Pattern matching for [\${1}].`);
    codeBuilder.push(`  R maybeMap<R>({`);
    Object.values(stateFormats).forEach(({ original, capitalized }) => {
      codeBuilder.push(`    \${1}Match<R, \${1}\\$${capitalized}>? ${original},`);
    });
    codeBuilder.push(`    required R Function() orElse,`);
    codeBuilder.push(`  }) =>`);
    codeBuilder.push(`      map<R>(`);
    Object.values(stateFormats).forEach(({ original }) => {
      codeBuilder.push(`        ${original}: ${original} ?? (_) => orElse(),`);
    });
    codeBuilder.push(`      );`);
    codeBuilder.push('');
    codeBuilder.push(`  /// Pattern matching for [\${1}].`);
    codeBuilder.push(`  R? mapOrNull<R>({`);
    Object.values(stateFormats).forEach(({ original, capitalized }) => {
      codeBuilder.push(`    \${1}Match<R, \${1}\\$${capitalized}>? ${original},`);
    });
    codeBuilder.push(`  }) =>`);
    codeBuilder.push(`      map<R?>(`);
    Object.values(stateFormats).forEach(({ original }) => {
      codeBuilder.push(`        ${original}: ${original} ?? (_) => null,`);
    });
    codeBuilder.push(`      );`);
  }

  // Equality operator
  if (equalityOperatorOption) {
    codeBuilder.push('');
    codeBuilder.push('  @override');
    codeBuilder.push(`  int get hashCode => data.hashCode;`);
    codeBuilder.push('');
    codeBuilder.push('  @override');
    codeBuilder.push(`  bool operator ==(Object other) => identical(this, other);`);
  }

  // Generate toString method
  if (toStringMethodOption) {
    codeBuilder.push('');
    codeBuilder.push('  @override');
    if (typeAliasOption) {
      codeBuilder.push(`  String toString() => '\${1}.\\$type{message: \\$message}';`);
    } else {
      codeBuilder.push(`  String toString() => '\${1}{message: \\$message}';`);
    }
  }
  codeBuilder.push('}');
  codeBuilder.push('');

  // Insert the generated code into the current document
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    editor.insertSnippet(new vscode.SnippetString(codeBuilder.join('\n')));
    /* editor.edit(editBuilder => {
      editBuilder.insert(new vscode.Position(editor.document.lineCount, 0), codeBuilder.join('\n'));
    }); */
  } else {
    vscode.window.showErrorMessage('No active editor found.');
  }
};

