# Flutter Plus

Extension add some useful commands to Flutter development in Visual Studio Code.

## Markdown snippets

| Shortcut            | Description                                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| unreleased          | Create a new unreleased section. Used to list features that are not yet released.                                                                                                       |
| version             | Create a new version section. Used to list features that are released in a specific version.                                                                                            |


## Dart snippets

| Shortcut            | Description                                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| main                | Create a new main function. The entry point of a Dart app.                                                                                                                              |
| try                 | Create a new try-catch block. Used to handle exceptions.                                                                                                                                |
| timeout             | Create a new timeout block. Used to handle timeouts.                                                                                                                                    |
| stopwatch           | Create a new Stopwatch. Used to measure elapsed time.                                                                                                                                   |
| conditional_imports | Create a new conditional import. Used to import a library based on a current environment (VM or JS)                                                                                     |
| dvd                 | Divider comment line. Used to separate sections of code.                                                                                                                                |
| reverseList         | Create a new reverse list function. Reverse list traversal in a loop.                                                                                                                   |
| part                | Create a new part directive. Used to specify a URI where part of the library is located.                                                                                                |
| mocks               | Import mocks file. Used to import a file with mocks.                                                                                                                                    |
| equals              | Hash code and equals methods. Used to override the `==` operator and the `hashCode` getter.                                                                                             |
| nosm                | Create a new noSuchMethod method. Used to implement the `noSuchMethod` method.                                                                                                          |
| test                | Create a new test function. Used to define a test case.                                                                                                                                 |
| pragma              | Create a new pragma directive. Used to specify options that affect the behavior of the Dart compiler.                                                                                   |
| doc-disabled        | Create a new disabled documentation comment. Used to disable a block of documentation comments.                                                                                         |
| doc-category        | Create a new category documentation comment. Used to categorize a block of documentation comments.                                                                                      |
| doc-image           | Create a new image documentation comment. Used to add an image to a block of documentation comments.                                                                                    |
| doc-animation       | Create a new animation documentation comment. Used to add an animation to a block of documentation comments.                                                                            |
| doc-html            | Create a new HTML documentation comment. Used to add HTML to a block of documentation comments.                                                                                         |
| newtmpl             | Creates a new dartdoc template with current file's name as its prefix.                                                                                                                  |
| usetmpl             | Uses existing dartdoc macro with current file's name as its prefix.                                                                                                                     |
| deprecated          | Create a new deprecated annotation. Used to mark a class, method, or property as deprecated.                                                                                            |
| meta                | Create a new meta annotation. Used to annotate a class, method, or property with metadata.                                                                                              |
| coverage            | Create a comment line for coverage. Used to mark a line or block of code that is not covered by tests.                                                                                  |


## Flutter snippets

| Shortcut            | Description                                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mateapp             | Create a new MaterialApp widget. An application that uses Material Design.                                                                                                              |
| cupeapp             | Create a new CupertinoApp widget. An application that uses Cupertino design.                                                                                                            |
| scaffold            | Create a new Scaffold widget. Implements the basic Material Design visual layout structure.                                                                                             |
| stl                 | Create a new StatelessWidget. A widget that does not require mutable state.                                                                                                             |
| stlChild            | Create a new StatelessWidget with a child.  A widget that does not require mutable state.                                                                                               |
| stf                 | Create a new StatefulWidget. A widget that has mutable state.                                                                                                                           |
| stfChild            | Create a new StatefulWidget with a child. A widget that has mutable state.                                                                                                              |
| inh                 | Create a new InheritedWidget. Base class for widgets that efficiently propagate information down the tree.                                                                              |
| of                  | Create a new static `of` method for an InheritedWidget. Returns the nearest widget of the given type T and creates a dependency on it, or null if no appropriate widget is found.       |
| stateOf             | Create a new static `stateOf` method for an State object. Returns the State object of the nearest ancestor StatefulWidget widget that is an instance of the given type T.               |
| widgetOf            | Create a new static `widgetOf` method for an Widget object. Returns the nearest ancestor widget of the given type T, which must be the type of a concrete Widget subclass.              |
| painter             | Create a new CustomPainter. A widget that provides a canvas on which to draw during the paint phase. Used for drawing custom shapes.                                                    |
| clipper             | Create a new CustomClipper. Used for creating custom shapes.                                                                                                                            |
| debugFillProperties | Create a new debugFillProperties method. Add additional properties associated with the node.                                                                                            |
| initS               | Create a new initState method. Called when this object is inserted into the tree. The framework will call this method exactly once for each State object it creates.                    |
| dispose             | Create a new dispose method. Called when this object is removed from the tree permanently. The framework calls this method when this State object will never build again.               |
| reassemble          | Create a new reassemble method. Called whenever the application is reassembled during debugging, for example during hot reload.                                                         |
| didChangeD          | Create a new didChangeDependencies method. Called when a dependency of this element changes.                                                                                            |
| didUpdateW          | Create a new didUpdateWidget method. Called whenever the widget configuration changes.                                                                                                  |
| build               | Create a new build method. Describes the part of the user interface represented by this widget.                                                                                         |
| listViewBuilder     | Create a new ListView.builder. A scrollable list that works with a list of children.                                                                                                    |
| listViewSeparated   | Create a new ListView.separated. A scrollable list that works with a list of children separated by a divider.                                                                           |
| gridViewBuilder     | Create a new GridView.builder. A scrollable, 2D array of widgets.                                                                                                                       |
| gridViewCount       | Create a new GridView.count. A scrollable, 2D array of widgets with a fixed number of tiles in the cross axis.                                                                          |
| gridViewE           | Create a new GridView.extent. A scrollable, 2D array of widgets with a maximum number of tiles in the cross axis.                                                                       |
| customScrollV       | Create a new CustomScrollView. A ScrollView that creates custom scroll effects using slivers.                                                                                           |
| builder             | Create a new Builder. A widget that delegates its building to a callback.                                                                                                               |
| wrapWithBuilder     | Wrap the selected widget with a Builder. A widget that delegates its building to a callback.                                                                                            |
| stfBuilder          | Create a new StatefulWidget with a Builder. A widget that has mutable state and delegates its building to a callback.                                                                   |
| strBuilder          | Create a new StreamBuilder. A widget that builds itself based on the latest snapshot of interaction with a Stream.                                                                      |
| lisBuilder          | Create a new ListenableBuilder. A widget that builds itself based on the latest value of a Listenable it listens to.                                                                    |
| valLisBuilder       | Create a new ValueListenableBuilder. A widget that builds itself based on the latest value of a ValueListenable it listens to.                                                          |
| animBuilder         | Create a new AnimatedBuilder. A general-purpose widget for building animations.                                                                                                         |
| switcher            | Create a new AnimatedSwitcher. A widget that switches between two children and animates the transition.                                                                                 |
| orientBuilder       | Create a new OrientationBuilder. A widget that builds itself based on the latest orientation of the device.                                                                             |
| layBuilder          | Create a new LayoutBuilder. A widget that builds itself based on the latest layout constraints.                                                                                         |
| repBound            | Create a new RepaintBoundary. A widget that isolates repaints, so that a repaint of one child is separate from other children.                                                          |
| singleChildSV       | Create a new SingleChildScrollView. A box in which a single widget can be scrolled.                                                                                                     |
| futBuilder          | Create a new FutureBuilder. A widget that builds itself based on the latest snapshot of interaction with a Future.                                                                      |
| tweenAnimBuilder    | Create a new TweenAnimationBuilder. An animation that interpolates between two animatable objects.                                                                                      |
| testWidget          | Create a new testWidgets function for testing a widget.                                                                                                                                 |