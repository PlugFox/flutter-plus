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
    value: 'idle, processing, success, failure',
  });

  if (!statesInput) {
    vscode.window.showErrorMessage('Input was cancelled.');
    return;
  }

  // Prepare a dictionary with different state formats by "," and ";".
  const states = Array.from(new Set(statesInput.split(/,|;/)
    .map(state => state.replace(/\s/g, '').trim())
    .filter(state => state.length !== 0)
    .filter(state => /^[a-zA-Z]/.test(state))
    .filter(state => /^[A-Za-z0-9\s]+$/.test(state))
    .map(state => state.charAt(0).toLowerCase() + state.slice(1))
  ));

  if (states.length === 0) {
    vscode.window.showErrorMessage('Invalid states input.');
    return;
  }

  const stateFormats = states.reduce((acc, state) => {
    const words = state.split(/(?=[A-Z])|_|-|\s/).filter(word => word.length > 0);

    const pascalCase = words.map((word) => {
      if (word.length === 1) {
        return word.toUpperCase();
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    }).join('');

    const camelCase = words.map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      } else if (word.length === 1) {
        return word.toUpperCase();
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    }).join('');

    const snakeCase = words.map(word => word.toLowerCase()).join('_');

    acc[state] = {
      original: state,
      pascalCase: pascalCase,
      camelCase: camelCase,
      snakeCase: snakeCase
    };

    return acc;
  }, {} as Record<string, { original: string, pascalCase: string, camelCase: string, snakeCase: string }>);

  const options = [
    { label: "Nullable data", picked: true, id: 'nullableData' },
    { label: "Generate pattern matching", picked: true, id: 'patternMatching' },
    { label: "Generate toString method", picked: true, id: 'toStringMethod' },
    { label: "Generate Initial state", picked: true, id: 'initialState' },
    { label: "Generate property getters", picked: true, id: 'propertyGetters' },
    { label: "Generate type alias", picked: true, id: 'typeAlias' },
    { label: "Generate equality operator (==)", picked: true, id: 'equalityOperator' },
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

  // Constructor
  codeBuilder.push(`  /// {@macro \${2}}`);
  codeBuilder.push(`  const \${1}({required super.data, required super.message});`);

  // Generate the factory constructors for each state
  Object.values(stateFormats).forEach(({ pascalCase, camelCase }) => {
    codeBuilder.push('');
    codeBuilder.push(`  /// ${pascalCase}`);
    codeBuilder.push(`  /// {@macro \${2}}`);
    codeBuilder.push(`  const factory \${1}.${camelCase}({`);
    if (nullableDataOption) {
      codeBuilder.push(`    ${dataType} data,`);
    } else {
      codeBuilder.push(`    required ${dataType} data,`);
    }
    codeBuilder.push(`    String message,`);
    codeBuilder.push(`  }) = \${1}\\$${pascalCase};`);
  });

  // Initial state
  if (initialStateOption && Object.values(stateFormats).every(({ camelCase }) => camelCase !== 'initial')) {
    codeBuilder.push('');
    codeBuilder.push(`  /// Initial`);
    codeBuilder.push(`  /// {@macro \${2}}`);
    codeBuilder.push(`  factory \${1}.initial({`);
    if (nullableDataOption) {
      codeBuilder.push(`    ${dataType} data,`);
    } else {
      codeBuilder.push(`    required ${dataType} data,`);
    }
    codeBuilder.push(`    String? message,`);
    codeBuilder.push(`  }) =>`);
    if (Object.values(stateFormats).find(({ camelCase }) => camelCase === 'idle')) {
      codeBuilder.push(`      \${1}\\$Idle(`);
    } else {
      codeBuilder.push(`      \${1}\\$${Object.values(stateFormats)[0].pascalCase}(`);
    }
    codeBuilder.push(`        data: data,`);
    codeBuilder.push(`        message: message ?? 'Initial',`);
    codeBuilder.push(`      );`);
  }

  codeBuilder.push(`}`);

  // Generate the classes for each state
  Object.values(stateFormats).forEach(({ pascalCase, snakeCase }) => {
    codeBuilder.push('');
    codeBuilder.push(`/// ${pascalCase}`);
    codeBuilder.push(`final class \${1}\\$${pascalCase} extends \${1} {`);

    if (nullableDataOption) {
      codeBuilder.push(`  const \${1}\\$${pascalCase}({super.data, super.message = '${pascalCase}'});`);
    } else {
      codeBuilder.push(`  const \${1}\\$${pascalCase}({required super.data, super.message = '${pascalCase}'});`);
    }

    if (typeAliasOption) {
      codeBuilder.push('');
      codeBuilder.push(`  @override`);
      codeBuilder.push(`  String get type => '${snakeCase}';`);
    }

    codeBuilder.push(`}`);
  });

  // Base class definition with pattern matching methods
  if (patternMatchingOption) {
    codeBuilder.push('');
    codeBuilder.push(`/// Pattern matching for [\${1}].`);
    codeBuilder.push(`typedef \${1}Match<R, S extends \${1}> = R Function(S element);`);
  }

  // Base class definition
  codeBuilder.push('');
  codeBuilder.push('@immutable');
  codeBuilder.push(`abstract base class _\\$\${1}Base {`);
  codeBuilder.push(`  const _\\$\${1}Base({required this.data, required this.message});`);

  // Type alias
  if (typeAliasOption) {
    codeBuilder.push('');
    codeBuilder.push(`  /// Type alias for [\${1}].`);
    codeBuilder.push(`  abstract final String type;`);
  }

  // Data entity payload
  codeBuilder.push('');
  codeBuilder.push(`  /// Data entity payload.`);
  codeBuilder.push(`  @nonVirtual`);
  codeBuilder.push(`  final ${dataType} data;`);

  // Message or description
  codeBuilder.push('');
  codeBuilder.push(`  /// Message or description.`);
  codeBuilder.push(`  @nonVirtual`);
  codeBuilder.push(`  final String message;`);

  // Check existence of data
  if (nullableDataOption) {
    codeBuilder.push('');
    codeBuilder.push(`  /// Has data?`);
    codeBuilder.push(`  bool get hasData => data != null;`);
  }

  // Property getters
  if (propertyGettersOption) {
    Object.values(stateFormats).forEach(({ pascalCase, snakeCase }) => {
      codeBuilder.push('');
      codeBuilder.push(`  /// Check if is ${pascalCase}.`);
      codeBuilder.push(`  bool get is${pascalCase} => this is \${1}\\$${pascalCase};`);
    });
  }

  // Pattern matching methods
  if (patternMatchingOption) {
    codeBuilder.push('');
    codeBuilder.push(`  /// Pattern matching for [\${1}].`);
    codeBuilder.push(`  R map<R>({`);
    Object.values(stateFormats).forEach(({ pascalCase, camelCase }) => {
      codeBuilder.push(`    required \${1}Match<R, \${1}\\$${pascalCase}> ${camelCase},`);
    });
    codeBuilder.push(`  }) =>`);
    codeBuilder.push(`      switch (this) {`);
    Object.values(stateFormats).forEach(({ pascalCase, camelCase }) => {
      codeBuilder.push(`        \${1}\\$${pascalCase} s => ${camelCase}(s),`);
    });
    codeBuilder.push(`        _ => throw AssertionError(),`);
    codeBuilder.push(`      };`);
    codeBuilder.push('');
    codeBuilder.push(`  /// Pattern matching for [\${1}].`);
    codeBuilder.push(`  R maybeMap<R>({`);
    codeBuilder.push(`    required R Function() orElse,`);
    Object.values(stateFormats).forEach(({ pascalCase, camelCase }) => {
      codeBuilder.push(`    \${1}Match<R, \${1}\\$${pascalCase}>? ${camelCase},`);
    });
    codeBuilder.push(`  }) =>`);
    codeBuilder.push(`      map<R>(`);
    Object.values(stateFormats).forEach(({ camelCase }) => {
      codeBuilder.push(`        ${camelCase}: ${camelCase} ?? (_) => orElse(),`);
    });
    codeBuilder.push(`      );`);
    codeBuilder.push('');
    codeBuilder.push(`  /// Pattern matching for [\${1}].`);
    codeBuilder.push(`  R? mapOrNull<R>({`);
    Object.values(stateFormats).forEach(({ pascalCase, camelCase }) => {
      codeBuilder.push(`    \${1}Match<R, \${1}\\$${pascalCase}>? ${camelCase},`);
    });
    codeBuilder.push(`  }) =>`);
    codeBuilder.push(`      map<R?>(`);
    Object.values(stateFormats).forEach(({ camelCase }) => {
      codeBuilder.push(`        ${camelCase}: ${camelCase} ?? (_) => null,`);
    });
    codeBuilder.push(`      );`);
  }

  // Equality operator
  if (equalityOperatorOption) {
    codeBuilder.push('');
    if (typeAliasOption) {
      codeBuilder.push('  @override');
      codeBuilder.push(`  int get hashCode => Object.hash(type, data);`);
      codeBuilder.push('');
      codeBuilder.push('  @override');
      codeBuilder.push(`  bool operator ==(Object other) => identical(this, other)`);
      codeBuilder.push(`   || (other is _\\$\${1}Base && type == other.type && identical(data, other.data));`);
    } else {
      codeBuilder.push('  @override');
      codeBuilder.push(`  int get hashCode => data.hashCode;`);
      codeBuilder.push('');
      codeBuilder.push('  @override');
      codeBuilder.push(`  bool operator ==(Object other) => identical(this, other)`);
      codeBuilder.push(`   || (other is _\\$\${1}Base && runtimeType == other.runtimeType && identical(data, other.data));`);
    }
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

