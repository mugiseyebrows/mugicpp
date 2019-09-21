# mugicpp
Code generation tool for C++

## Instalation

```bash
npm i mugicpp --save
```

## Usage

### Import

```js
const {acc, met, qt, cpp, sc, st, CppClass, parseClass, parseMethod} = require('mugicpp')
```

### Class

```js
let foo = new CppClass('Foo')
foo.constructor_()
foo.constructor_({foo: cpp.int, bar: qt.QString},{bar:'"test"'})
foo.destructor('').virtual()
```

This creates class with empty constructor and parametrized constructor `Foo(int foo, const QString& bar = "test")` and virtual destructor with empty implementation.

### Members

```js
foo.member('mBar', cpp.int, 0)
foo.member('mFoo', qt.QString, undefined, {getter: true, setter: false, access: acc.PRIVATE})
```

This creates `int` member `mBar` with default value 0, to which it will be initialized in empty constructor, but in parametrized constructor it will be initialized to `bar` argument value because members bound to constructor args by name. `mBar` is protected, `mFoo` is private

### Getters and setters

Public getter and setter added for each member unless there is `{getter: false, setter: false}` in `CppClass` options or in `member` options. `mBar` will have getter function `int bar() const` and setter `void setBar(int value)`, `mFoo` will not be initialized in empty constructor and will not have setter.
Getter and setter names can be overriden with `style` `CppClass` option.

| style | getter | setter |
|-------------|--------------|--------------|
| `{style: st.SETTER_SET_NAME}` (default) | `bar()` | `setBar(int value)` |
| `{style: 0}` | `bar()` | `bar(int value)` |
| `{style: st.GETTER_GET_NAME + st.SETTER_SET_NAME}` | `getBar()` | `setBar(int value)` |

### Methods

```js
foo.method('clearBar', cpp.void, '', 'mBar = 0;').protected()
foo.method('moreThanTen', cpp.bool, 'int a, int b', 'return (a + b) > 10;').static()
foo.method('clicked', cpp.void, '').signal()
foo.method('onClicked', cpp.void, '', 'mBar++;').slot()
foo.method('implementMe', cpp.void, 'int a').pureVirtual()
```

This creates protected method, static method, signal method, slot method and pure virtual method. Signal and slot can be also writen like this:

```js
foo.signal('clicked', '')
foo.slot('onClicked', '', 'mBar++;')
```

### Functions

Functions declared just like methods

```js
foo.function_('plusTen', cpp.int, 'int b', 'return b + 10;')
```

### Operators

Operator can be declared as method (inside class) or as function (outside class)

```js
foo.methodOperator('+', 'Foo&', 'const Foo& arg', 'mBar += arg.bar(); return *this;')
foo.functionOperator('+', 'Foo', 'const Foo& arg1, const Foo& arg2', 'Foo res(arg1.bar() + arg2.bar()); return res;')
```

### Class members (global variables)

```js
foo.global('count', cpp.int, '0')
foo.global('gFoo', 'Foo', 'Foo()').extern()
```

This creates static variable `int Foo::count` and extern variable `Foo gFoo`

### Forward declarations, enums, typedefs, preprocessor expressions

```js
foo.definition('enum Type {TypeA, TypeB};', sc.CLASS)
foo.definition('class Foo;', sc.GLOBAL)
foo.definition('#define ROUND1(a) round((a) * 10.0) / 10.0', sc.IMPLEMENTATION_GLOBAL)
```

This creates enum in class scope, forward declaration in global scope and definition in cpp file

### Includes

All necessary includes added automaticaly if you define `classNames` in `CppClass` options, but you can add some manualy.

```js
foo.include('special.h', true, true, false)
foo.include('SomeClass', false, false, true)
```

This adds to header

```c++
#include <special.h>
class SomeClass;
```

and to cpp

```c++
#include "someclass.h"
```

### Inheritance

```js
foo.inherits('BaseFoo')
foo.constructor_({bar: cpp.int},{},{BaseFoo: 'bar'})
```

This adds inheritance and passes bar arg to base constructor

### Namespace

Class and functions will be defined in namespace if `namespace` specified in `CppClass` options

### Parsers

If you want to extend existing handwriten class you can either create generated class and inherit from handwriten class or move method implementations from cpp to header and use `parseClass` function. Also there is `parseMethod` function.

```js
foo = parseClass(
`class Foo {
public:
    Foo() : mBar(0) {

    }
    void test() {
        cout << "hello world\\n";
    }
protected:
    int mBar;
};`)

foo.method(parseMethod(
`int Foo::minusTen(int b) const {
    return b - 10;
}`
))
```

### Named arguments

If you want to implement "named arguments" pattern, there is `CppNamedArgs` class for this. It creates two classes - heavy implementation and lightweight stack-friendly proxy with chainable methods that calls implementation methods over a pointer.

### Singleton

There is `CppClassSingleton` for singletons. It is just `CppClass` with `instance()` static method and `mInstance` class variable.

### Class group

There is `CppClassGroup` for creating multiple coupled classes in single pair of source header files.

### Only functions

There is `CppNoClass` for functions-only units.

### Output

```js
foo.write(__dirname)
```

This outputs generated code to "foo.h" and "foo.cpp" in specified directory.