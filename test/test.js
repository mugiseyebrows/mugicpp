let {CppClass, CppNoClass, CppNamedArgs, cpp, qt} = require('../index')
//let assert = require('assert')
let chai = require('chai')

let assert = chai.assert

function torx(s) {
    return new RegExp(
        s.replace(/[(]/g,'[(]')
        .replace(/[)]/g,'[)]')
        .replace(/[{]/g,'[{]')
        .replace(/[}]/g,'[}]')
        .replace(/[+]/g,'[+]')
        .replace(/[*]/g,'[*]')
        .replace(/\s+/g,'\\s*')
        ,'sm')
}

describe('tests', () => {
    it('method', () => {
        let c = new CppClass('Foo', {simpleTypes: ['Bar']})
        c.method('foo', cpp.int, 'int a','return 10;')
        c.method('bar', cpp.void, {arg1: qt.QString, arg2: cpp.int, arg3: 'Bar'}, '').protected()
        let decl = c.declaration(true)
        let impl = c.implementation(true)
        assert.match(decl, torx('public: int foo(int a) ;'))
        assert.match(impl, torx('int Foo::foo(int a) { return 10; }'))
        assert.match(decl, torx('protected: void bar(const QString& arg1, int arg2, Bar arg3) ;'))
        assert.match(impl, torx('void Foo::bar(const QString& arg1, int arg2, Bar arg3) { }'))
        assert.match(decl, torx('class QString ;'))
        assert.match(impl, torx('#include <QString>'))
    })

    it('member', () => {
        let c = new CppClass('Foo')
        c.member('mFoo', cpp.int, 0)
        c.member('mBar', qt.QString, undefined, {getter: false, setter: false}).private()
        c.constructor_()
        let decl = c.declaration(true)
        let impl = c.implementation(true)
        assert.match(decl, torx('public: Foo() ; int foo() const ; void setFoo(int value) ;'))
        assert.match(decl, torx('protected: int mFoo;'))
        assert.match(decl, torx('private: QString mBar;'))
        assert.notMatch(decl, torx('QString bar() const ;'))
        assert.notMatch(decl, torx('void setBar(const QString& value) ;'))
        assert.match(impl, torx('Foo() : mFoo(0) { }'))
        assert.notMatch(impl, torx('mBar'))
    })

    it('constructor', () => {
        let c = new CppClass('Foo')
        c.constructor_({a: cpp.int},{Bar: 'a'})
        c.inherits('Bar')
        let decl = c.declaration(true)
        let impl = c.implementation(true)
        assert.match(decl, torx('class Foo : public Bar'))
        assert.match(impl, torx('Foo::Foo(int a) : Bar(a) { }'))
    })

    it('function', () => {
        let c = new CppNoClass('Foo')
        c.function_('foo', cpp.int, 'int a = 10', 'return a + 1;')
        let decl = c.declaration(true)
        let impl = c.implementation(true)
        assert.match(decl, torx('int foo(int a = 10) ;'))
        assert.match(impl, torx('int foo(int a) { return a + 1; }'))
    })

    it('operator', () => {
        let c = new CppClass('Foo')
        c.methodOperator('+', 'Foo', {b: 'Foo'}, 'return Foo();')
        c.functionOperator('-', 'Foo', {a: 'Foo', b: 'Foo'}, 'return Foo(10);')
        let decl = c.declaration(true)
        let impl = c.implementation(true)
        assert.match(decl, torx('class Foo { public: Foo operator + (const Foo& b) ; } ; Foo operator - (const Foo& a, const Foo& b) ; '))
        assert.match(impl, torx('Foo Foo::operator + (const Foo& b) { return Foo(); }'))
        assert.match(impl, torx('Foo operator - (const Foo& a, const Foo& b) { return Foo(10); }'))
    })

    it('named args', () => {

        let c = new CppNamedArgs('FooImpl','Foo')
        c.member('mBar', cpp.int, 0)
        c.method('barPlusOne', cpp.int , '', 'return mBar + 1;').const_()
        c.method('incBar', cpp.void, 'int inc = 1', 'mBar += inc;')

        let implDecl = c._impl.declaration(true)
        let implImpl = c._impl.implementation(true)
        let proxyDecl = c._proxy.declaration(true)
        let proxyImpl = c._proxy.implementation(true)

        assert.match(implDecl, torx('int mBar;'))
        assert.match(implDecl, torx('int bar() const ;'))
        assert.match(proxyDecl, torx('int bar() const ;'))
        assert.match(implImpl, torx('int FooImpl::bar() const { return mBar; }'))
        assert.match(proxyImpl, torx('int Foo::bar() const { return mImpl->bar(); }'))
        
        assert.match(implDecl, torx('void bar(int value) ;'))
        assert.match(proxyDecl, torx('Foo& bar(int value) ;'))
        assert.match(implImpl, torx('void FooImpl::bar(int value) { mBar = value; }'))
        assert.match(proxyImpl, torx('Foo& Foo::bar(int value) { mImpl->bar(value); return *this; }'))

        assert.match(implDecl, torx('int barPlusOne() const ;'))
        assert.match(proxyDecl, torx('int barPlusOne() const ;'))
        assert.match(implImpl, torx('int FooImpl::barPlusOne() const { return mBar + 1; }'))
        assert.match(proxyImpl, torx('int Foo::barPlusOne() const { return mImpl->barPlusOne(); }'))

        assert.match(implDecl, torx('void incBar(int inc = 1) ;'))
        assert.match(proxyDecl, torx('Foo& incBar(int inc = 1) ;'))
        assert.match(implImpl, torx('void FooImpl::incBar(int inc) { mBar += inc; }'))
        assert.match(proxyImpl, torx('Foo& Foo::incBar(int inc) { mImpl->incBar(inc); return *this; }'))

    })
})