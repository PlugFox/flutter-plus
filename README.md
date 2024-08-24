# Flutter Plus

Extension add some useful commands to Flutter development in Visual Studio Code.

## Wrap with...

This package extends your Flutter development experience by providing convenient snippets and commands for wrapping widgets with other commonly used Flutter widgets, similar to the "Wrap with..." functionality in Flutter's built-in extension for VS Code. These additions streamline the process of encapsulating your widgets within other widgets that enhance functionality or control, such as state management, repaint isolation, and more.

Simply select the widget you want to wrap, and choose the appropriate "Wrap with..." command from the command palette, or use the provided snippets to quickly insert the desired wrapper code into your widget tree.

This extension includes the following standard "Wrap with..." commands:

- **Wrap with ListenableBuilder**: Easily wrap any widget with a `ListenableBuilder` to rebuild the widget based on changes in a `Listenable` object.
- **Wrap with ValueListenableBuilder<T>**: Automatically wrap your widget with a `ValueListenableBuilder` to react to changes in a `ValueListenable<T>`.
- **Wrap with RepaintBoundary**: Encapsulate your widget within a `RepaintBoundary` to isolate its repaint process, improving performance in complex UIs.
- **Wrap with SliverPadding**: Wrap your widget with a `SliverPadding` to add padding around a sliver widget in a `CustomScrollView`.

In order to add custom "Wrap with" commands, you can change the configuration in `flutter-plus.wraps` settings. The configuration is an array of objects with the following properties:

- **name**: The name of the command that will appear in the command palette.
- **body**: The snippet body that will be inserted into the editor when the command is executed. Use `${0...N}` to indicate the position of the selected text. In order to insert the selected text, use `${widget}`.
  
Example configuration:

```json
{
  "wraps": [
    {
      "name": "Wrap with CustomWidget",
      "body": [
        "CustomWidget(",
        "  child: ${widget},",
        ")"
      ]
    }
  ]
}
```

## Markdown snippets

| Shortcut            | Description                                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| unreleased          | Create a new unreleased section. Used to list features that are not yet released.                                                                                                       |
| version             | Create a new version section. Used to list features that are released in a specific version.                                                                                            |


## Dart snippets

| Shortcut            | Description                                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| main                | Generates a main function with error handling and zone management for Dart applications.                                                                                                |
| try                 | Creates a try-catch-finally block, useful for managing exceptions and ensuring cleanup code runs.                                                                                       |
| timeout             | Creates a timeout handler for setting execution limits on asynchronous operations.                                                                                                      |
| stopwatch           | Initializes a Stopwatch to measure and log elapsed time for code execution.                                                                                                             |
| conditional         | Generates platform-specific imports based on the environment (VM or JS), ensuring compatibility across different platforms.                                                             |
| dvd                 | Inserts a divider comment line, useful for visually separating sections of code.                                                                                                        |
| reverseList         | Generates a loop for traversing a list in reverse order.                                                                                                                                |
| part                | Adds a part directive to include the specified Dart file as part of the current library.                                                                                                |
| mocks               | Imports a Dart file containing mock implementations for testing purposes.                                                                                                               |
| toStr               | Overrides the `toString` method for a custom object, providing a string representation of the object for debugging or logging.                                                          |
| equals              | Generates hash code and equals methods, overriding the `==` operator and the `hashCode` getter for custom object comparison.                                                            |
| nosm                | Implements the `noSuchMethod` method, handling calls to non-existent methods or properties.                                                                                             |
| test                | Creates a test function, setting up a basic test case using the `test` package.                                                                                                         |
| pragma              | Inserts a pragma directive to optimize or modify Dart VM/compiler behavior based on the specified options.                                                                              |
| doc-disabled        | Adds a comment annotation to disable documentation generation for the specified block of code.                                                                                          |
| doc-category        | Categorizes a block of documentation with the specified category or subcategory tags.                                                                                                   |
| doc-image           | Embeds an image within a block of documentation, using the specified URL as the source.                                                                                                 |
| doc-animation       | Embeds an animation within a block of documentation, with options for specifying the size and source URL.                                                                               |
| doc-html            | Injects custom HTML into a documentation comment, allowing for rich formatting or content inclusion.                                                                                    |
| newtmpl             | Creates a new Dart documentation template with the current file's name as the prefix, useful for reusing content across multiple documentation blocks.                                  |
| usetmpl             | Inserts an existing Dart documentation macro, using the current file's name as the prefix, to maintain consistency in documentation.                                                    |
| deprecated          | Marks a class, method, or property as deprecated, indicating that it should no longer be used and may be removed in future versions.                                                    |
| meta                | Applies a meta annotation to a class, method, or property, providing additional metadata for tooling or code analysis purposes.                                                         |
| coverage            | Adds a coverage annotation to mark lines or blocks of code that should be ignored by test coverage tools.                                                                               |


## Flutter snippets

| Shortcut            | Description                                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mateapp             | Creates a new `MaterialApp` widget, an application that uses Material Design components and theming.                                                                                    |
| cupeapp             | Creates a new `CupertinoApp` widget, an application that uses Cupertino (iOS-style) design components and theming.                                                                      |
| scaffold            | Creates a new `Scaffold` widget, implementing the basic Material Design visual layout structure including app bar, drawer, and floating action button.                                  |
| stl                 | Generates a new `StatelessWidget` class, a widget that does not require mutable state and is rebuilt only when the configuration changes.                                               |
| stlChild            | Generates a new `StatelessWidget` class with a child widget, for cases where a single child widget needs to be passed and rendered.                                                     |
| stf                 | Generates a new `StatefulWidget` class, a widget that has mutable state that can change over time, and its associated `State` class.                                                    |
| stfChild            | Generates a new `StatefulWidget` class with a child widget, allowing for a stateful widget to have a single child widget passed in and managed.                                         |
| inh                 | Creates a new `InheritedWidget` class, which efficiently propagates information down the widget tree to descendants.                                                                    |
| of                  | Generates a static `of` method for an `InheritedWidget`, returning the nearest widget of the specified type and creating a dependency on it.                                            |
| stateOf             | Generates a static `stateOf` method for a `State` object, returning the `State` object of the nearest ancestor `StatefulWidget` of the specified type.                                  |
| widgetOf            | Generates a static `widgetOf` method for a `Widget` object, returning the nearest ancestor widget of the specified type.                                                                |
| painter             | Creates a new `CustomPainter` class, which provides a canvas on which to draw during the paint phase, used for drawing custom shapes and graphics.                                      |
| clipper             | Creates a new `CustomClipper` class, used for defining custom clipping shapes for widgets.                                                                                              |
| debugFillProperties | Generates a `debugFillProperties` method to add additional properties associated with the widget for debugging purposes.                                                                |
| initS               | Creates an `initState` method, called when this object is inserted into the widget tree for the first time, typically used to initialize state.                                         |
| dispose             | Creates a `dispose` method, called when this object is permanently removed from the widget tree, used for cleanup of resources.                                                         |
| reassemble          | Creates a `reassemble` method, called during debugging whenever the application is reassembled, for example, during a hot reload.                                                       |
| didChangeD          | Creates a `didChangeDependencies` method, called when a dependency of the `State` object changes.                                                                                       |
| didUpdateW          | Creates a `didUpdateWidget` method, called whenever the widget’s configuration changes.                                                                                                 |
| build               | Generates a `build` method, describing the part of the user interface represented by this widget.                                                                                       |
| listViewBuilder     | Creates a `ListView.builder`, a scrollable list that lazily builds its children as they scroll into view, useful for large or infinite lists.                                           |
| listViewSeparated   | Creates a `ListView.separated`, a scrollable list that displays a separator widget between each child widget, ideal for lists with visually distinct sections.                          |
| gridViewBuilder     | Creates a `GridView.builder`, a scrollable grid of widgets that are created on demand.                                                                                                  |
| gridViewCount       | Creates a `GridView.count`, a scrollable grid of widgets with a fixed number of tiles in the cross axis.                                                                                |
| gridViewE           | Creates a `GridView.extent`, a scrollable grid of widgets with tiles that each have a maximum cross-axis extent.                                                                        |
| customScrollV       | Creates a `CustomScrollView`, a scrollable area that creates custom scroll effects using slivers.                                                                                       |
| builder             | Creates a `Builder` widget, which allows you to create a child widget in a way that depends on the `BuildContext`.                                                                      |
| wrapWithBuilder     | Wraps the selected widget with a `Builder` widget, delegating the widget building process to a callback.                                                                                |
| stfBuilder          | Creates a `StatefulBuilder` widget, which allows for state management and rebuilding a specific portion of the widget tree.                                                             |
| strBuilder          | Creates a `StreamBuilder` widget, which rebuilds itself based on the latest snapshot of interaction with a `Stream`.                                                                    |
| lisBuilder          | Creates a `ListenableBuilder` widget, which rebuilds itself based on the latest value of a `Listenable` it listens to.                                                                  |
| valLisBuilder       | Creates a `ValueListenableBuilder` widget, which rebuilds itself based on the latest value of a `ValueListenable`.                                                                      |
| animBuilder         | Creates an `AnimatedBuilder` widget, which rebuilds itself based on an animation.                                                                                                       |
| switcher            | Creates an `AnimatedSwitcher` widget, which switches between two children and animates the transition between them.                                                                     |
| orientBuilder       | Creates an `OrientationBuilder` widget, which rebuilds itself based on the latest orientation of the device (portrait or landscape).                                                    |
| layBuilder          | Creates a `LayoutBuilder` widget, which rebuilds itself based on the latest layout constraints, useful for responsive layouts.                                                          |
| repBound            | Creates a `RepaintBoundary` widget, which isolates repaints so that a repaint of one child is separate from others, improving performance.                                              |
| singleChildSV       | Creates a `SingleChildScrollView` widget, which allows a single child to be scrolled.                                                                                                   |
| futBuilder          | Creates a `FutureBuilder` widget, which rebuilds itself based on the latest snapshot of interaction with a `Future`.                                                                    |
| tweenAnimBuilder    | Creates a `TweenAnimationBuilder` widget, which animates a property of a widget to a target value whenever the target value changes.                                                    |
| testWidget          | Creates a `testWidgets` function for testing a widget, typically used in Flutter's unit testing framework.                                                                              |
| row                 | Creates a `Row` widget, which displays its children in a horizontal array.                                                                                                              |
| col                 | Creates a `Column` widget, which displays its children in a vertical array.                                                                                                             |
| wrap                | Creates a `Wrap` widget, which displays its children in multiple horizontal or vertical runs, wrapping to the next line when necessary.                                                 |
| stack               | Creates a `Stack` widget, which allows you to place widgets on top of each other in a z-order.                                                                                          |
| fittedbox           | Creates a `FittedBox` widget, which scales and positions its child within itself according to the specified fit.                                                                        |
