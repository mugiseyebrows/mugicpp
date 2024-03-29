const fs = require('fs')
const path = require('path')
const {spawn} = require('child_process')

const acc = {
    PUBLIC: 0,
    PROTECTED: 1,
    PRIVATE: 2,
    NONE: 3,
    SIGNAL: 4,
    SLOT: 10,
    SLOT_PUBLIC: 10,
    SLOT_PROTECTED: 11,
    SLOT_PRIVATE: 12
}

const met = {
    CONST: 1,
    STATIC: 2,
    VIRTUAL: 4,
    PUREVIRTUAL: 8
}

const st = {
    SETTER_SET_NAME: 1,
    GETTER_GET_NAME: 2
}

const qt = { 

    // value types
    QString: 'QString',
    QVariant: 'QVariant',
    QDateTime: 'QDateTime',
    QDate: 'QDate',
    QSize: 'QSize',
    QPoint: 'QPoint',
    QPointF: 'QPointF',
    QColor: 'QColor',
    QPolygonF: 'QPolygonF',

    // containers
    QMap: (T1,T2) => `QMap<${T1},${T2}>`,
    QList: (T) => `QList<${T}>`,
    QSet: (T) => `QSet<${T}>`,
    QQueue: (T) => `QQueue<${T}>`,
    QPair: (T1,T2) => `QPair<${T1},${T2}>`,
    QByteArray: 'QByteArray',
    QVariantList: 'QVariantList',
    QStringList: 'QStringList',

    // sql
    QSqlDatabase: 'QSqlDatabase',
    QSqlQuery: 'QSqlQuery',

    // models
    QModelIndex: 'QModelIndex',
    QAbstractItemModel: 'QAbstractItemModel',
    QAbstractTableModel: 'QAbstractTableModel',
    QStringListModel: 'QStringListModel',
    QAbstractProxyModel: 'QAbstractProxyModel',

    // widgets
    QWidget: 'QWidget',
    QLineEdit: 'QLineEdit',
    QPushButton: 'QPushButton',
    QCheckBox: 'QCheckBox',
    QRadioButton: 'QRadioButton',
    QLabel: 'QLabel',
    QDialog: 'QDialog',
    QGroupBox: 'QGroupBox',
    QTableView: 'QTableView',
    QMessageBox: 'QMessageBox',
    QProgressDialog: 'QProgressDialog',

    // misc
    QDebug: 'QDebug',
    QObject: 'QObject',
    QPainter: 'QPainter',
    QItemDelegate: 'QItemDelegate',
    QRegExp: 'QRegExp',
    QDir: 'QDir',
    QFile: 'QFile',
    QAction: 'QAction',
    QAxObject: 'QAxObject',

    // enums
    Alignment: 'Qt::Alignment',
    
    // parsed enums
    Orientation: 'Qt::Orientation',
    Horizontal: 'Qt::Horizontal',
    Vertical: 'Qt::Vertical',
    MouseButton: 'Qt::MouseButton',
    NoButton: 'Qt::NoButton',
    LeftButton: 'Qt::LeftButton',
    RightButton: 'Qt::RightButton',
    MidButton: 'Qt::MidButton',
    MiddleButton: 'Qt::MiddleButton',
    BackButton: 'Qt::BackButton',
    XButton1: 'Qt::XButton1',
    ExtraButton1: 'Qt::ExtraButton1',
    ForwardButton: 'Qt::ForwardButton',
    XButton2: 'Qt::XButton2',
    ExtraButton2: 'Qt::ExtraButton2',
    TaskButton: 'Qt::TaskButton',
    ExtraButton3: 'Qt::ExtraButton3',
    ExtraButton4: 'Qt::ExtraButton4',
    ExtraButton5: 'Qt::ExtraButton5',
    ExtraButton6: 'Qt::ExtraButton6',
    ExtraButton7: 'Qt::ExtraButton7',
    ExtraButton8: 'Qt::ExtraButton8',
    ExtraButton9: 'Qt::ExtraButton9',
    ExtraButton10: 'Qt::ExtraButton10',
    ExtraButton11: 'Qt::ExtraButton11',
    ExtraButton12: 'Qt::ExtraButton12',
    ExtraButton13: 'Qt::ExtraButton13',
    ExtraButton14: 'Qt::ExtraButton14',
    ExtraButton15: 'Qt::ExtraButton15',
    ExtraButton16: 'Qt::ExtraButton16',
    ExtraButton17: 'Qt::ExtraButton17',
    ExtraButton18: 'Qt::ExtraButton18',
    ExtraButton19: 'Qt::ExtraButton19',
    ExtraButton20: 'Qt::ExtraButton20',
    ExtraButton21: 'Qt::ExtraButton21',
    ExtraButton22: 'Qt::ExtraButton22',
    ExtraButton23: 'Qt::ExtraButton23',
    ExtraButton24: 'Qt::ExtraButton24',
    AllButtons: 'Qt::AllButtons',
    MaxMouseButton: 'Qt::MaxMouseButton',
    MouseButtonMask: 'Qt::MouseButtonMask',
    SortOrder: 'Qt::SortOrder',
    AscendingOrder: 'Qt::AscendingOrder',
    DescendingOrder: 'Qt::DescendingOrder',
    AlignmentFlag: 'Qt::AlignmentFlag',
    AlignLeft: 'Qt::AlignLeft',
    AlignLeading: 'Qt::AlignLeading',
    AlignRight: 'Qt::AlignRight',
    AlignTrailing: 'Qt::AlignTrailing',
    AlignHCenter: 'Qt::AlignHCenter',
    AlignJustify: 'Qt::AlignJustify',
    AlignAbsolute: 'Qt::AlignAbsolute',
    AlignHorizontal_Mask: 'Qt::AlignHorizontal_Mask',
    AlignTop: 'Qt::AlignTop',
    AlignBottom: 'Qt::AlignBottom',
    AlignVCenter: 'Qt::AlignVCenter',
    AlignBaseline: 'Qt::AlignBaseline',
    AlignVertical_Mask: 'Qt::AlignVertical_Mask',
    AlignCenter: 'Qt::AlignCenter',
    ScrollBarPolicy: 'Qt::ScrollBarPolicy',
    ScrollBarAsNeeded: 'Qt::ScrollBarAsNeeded',
    ScrollBarAlwaysOff: 'Qt::ScrollBarAlwaysOff',
    ScrollBarAlwaysOn: 'Qt::ScrollBarAlwaysOn',
    CaseSensitivity: 'Qt::CaseSensitivity',
    CaseInsensitive: 'Qt::CaseInsensitive',
    CaseSensitive: 'Qt::CaseSensitive',
    CheckState: 'Qt::CheckState',
    Unchecked: 'Qt::Unchecked',
    PartiallyChecked: 'Qt::PartiallyChecked',
    Checked: 'Qt::Checked',
    ItemDataRole: 'Qt::ItemDataRole',
    DisplayRole: 'Qt::DisplayRole',
    DecorationRole: 'Qt::DecorationRole',
    EditRole: 'Qt::EditRole',
    ToolTipRole: 'Qt::ToolTipRole',
    StatusTipRole: 'Qt::StatusTipRole',
    WhatsThisRole: 'Qt::WhatsThisRole',
    FontRole: 'Qt::FontRole',
    TextAlignmentRole: 'Qt::TextAlignmentRole',
    BackgroundColorRole: 'Qt::BackgroundColorRole',
    BackgroundRole: 'Qt::BackgroundRole',
    TextColorRole: 'Qt::TextColorRole',
    ForegroundRole: 'Qt::ForegroundRole',
    CheckStateRole: 'Qt::CheckStateRole',
    AccessibleTextRole: 'Qt::AccessibleTextRole',
    AccessibleDescriptionRole: 'Qt::AccessibleDescriptionRole',
    SizeHintRole: 'Qt::SizeHintRole',
    InitialSortOrderRole: 'Qt::InitialSortOrderRole',
    DisplayPropertyRole: 'Qt::DisplayPropertyRole',
    DecorationPropertyRole: 'Qt::DecorationPropertyRole',
    ToolTipPropertyRole: 'Qt::ToolTipPropertyRole',
    StatusTipPropertyRole: 'Qt::StatusTipPropertyRole',
    WhatsThisPropertyRole: 'Qt::WhatsThisPropertyRole',
    UserRole: 'Qt::UserRole',
    ItemFlag: 'Qt::ItemFlag',
    NoItemFlags: 'Qt::NoItemFlags',
    ItemIsSelectable: 'Qt::ItemIsSelectable',
    ItemIsEditable: 'Qt::ItemIsEditable',
    ItemIsDragEnabled: 'Qt::ItemIsDragEnabled',
    ItemIsDropEnabled: 'Qt::ItemIsDropEnabled',
    ItemIsUserCheckable: 'Qt::ItemIsUserCheckable',
    ItemIsEnabled: 'Qt::ItemIsEnabled',
    ItemIsAutoTristate: 'Qt::ItemIsAutoTristate',
    ItemNeverHasChildren: 'Qt::ItemNeverHasChildren',
    ItemIsUserTristate: 'Qt::ItemIsUserTristate',
    TextElideMode: 'Qt::TextElideMode',
    ElideLeft: 'Qt::ElideLeft',
    ElideRight: 'Qt::ElideRight',
    ElideMiddle: 'Qt::ElideMiddle',
    ElideNone: 'Qt::ElideNone',
}

const cpp = {
    void: 'void',
    int: 'int',
    double: 'double',
    bool: 'bool',
    int8_t: "int8_t",
    uint8_t: "uint8_t",
    int16_t: "int16_t",
    uint16_t: "uint16_t",
    int32_t: "int32_t",
    uint32_t: "uint32_t",
    int64_t: "int64_t",
    uint64_t: "uint64_t"
}

const sc = {
    GLOBAL: 0,
    NAMESPACE: 1,
    CLASS: 2,
    IMPLEMENTATION_GLOBAL: 3,
    IMPLEMENTATION_NAMESPACE: 4
}

function capitalized(name) {
    return name[0].toUpperCase() + name.substr(1)
}

function uncapitalized(name) {
    return name[0].toLowerCase() + name.substr(1)
}

function valueOrBlank(value) {
    return value === undefined ? '' : value
}

function defaults(...objs) {
    return Object.assign({},...objs)
}

function defaults2(...objs) {
    let result = {}
    objs.forEach(obj => {
        if (!isObject(obj)) {
            return
        }
        for(var k in obj) {
            if (isArray(result[k]) && isArray(obj[k])) {
                result[k] = [...result[k], ...obj[k]]
            } else {
                result[k] = obj[k]
            }
        }
    })
    return result
}

/** mName("foo") -> "mFoo"
 * @param {string} name 
 */
function mName(name) {
    if (isObject(name)) {
        let result = {}
        for(var k in name) {
            result[mName(k)] = name[k]
        }
        return result
    }
    return 'm' + capitalized(name)
}

/** wName("mFoo") -> "foo"
 * @param {string} name 
 */
function wName(name) {
    if (isObject(name)) {
        let result = {}
        for(var k in name) {
            result[wName(k)] = name[k]
        }
        return result
    } 
    return uncapitalized(name.substr(1))
}

/** sName("mFoo") -> "setFoo"
 * @param {string} name 
 */
function sName(name) {
    if (isObject(name)) {
        let result = {}
        for(var k in name) {
            result[sName(k)] = name[k]
        }
        return result
    } 
    return `set` + capitalized(wName(name))
}

/** gName("mFoo") -> "getFoo"
 * @param {string} name 
 */
function gName(name) {
    if (isObject(name)) {
        let result = {}
        for(var k in name) {
            result[gName(k)] = name[k]
        }
        return result
    } 
    return `get` + capitalized(wName(name))
}

function ref(type, name) {
    return name !== undefined ? `${type}& ${name}` : `${type}&`
}

function constRef(type, name) {
    return name !== undefined ? `const ${type}& ${name}` : `const ${type}&`
}

function pointer(type, name) {
    return name !== undefined ? `${type}* ${name}` : `${type}*`
}

function constp(type, name) {
    return name !== undefined ? `const ${type}* ${name}` : `const ${type}*`
}

function ths(n,pref,suf,glue) {
    return range(n).map(i => `${pref}${i}${suf}`).join(glue)
}

function isArray(v) {
    return Array.isArray(v)
}

function isString(v) {
    return typeof v === 'string'
}

function isObject(v) {
    return v !== null && typeof v === 'object'
}

function isFunction(v) {
    return typeof v === 'function'
}

function isNumber(v) {
    return typeof v === 'number'
}


function lastItem(vs) {
    return vs[vs.length-1]
}


function clangFormat(...args) {

    let style = {
        BasedOnStyle: 'llvm',
        PointerAlignment: 'Left',
        IndentWidth: 4,
        ColumnLimit: 100,
        AccessModifierOffset: -4,
        AllowShortFunctionsOnASingleLine: false,
        NamespaceIndentation: 'All',
        Standard: 'Auto'
    }

    style = JSON.stringify(style).replace(/"/g,'').replace(/:/g,': ')

    let files, cb

    if (isFunction(lastItem(args)) || lastItem(args) === undefined) {
        cb = lastItem(args)
        files = args.slice(0,args.length-1)
    } else {
        files = args
    }

    let proc = spawn('clang-format',['-i','-style',style,...files])

    proc.stderr.on('data',(data)=>{console.log(data.toString())})

    proc.on('exit',(code) => {
        if (code !== 0) {
            console.log('failed to clang-format',...files)
        }
        if (cb !== undefined) {
            cb(files, code)
        }
    })
}

function isRefType(type, simpleTypes = []) {
    return ["void", "int", "double", "bool", "int8_t", "uint8_t", "int16_t", "uint16_t", "int32_t", "uint32_t", "int64_t", "uint64_t"].indexOf(type) < 0 
        && !type.endsWith('*') 
        && !type.endsWith('&') 
        && !type.match(/^Qt::/)
        && simpleTypes.indexOf(type) < 0
}

function typeSign(name, type, simpleTypes = []) {
    if (isRefType(type, simpleTypes)) {
        return `const ${type}& ${name}`
    }
    return `${type} ${name}`
}

class CppSignature {
    constructor(options) {
        this._options = defaults({simpleTypes:[]}, options)
    }

    /** signature({a:'int',b:'QString'},{b:'"foo"'},true) -> 'int a, const QString& b = "foo"'
     * 
     * @param {object} args 
     * @param {object} optional 
     * @param {boolean} withOptional 
     */
    signature(args = {}, optional = {}, withOptional = true) {
        let res = []
        for(let name in args) {
            let arg = typeSign(name, args[name], this._options.simpleTypes)
            if (withOptional && optional[name] !== undefined) {
                arg = `${arg} = ${optional[name]}`
            }
            res.push(arg)
        }
        return res.join(', ')
    }
}


function range(a,b,c) {
    if (arguments.length == 1) {
        return range(0,a,1)
    } else if (arguments.length == 2) {
        return range(a,b,1)
    } else if (arguments.length == 3) {
        if (c > 0) {
            var res = []
            for (var i=a;i<b;i=i+c) {
            res.push(i)
            }
            return res
        }
        var res = []
        for(var i=a;i>b;i=i+c) {
            res.push(i)
        }
        return res
    }
    throw "range needs one or two or three arguments"
}

function uniq(vs) {
    return Array.from(new Set(vs))
}

function classnamesWithout(classNames, excludeName) {
    let res = []
    for(item of classNames) {
        if (isString(item)) {
            if (item !== excludeName) {
                res.push(item)
            }
        } else {
            let {name, namespace} = item
            if (name !== excludeName) {
                res.push(item)
            }
        }
    }
    return res
}

function stripClass(type, className) {
    let m = type.match(/(.*)::(.*)/)
    return (m !== null && m[1] === className) ? m[2] : type
}

function splitSignature(signature) {
    let d1 = 0
    let d2 = 0
    let d3 = 0
    let args = []
    let arg = ''
    let string = false
    let char = false
    let p = ''
    let x = [...signature].forEach(c => {
        if (c === ',' && d1 === 0 && d2 === 0 && d3 === 0 && !string && !char) {
            args.push(arg)
            arg = ''
        } else {
            if (c === '"' && p !== '\\' && !char) {
                string = !string
            }
            if (c === "'" && !string) {
                char = !char
            }
            if (!string && !char) {
                if (c === '<') {
                    d1 += 1
                } else if (c === '>') {
                    d1 -= 1
                } else if (c === '{') {
                    d2 += 1
                } else if (c === '}') {
                    d2 -= 1
                } else if (c === '(') {
                    d3 += 1
                } else if (c === ')') {
                    d3 -= 1
                }
            }
            arg = arg + c
        }
        p = c
    })
    arg = arg.trim()
    if (arg.length > 0) {
        args.push(arg)
    }
    return args.map(e => e.trim())
}

function stripOptional(signature, join = true) {
    let args = splitSignature(signature).map(arg => arg.split('=')[0].trim())
    return join === true ? args.join(', ') : args
}

function signatureNames(signature, join = true) {
    let args = stripOptional(signature, false).map(arg => arg.match(/(\w+)$/)[1] )
    return join === true ? args.join(', ') : args
}

function parseSignature(signature) {

    let args = splitSignature(signature)
    let names = signatureNames(signature, false)
    let nameTypes = {}
    let optional = {}
    args.forEach((arg,i) => {
        let name = names[i]
        let opt = arg.split('=')[1]
        if (opt !== undefined) {
            optional[name] = opt.trim()
        }
        let type = arg.substring(0, (arg.split('=')[0]).lastIndexOf(names[i])).trim()
        nameTypes[name] = type
    })
    return [nameTypes, optional]
}

function parseInitList(initList) {
    let d = 0
    let args = []
    let arg = ''
    let x = [...initList].forEach(c => {
        arg = arg + c
        if (c === '(') {
            d += 1
        } else if (c === ')') {
            d -= 1
        }
        if (c === ')' && d === 0) {
            args.push(arg)
            arg = ''
        }
    })
    let result = {}
    args.forEach(arg => {
        let m = arg.match(/(\w+)[(](.*)[)]/)
        if (m !== null) {
            let [_, name, value] = m
            result[name] = value
        }
    })
    return result
}


class CppMethod {
 
    constructor(name, type, signature, implementation_ = '', access = acc.PUBLIC, flags = 0) {
        this._name = name
        this._type = type
        this._signature = signature
        this._implementation = implementation_
        this._access = access
        this._flags = flags
    }

    declaration(className, access, options) {
        if (access !== this._access) {
            return undefined
        }
        let flags = this._flags
        let const_ = (flags & met.CONST) ? 'const' : ''
        let static_ = (flags & met.STATIC) ? 'static' : ''
        let virtual = ((flags & met.VIRTUAL) || (flags & met.PUREVIRTUAL)) ? 'virtual' : ''

        let type = stripClass(this._type, className)
        let pure = (flags & met.PUREVIRTUAL) ? '= 0' : '';
        let signature = this._signature

        if (isObject(signature)) {
            signature = (new CppSignature(options)).signature(signature)
        }
        
        return `${static_} ${virtual} ${type} ${this._name}(${signature}) ${const_} ${pure};`
    }

    implementation(className, options) {
        let flags = this._flags
        if (flags & met.PUREVIRTUAL) {
            return undefined
        }
        let const_ = (flags & met.CONST) ? 'const' : ''
        let type = this._type

        let signature = this._signature

        if (isObject(signature)) {
            signature = (new CppSignature(options)).signature(signature)
        } else {
            signature = stripOptional(signature)
        }

        let scope = className === undefined ? '' : className + '::'
        return `${type} ${scope}${this._name}(${signature}) ${const_}{\n${valueOrBlank(this._implementation)}\n}`
    }

    const_() {
        this._flags |= met.CONST
        return this
    }

    virtual() {
        this._flags |= met.VIRTUAL
        return this
    }

    static() {
        this._flags |= met.STATIC
        return this
    }

    pureVirtual() {
        this._flags |= met.PUREVIRTUAL
        return this
    }

    public() {
        if (this._access >= acc.SLOT) {
            this._access = acc.SLOT_PUBLIC
        } else {
            this._access = acc.PUBLIC
        }
        return this
    }

    private() {
        if (this._access >= acc.SLOT) {
            this._access = acc.SLOT_PRIVATE
        } else {
            this._access = acc.PRIVATE
        }
        return this
    }

    protected() {
        if (this._access >= acc.SLOT) {
            this._access = acc.SLOT_PROTECTED
        } else {
            this._access = acc.PROTECTED
        }
        return this
    }

    signal() {
        this._access = acc.SIGNAL
        return this
    }

    slot() {
        if ([acc.PRIVATE, acc.PUBLIC, acc.PROTECTED].indexOf(this._access) > -1) {
            this._access += acc.SLOT
        } else {
            this._access = acc.SLOT
        }
        return this
    }

}

/*

const_
virtual
static
pureVirtual
public
private
protected

^(.*)$
\1(){\nthis._methods.forEach(method => method.\1())\nreturn this\n}\n

 */


class CppNamedArgsMethods {
    /**
     * @param {CppMethod[]} methods 
     */
    constructor(methods) {
        this._methods = methods
    }
    const_() {
        this._methods.forEach(method => method.const_())
        return this
    }

    virtual() {
        this._methods.forEach(method => method.virtual())
        return this
    }

    static() {
        this._methods.forEach(method => method.static())
        return this
    }

    pureVirtual() {
        this._methods.forEach(method => method.pureVirtual())
        return this
    }

    public() {
        this._methods.forEach(method => method.public())
        return this
    }

    private() {
        this._methods.forEach(method => method.private())
        return this
    }

    protected() {
        this._methods.forEach(method => method.protected())
        return this
    }

    forEach(fn) {
        this._methods.forEach(fn)
    }

    proxy() {
        return this._methods[0]
    }

    impl() {
        return this._methods[1]
    }

}

class CppOperator extends CppMethod {
    constructor(name, type, signature, implementation, flags = 0) {
        super(`operator ${name}`, type, signature, implementation, met.PUBLIC, flags)
    }
}

class CppGetter extends CppMethod {
    constructor(name, type, implementation = undefined, access = acc.PUBLIC, options = {style: st.SETTER_SET_NAME}) {
        let methodName = (options.style !== undefined && options.style & st.GETTER_GET_NAME) ? gName(name) : wName(name)
        super(methodName, type, '', implementation !== undefined ? implementation : `return ${name};`, access, met.CONST)
    }
}

class CppSetter extends CppMethod {
    constructor(name, type, implementation = undefined, access = acc.PUBLIC, options = {simpleTypes: [], style: st.SETTER_SET_NAME}) {
        let methodName = (options.style !== undefined && options.style & st.SETTER_SET_NAME) ? sName(name) : wName(name)
        super(methodName, cpp.void, typeSign('value', type, options.simpleTypes), implementation !== undefined ? implementation : `${name} = value;`, access)
    }
}

class CppDestructor {
    constructor(implementation = '', flags = 0) {
        this._implementation = implementation
        this._flags = flags
    }
    declaration(className, access) {
        if (access !== acc.PUBLIC) {
            return
        }
        let virtual = this._flags & met.VIRTUAL ? 'virtual' : ''
        return `${virtual} ~${className}();`
    }
    implementation(className) {
        let scope = className === undefined ? '' : className + '::'
        return `${className}::~${className}() {\n${this._implementation}\n}`
    }
    virtual() {
        this._flags = met.VIRTUAL
    }
}


function parseDestructor(text) {
    let signatureStart = text.indexOf('(')
    let signatureEnd = matchingBracket(text, signatureStart)
    let bodyStart = text.indexOf('{',signatureEnd)
    let bodyEnd = text.lastIndexOf('}')
    let implementation = text.substring(bodyStart + 1, bodyEnd - 1)
    let flags = text.match(/^virtual/) !== null ? met.VIRTUAL : 0
    return new CppDestructor(implementation, flags)
}

/**
 * @param {string} text 
 * @param {number} access 
 */
function parseConstructor(text, access) {
    let signatureStart = text.indexOf('(')
    let signatureEnd = matchingBracket(text, signatureStart)

    let bodyStart = text.indexOf('{',signatureEnd)
    let bodyEnd = text.lastIndexOf('}')

    let implementation = text.substring(bodyStart + 1, bodyEnd)

    let initList = text.substring(signatureEnd + 1, bodyStart)

    let init = {}

    let m = initList.match(/:\s*(.*)/)
    if (m !== null) {
        init = parseInitList(m[1])
    } 

    let signature = text.substring(signatureStart + 1, signatureEnd)
    
    return new CppConstructor(signature, init, implementation, access)
}

function parseMethod(text, access = acc.PUBLIC) {

    let signatureStart = text.indexOf('(')
    let signatureEnd = matchingBracket(text, signatureStart)

    /* @TODO pure virtual functions */

    let implementationStart = text.indexOf('{', signatureEnd)
    let implementationEnd = text.lastIndexOf('}')

    let signature = text.substring(signatureStart + 1, signatureEnd)
    let implementation = text.substring(implementationStart + 1, implementationEnd).trim()

    let const_ = text.substring(signatureEnd + 1, implementationStart)

    let typeAndName = text.substring(0, signatureStart)

    let m = typeAndName.match(/(static|virtual)?\s*(.*)\s+(\w+)+::(\w+)/)
    
    let static_, className, name, type, _ 

    if (m !== null) {
        [_, static_, type, className, name] = m
    } else {
        m = typeAndName.match(/(static|virtual)?\s*(.*)\s+(\w+)+/)
        if (m !== null) {
            [_, static_, type, name] = m
        }
    }

    let flags = 0

    if (static_ === 'static') {
        flags = flags | met.STATIC
    } else if (static_ === 'virtual') {
        flags = flags | met.VIRTUAL
    }

    if (const_.indexOf('const') > -1) {
        flags = flags | met.CONST
    }
    
    if (m === null) {
        return
    }

    return new CppMethod(name, type, signature, implementation, access, flags)
}

class CppMember {
    constructor(name, type, value = undefined, options = undefined) {
        this._name = name
        this._type = type
        this._value = value
        this._options = defaults({style:0, getter: true, setter: true, simpleTypes: [], access: acc.PROTECTED}, options)
        this._access = this._options.access
        let {getter, setter} = this._options
        /**
         * @type {CppMethod}
         */
        this._getter = undefined
        /**
         * @type {CppMethod}
         */
        this._setter = undefined

        if (setter !== false) {
            let access = acc.PUBLIC
            let implementation = undefined
            if (isNumber(setter)) {
                access = setter
            } else if (isString(setter)) {
                implementation = setter
            } else if (setter === true) {
                access = acc.PUBLIC
            }
            this._setter = new CppSetter(name, type, implementation, access, this._options)
        }
        if (getter !== false) {
            let access = acc.PUBLIC
            let implementation = undefined
            if (isNumber(getter)) {
                access = getter
            } else if (isString(getter)) {
                implementation = getter
            } else if (getter === true) {
                access = acc.PUBLIC
            }
            this._getter = new CppGetter(name, type, implementation, access, this._options)
        }
    }

    public() {
        this._access = acc.PUBLIC
        return this
    }

    private() {
        this._access = acc.PRIVATE
        return this
    }

    protected() {
        this._access = acc.PROTECTED
        return this
    }


    declaration(className, access, options) {
        let result = [this._getter, this._setter]
            .map(method => method === undefined ? undefined : method.declaration(className, access, options))
        if (access === this._access) {
            result.push(`${stripClass(this._type, className)} ${this._name};`)
        }
        return joinDefinedIfAny(result)
    }

    implementation(className, options) {
        let result = [this._getter, this._setter]
            .map(method => method === undefined ? undefined : method.implementation(className, options))
        return joinDefinedIfAny(result)
    }
}

function parseMember(text, access) {
    let m = text.match(/(.*)\s+(\w+);/i)
    if (m !== null) {
        let [_,type,name] = m
        return new CppMember(name, type, undefined, {getter: false, setter: false})
    }
}


class CppConstructor {
    constructor(signature = '', init = '', implementation_ = '', access = acc.PUBLIC, explicit = false) {
        this._signature = signature
        this._init = init
        this._implementation = implementation_
        this._access = access
        this._explicit = explicit
    }

    /**
     * @param {boolean} withOptional 
     */
    _signature_(withOptional, options) {
        let signature = this._signature
        let nameTypes, optional = {}
        if (isString(signature)) {
            [nameTypes, optional] = parseSignature(signature)
        } else {
            nameTypes = signature
        }
        
        return (new CppSignature(options)).signature(nameTypes, optional, withOptional)
    }

    /**
     * @param {CppMember[]} members 
     */
    _initialization(members) {
        
        let signature = this._signature
        let nameTypes = {}

        if (isString(signature)) {
            [nameTypes] = parseSignature(signature)
        } else {
            nameTypes = signature
        }

        let argNames = Object.keys(nameTypes)
        let init = this._init
        if (isString(init)) {
            init = parseInitList(init)
        }

        let result = []
        for (var name in init) {
            result.push(`${name}(${init[name]})`)
        }
        members.forEach(member => {
            let mName = member._name
            let name = wName(mName)
            if (init[mName] !== undefined) {
                return
            }
            if (argNames.indexOf(name) > -1) {
                result.push(`${mName}(${name})`)
            } else if (member._value !== undefined) {
                result.push(`${mName}(${member._value})`)
            }
        })
        if (result.length > 0) {
            return ':' + result.join(', ')
        }
        return ''
    }

    explicit() {
        this._explicit = true
        return this
    }

    public() {
        this._access = acc.PUBLIC
        return this
    }

    private() {
        this._access = acc.PRIVATE
        return this
    }

    protected() {
        this._access = acc.PROTECTED
        return this
    }

    /**
     * @param {string} className 
     * @param {number} access 
     */
    declaration(className, access, options) {
        if (access !== this._access) {
            return undefined
        }
        let explicit = this._explicit ? 'explicit' : ''
        return `${explicit} ${className}(${this._signature_(true, options)});`
    }

    implementation(className, members, options) {
        return `${className}::${className}(${this._signature_(false, options)}) ${this._initialization(members)} {\n${this._implementation}\n}`
    }

}


class CppGuard {
    constructor(className, active = true) {
        this._className = className
        this._active = active
    }
    _variable() {
        return this._className.toUpperCase() + '_H'
    }
    head() {
        return this._active ? `#ifndef ${this._variable()}\n#define ${this._variable()}` : ''
    }
    tail() {
        return this._active ? `#endif // ${this._variable()}` : ''
    }
}

function accessLabel(access) {
    return {
        [acc.PUBLIC]: 'public',
        [acc.PROTECTED]: 'protected',
        [acc.PRIVATE]: 'private',
        [acc.SIGNAL]: 'signals',
        [acc.SLOT_PUBLIC]: 'public slots',
        [acc.SLOT_PROTECTED]: 'protected slots',
        [acc.SLOT_PRIVATE]: 'private slots'
    }[access]
}

class CppInheritance {
    constructor() {
        this._inheritance = []
    }
    push(name, access) {
        this._inheritance.push({name,access})
    }
    value() {
        if (this._inheritance.length === 0) {
            return ''
        }
        return ': ' + this._inheritance.map(({name,access}) => {
            return `${accessLabel(access)} ${name}`
        }).join(', ')
    }
}

/** Global variable outside class (extern) or static class member
 * 
 */
class CppGlobal {
    constructor(name, type, initialization, access = acc.PUBLIC, static_ = true) {
        this._name = name
        this._type = type
        this._initialization = initialization
        this._access = access
        this._static = static_
    }

    static_() {
        this._static = true
        return this
    }

    extern() {
        this._static = false
        return this
    }

    declaration(access, classScope) {
        if (classScope) {
            if (access === this._access) {
                return this._static ? `static ${this._type} ${this._name};` : undefined
            }
        } else {
            return this._static ? undefined : `extern ${this._type} ${this._name};`
        }
    }

    implementation(className) {
        return this._static  
            ? `${this._type} ${className}::${this._name} = ${this._initialization};` 
            : `${this._type} ${this._name} = ${this._initialization};`
    }
}

class CppNamespace {
    constructor(name = undefined) {
        this._name = name
    }
    
    head() {
        return this._name === undefined ? '' : `namespace ${this._name} {`
    }
    
    tail() {
        return this._name === undefined ? '' : `}`
    }
}

class CppWarning {
    constructor(active = true) {
        this._active = active
    }
    value() {
        return this._active ? '// DO NOT EDIT ** This file was generated by mugicpp ** DO NOT EDIT' : ''
    }
}

class CppInclude {
    /**
     * @param {string} name 
     * @param {boolean} header 
     * @param {boolean} forward 
     */
    constructor(name, header, global, forward, namespace) {
        this._name = name
        this._header = header
        this._global = global
        this._forward = forward
        this._namespace = namespace
        //console.log('CppInclude',name, header, global, forward)
    }

    _fileName(options) {
        let name = this._name
        let isClass = name.toLowerCase() !== name
        let isQtClass = name.match(/^Q[A-Z]/) !== null
        if (options.includeCallback) {
            let res = options.includeCallback(this)
            if (res !== undefined && res !== null) {
                return res
            }
        }
        return isQtClass ? name : (isClass ? name.toLowerCase() + '.h' : name)
    }

    _expression(options) {
        let head = this._global ? '<' : '"'
        let tail = this._global ? '>' : '"'
        let value = `#include ${head}${this._fileName(options)}${tail}`
        //console.log(this._name, '_expression', value)
        return value
    }

    declaration(options) {
        if (this._header) {
            return this._expression(options)
        } else if (this._forward) {
            if (this._namespace !== undefined) {
                return `namespace ${this._namespace} { class ${this._name}; }`
            } else {
                return `class ${this._name};`
            }
        }
    }

    implementation(options) {
        let value = this._header ? undefined : this._expression(options)
        //console.log('CppInclude.implementation', this._name, value)
        return value
    }
}

function matchClass(className, text, add) {
    let regexp = new RegExp(className + '\\b\\s*[*&]?', 'gm')
    let matched = text.match(regexp)
    if (matched === null) {
        return
    }
    matched.forEach(match => {
        let [name] = match.split(/[*&]/).map(e => e.trim())
        let pointer = match.match(/[*&]/) !== null
        add(name, pointer)
    })
}

/**
 * @param {string} text 
 * @param {boolean} header 
 * @param {string[]} classNames 
 * @returns {CppInclude[]}
 */
function userIncludes(text, header, classNames) {

    let result = {}
    let add = (name, pointer) => {
        if (result[name] === undefined) {
            result[name] = pointer
        } else if (pointer === false) {
            result[name] = false
        }
    }

    let namespaces = {}

    classNames.forEach(className => {

        if (isString(className)) {
            matchClass(className, text, add)
        } else {
            var {name, namespace} = className
            namespaces[name] = namespace
            matchClass(name, text, add)
        }
    })

    return Object.keys(result).map(name => {
        let global = false
        if (header) {
            let pointer = result[name]
            if (pointer) {
                return new CppInclude(name, false, global, true, namespaces[name])
            } else {
                return new CppInclude(name, true, global, false, namespaces[name])
            }
        } else {
            return new CppInclude(name, false, global, false, namespaces[name])
        }
    })
}

/**
 * @param {string} text 
 * @param {boolean} header 
 * @returns {CppInclude[]}
 */
function qtIncludes(text, header) {
    let result = {}
    
    let add = (name, pointer) => {
        if (result[name] === undefined) {
            result[name] = pointer
        } else if (pointer === false) {
            result[name] = false
        }
    }

    // types
    let matched = text.match(/Q[A-Z][A-Za-z]+\s*[*&]?/gm)
    if (matched !== null) {
        matched.forEach(match => {
            let [name] = match.split(/[*&]/).map(e => e.trim())
            let pointer = match.match(/[*&]/) !== null
            add(name, pointer)
        })
    }

    // containers
    matched = text.match(/Q[A-Z][A-Za-z]+\s*<[^>]*>/gm)
    if (matched !== null) {
        matched.forEach(match => {
            let [name] = match.split(/</).map(e => e.trim())
            add(name, false)
        })
    }

    let more = []

    if (text.match(/qDebug/gm) !== null) {
        more.push(new CppInclude('QDebug', false, true, false))
    } 

    return Object.keys(result).map(name => {
        let global = true
        if (header) {
            let pointer = result[name]
            if (pointer) {
                return new CppInclude(name, false, global, true)
            } else {
                return new CppInclude(name, true, global, false)
            }
        } else {
            return new CppInclude(name, false, global, false)
        }
    }).concat(more)
}

function prependNew(item, vs) {
    if (vs.indexOf(item) < 0) {
        return [item, ...vs]
    }
    return vs
}

function prependClassNames(classNames, newItem) {
    let excludeName = isString(newItem) ? newItem : newItem.name
    let tail = classnamesWithout(classNames, excludeName)
    return [newItem, ...tail]
}

function joinDefined(values, glue = '\n') {
    return isArray(values) ? values.filter(value => value !== undefined).join(glue) : ''
}

function joinDefinedIfAny(values, glue = '\n') {
    values = values.filter(value => value !== undefined)
    return values.length === 0 ? undefined : values.join(glue)
}


/** Forward declaration or typedef or enum or define
 */
class CppDefinition {
    /**
     * @param {string} value 
     * @param {number} scope 
     */
    constructor(value, scope = sc.GLOBAL) {
        this._value = value
        this._scope = scope
    }

    /**
     * @param {number} scope 
     */
    value(scope) {
        return scope === this._scope ? this._value : undefined
    }

    global() {
        this._scope = sc.GLOBAL
        return this
    }

    class() {
        this._scope = sc.CLASS
        return this
    }

    namespace() {
        this._scope = sc.NAMESPACE
        return this
    }

    implementationGlobal() {
        this._scope = sc.IMPLEMENTATION_GLOBAL
        return this
    }

    implementationNamespace() {
        this._scope = sc.IMPLEMENTATION_NAMESPACE
        return this
    }

}

class CppClass {
    /**
     * @param {string} name 
     * @param {object} options
     */
    constructor(name, options = {}) {
        this._name = name

        this._options = defaults({style: st.SETTER_SET_NAME, classNames: [], namespace: undefined, warning: true, guard: true, simpleTypes: []}, options)

        /**
         * @type {CppMember[]}
         */
        this._members = []
        /**
         * @type {CppMethod[]}
         */
        this._methods = []

        /**
         * @type {CppMethod[]}
         */
        this._functions = []
        /**
         * @type {CppConstructor[]}
         */
        this._constructors = []
        this._declspec = ''
        this._qobject = ''
        /**
         * @type {CppDestructor}
         */
        this._destructor = undefined
        /**
         * @type {CppDefinition[]}
         */
        this._definitions = []
        this._inheritance = new CppInheritance()
        /**
         * @type {CppGlobal[]}
         */
        this._globals = []
        /**
         * @type {string[]}
         */
        this._namespace = new CppNamespace(this._options.namespace)
        /**
         * @type {CppInclude[]}
         */
        this._includes = []
        this._metatype = ''
    }

    /**
     * @param {string} name 
     * @param {string} type 
     * @param {string} value 
     * @param {object} options 
     */
    member(name, type, value, options) {
        if (isObject(name)) {
            this._members.push(name)
        } else {
            this._members.push(new CppMember(name, type, value, defaults(this._options, options)))
        }
        return lastItem(this._members)
    }

    /**
     * @param {string} name 
     * @param {string} type 
     * @param {string|object} signature 
     * @param {string} implementation 
     * @param {number} access 
     * @param {number} flags 
     * @returns {CppMethod}
     */
    method(name, type, signature, implementation = '', access = acc.PUBLIC, flags = 0) {
        if (name instanceof CppMethod) {
            this._methods.push(name)
        } else {
            this._methods.push(new CppMethod(name, type, signature, implementation, access, flags))
        }
        return lastItem(this._methods)
    }

    /**
     * @param {string} name 
     * @param {string|object} signature 
     * @returns {CppMethod}
     */
    signal(name, signature) {
        if (name instanceof CppMethod) {
            this._methods.push(name)
        } else {
            this.method(name, cpp.void, signature, undefined, acc.SIGNAL)
        }
        return lastItem(this._methods)
    }

    /**
     * 
     * @param {string} name 
     * @param {string|object} signature 
     * @param {string} implementation 
     * @param {number} access 
     * @returns {CppMethod}
     */
    slot(name, signature, implementation = '', access = acc.PUBLIC) {
        if (name instanceof CppMethod) {
            this._methods.push(name)
        } else {
            this.method(name, cpp.void, signature, implementation, access).slot()
        }
        return lastItem(this._methods)
    }

    /**
     * @param {string} name 
     * @param {string} type 
     * @param {string|object} signature 
     * @param {string} implementation 
     */
    function_(name, type, signature = '', implementation = '') {
        if (name instanceof CppMethod) {
            this._functions.push(name)
        } else {
            this._functions.push(new CppMethod(name, type, signature, implementation, acc.PUBLIC, 0))
        }
        return lastItem(this._functions)
    }

    _operator(dest, name, type, signature, implementation, flags) {
        if (name instanceof CppMethod) {
            dest.push(name)
        } else {
            dest.push(new CppOperator(name, type, signature, implementation, flags))
        }
        return lastItem(dest)
    }

    /**
     * @param {string} name 
     * @param {string} type 
     * @param {string|object} signature 
     * @param {string} implementation 
     * @param {number} flags 
     */
    methodOperator(name, type = cpp.void, signature = '', implementation = '', flags = 0) {
        return this._operator(this._methods, name, type, signature, implementation, flags)
    }

    /**
     * @param {string} name 
     * @param {string} type 
     * @param {string|object} signature 
     * @param {string} implementation 
     * @param {number} flags 
     * @returns {CppMethod}
     */
    functionOperator(name, type = cpp.void, signature = '', implementation = '', flags = 0) {
        return this._operator(this._functions, name, type, signature, implementation, flags)
    }

    /**
     * 
     * @param {string} name 
     * @param {number} access 
     * @returns {CppClass}
     */
    inherits(name, access = acc.PUBLIC) {
        this._inheritance.push(name, access)
        return this
    }

    /**
     * @param {string} name 
     * @param {boolean} header 
     * @param {boolean} global 
     * @param {boolean} forward 
     * @returns {CppInclude}
     */
    include(name, header = true, global = false, forward = false) {
        if (name instanceof CppInclude) {
            this._includes.push(name)
        } else {
            this._includes.push(new CppInclude(name, header, global, forward))
        }
        return lastItem(this._includes)
    }

    /**
     * @param {string|object} signature 
     * @param {string|object} init 
     * @param {string} implementation 
     * @param {number} access 
     * @param {boolean} explicit 
     * @returns {CppConstructor}
     */
    constructor_(signature = '', init = '', implementation = '', access = acc.PUBLIC, explicit = false) {
        if (signature instanceof CppConstructor) {
            this._constructors.push(signature)
        } else {
            this._constructors.push(new CppConstructor(signature, init, implementation, access, explicit))
        }
        return lastItem(this._constructors)
    }

    /**
     * @param {string} implementation 
     * @param {number} flags 
     * @returns {CppDestructor}
     */
    destructor(implementation = '', flags = 0) {
        if (implementation instanceof CppDestructor) {
            this._destructor = implementation
        } else {
            this._destructor = new CppDestructor(implementation, flags)
        }
        return this._destructor
    }

    /**
     * @param {CppGlobal} global 
     * @returns {CppGlobal}
     */
    global(name, type, initialization, access = acc.PUBLIC, static_ = true) {
        if (name instanceof CppGlobal) {
            this._globals.push(name)
        } else {
            this._globals.push(new CppGlobal(name, type, initialization, access, static_))
        }
        return lastItem(this._globals)
    }

    /**
     * @param {string} value 
     * @returns {CppClass}
     */
    declspec(value) {
        this._declspec = value
        return this
    }

    /**
     * @param {boolean} value
     * @returns {CppClass}
     */
    qobject(value = true) {
        this._qobject = value ? 'Q_OBJECT' : ''
        return this
    }

    /**
     * @param {number} style 
     * @returns {CppClass}
     */
    style(style) {
        this._options.style = style
        return this
    }

    /**
     * @param {boolean} value 
     * @returns {CppClass}
     */
    metatype(value = true) {
        this._metatype = value ? `Q_DECLARE_METATYPE(${this._name})` : ''
        return this
    }

    /**
     * @param {string} value 
     * @param {number} scope 
     */
    definition(value, scope = sc.GLOBAL) {
        if (value instanceof CppDefinition) {
            this._definitions.push(value)
        } else {
            this._definitions.push(new CppDefinition(value, scope))
        }
        return lastItem(this._definitions)
    }

    _accessLabeled(access, decls) {
        decls = decls.filter(e => e !== undefined)
        if (decls.length > 0) {
            return `${accessLabel(access)}:\n${decls.join('\n')}`
        }
    }

    _declarationIncludes() {
        let declaration = this.declaration(false)
        return [...qtIncludes(declaration, true), 
            ...userIncludes(declaration, true, classnamesWithout(this._options.classNames, this._name)), ...this._includes]
    }

    _implementationIncludes() {
        let implementation = this.implementation(false)
        let qtIncludes_ = qtIncludes(implementation, false)
        let userIncludes_ = userIncludes(implementation, false, prependClassNames(this._options.classNames, this._name))
        return [...qtIncludes_, ...userIncludes_]
    }

    declaration(withIncludes = true) {
        let className = this._name
        let options = this._options
        let guard = new CppGuard(className, options.guard)
        let warning = new CppWarning(options.warning)
        let declarations = [acc.PUBLIC, acc.SIGNAL, acc.SLOT_PUBLIC, acc.PROTECTED, acc.SLOT_PROTECTED, acc.PRIVATE, acc.SLOT_PRIVATE].map(access => {
            let methods = this._methods.map(method => method.declaration(className, access, options))
            let members = this._members.map(member => member.declaration(className, access, options))
            let constructors = this._constructors.map(constructor_ => constructor_.declaration(className, access, options))
            let globals = this._globals.map(global => global.declaration(access, true))
            let definitions = access === acc.PUBLIC ? this._definitions.map(forward => forward.value(sc.CLASS)) : []
            let destructor = (this._destructor !== undefined) ? this._destructor.declaration(className, access) : undefined
            return this._accessLabeled(access, [...definitions, ...globals, ...constructors, destructor, ...methods, ...members])
        })

        let includes = []

        if (withIncludes) {
            includes = this._declarationIncludes().map(include => include.declaration(this._options))
        }

        let functions = this._functions.map(function_ => function_.declaration(className, acc.PUBLIC, options))
        let externals = this._globals.map(global => global.declaration(acc.PUBLIC, false))

        let definitions = (scope) => joinDefined(this._definitions.map(forward => forward.value(scope)))

        return `${warning.value()}
                ${guard.head()}
                ${joinDefined(includes)}
                ${definitions(sc.GLOBAL)}
                ${this._namespace.head()}
                ${definitions(sc.NAMESPACE)}
                class ${this._declspec} ${className} ${this._inheritance.value()}{
                    ${this._qobject}
                    ${joinDefined(declarations)}
                };
                ${joinDefined(functions)}
                ${joinDefined(externals)}
                ${this._metatype}
                ${this._namespace.tail()}
                ${guard.tail()}
                `
    }

    implementation(withIncludes = true) {
        let warning = new CppWarning(this._options.warning)
        let className = this._name
        let options = this._options
        let methods = this._methods.filter(method => method._access !== acc.SIGNAL).map(method => method.implementation(className, options))
        let members = this._members.map(member => member.implementation(className, options))
        let constructors = this._constructors.map(constructor_ => constructor_.implementation(className, this._members, options))
        let destructor = (this._destructor !== undefined) ? this._destructor.implementation(className) : undefined
        let globals = this._globals.map(global => global.implementation(className))
        let functions = this._functions.map(function_ => function_.implementation(undefined, options))
        let implementations = [...constructors, destructor, ...members, ...methods, ...functions, ...globals]
        
        let includes = []

        if (withIncludes) {

            let declarationIncludes = this._declarationIncludes()
            let implementationIncludes = this._implementationIncludes()

            includes = concatIncludes(declarationIncludes, implementationIncludes)
                            .map(include => include.implementation(this._options))
        }

        //console.log(withIncludes, 'includes', includes)

        let definitions = (scope) => joinDefined(this._definitions.map(definition => definition.value(scope)))

        return `${warning.value()}
                ${joinDefined(includes)}
                ${definitions(sc.IMPLEMENTATION_GLOBAL)}
                ${this._namespace.head()}
                ${definitions(sc.IMPLEMENTATION_NAMESPACE)}
                ${joinDefined(implementations)}
                ${this._namespace.tail()}
                `
    }

    write(dest, cb = () => {}) {
        let n = this._name.toLowerCase()
        let options = this._options

        let h
        let cpp
        if (options.nameWithNamespace && options.namespace) {
            h = path.join(dest, `${options.namespace.toLowerCase()}_${n}.h`)
            cpp = path.join(dest, `${options.namespace.toLowerCase()}_${n}.cpp`)
        } else {
            h = path.join(dest, `${n}.h`)
            cpp = path.join(dest, `${n}.cpp`)
        }

        fs.writeFileSync(h, this.declaration(true))
        fs.writeFileSync(cpp, this.implementation(true))
        clangFormat(h, cpp, cb)
    }

}

function concatIncludes(declarationIncludes, implementationIncludes) {
    let names = declarationIncludes.map(include => include._name)
    return [...declarationIncludes, ...implementationIncludes.filter(include => names.indexOf(include._name) < 0)]
}

class CppNoClass extends CppClass {

    constructor(name, options = {}) {
        super(name, options)
    }

    declaration(withIncludes = true) {
        let className = this._name
        let guard = new CppGuard(className, this._options.guard)
        let warning = new CppWarning(this._options.warning)
        
        let includes = []

        if (withIncludes) {
            includes = this._declarationIncludes().map(include => include.declaration())
        }

        let functions = this._functions.map(function_ => function_.declaration(className, acc.PUBLIC))
        let externals = this._globals.map(global => global.declaration(acc.PUBLIC, false))

        let definitions = (scope) => joinDefined(this._definitions.map(forward => forward.value(scope)))

        return `${warning.value()}
                ${guard.head()}
                ${joinDefined(includes)}
                ${definitions(sc.GLOBAL)}
                ${this._namespace.head()}
                ${definitions(sc.NAMESPACE)}
                ${joinDefined(functions)}
                ${joinDefined(externals)}
                ${this._metatype}
                ${this._namespace.tail()}
                ${guard.tail()}
                `
    }
}

class CppClassSingleton extends CppClass {
    constructor(name, options = {}) {
        super(name, options)
        this.global('mInstance', pointer(name), '0', acc.PROTECTED, true)
        this.method('instance', pointer(name),'',`if (!mInstance) {mInstance = new ${name}();} return mInstance;`).static()
    }
    constructor_(implementation = '', access = acc.PROTECTED, explicit = false) {
        return CppClass.prototype.constructor_.call(this, {}, {}, {}, implementation, access, explicit)
    }
}

class CppClassGroup {
    constructor(name, options) {
        this._name = name
        this._classes = []
        this._options = defaults({includes: true, warning: true}, options)
        /**
         * @type {CppInclude[]}
         */
        this._includes = [new CppInclude(name, false, false, false)]
        /**
         * @type {CppDefinition[]}
         */
        this._definitions = []
        this._namespace = new CppNamespace(this._options.namespace)
        this._warning = new CppWarning(this._options.warning)
        this._guard = new CppGuard(name)
    }

    find(name) {
        return this._classes.find(c => c._name == name)
    }

    last() {
        return lastItem(this._classes)
    }

    push(name, options) {
        if (name instanceof CppClass) {
            this._classes.push(name)
        } else {
            this._classes.push(new CppClass(name, options))
        }
        return lastItem(this._classes)
    }

    definition(value, scope = sc.GLOBAL) {
        if (value instanceof CppDefinition) {
            this._definitions.push(value)
        } else {
            this._definitions.push(new CppDefinition(value, scope))
        }
        return lastItem(this._definitions)
    }

    include(name, header, global, forward, namespace) {
        if (name instanceof CppInclude) {
            this._includes.push(name)
        } else {
            this._includes.push(new CppInclude(name, header, global, forward, namespace))
        }
        return lastItem(this._includes)
    }

    declaration() {
        let declarations = this._classes.map(class_ => class_.declaration(this._options.includes))
        let definitions = (scope) => joinDefinedIfAny(this._definitions.map(definition => definition.value(scope)))
        return joinDefined([
            this._warning.value(),
            this._guard.head(),
            ...this._includes.map(include => include.declaration(this._options)), 
            definitions(sc.GLOBAL),
            this._namespace.head(), 
            definitions(sc.NAMESPACE),
            ...declarations,
            this._namespace.tail(),
            this._guard.tail()
        ]) + '\n'
    }

    implementation() {
        let implementations = this._classes.map(class_ => class_.implementation(this._options.includes))
        let definitions = (scope) => joinDefinedIfAny(this._definitions.map(definition => definition.value(scope)))

        let includes = this._includes.map(include => include.implementation(this._options))

        return joinDefined([
            this._warning.value(),
            ...includes, 
            definitions(sc.IMPLEMENTATION_GLOBAL),
            this._namespace.head(), 
            definitions(sc.IMPLEMENTATION_NAMESPACE),
            ...implementations,
            this._namespace.tail()]
        ) + '\n'
    }

    write(dest, cb) {
        
        let n = this._name.toLowerCase()
        let h = path.join(dest, n + '.h')
        let cpp = path.join(dest, n + '.cpp')

        fs.writeFileSync(h, this.declaration())
        fs.writeFileSync(cpp, this.implementation())
        clangFormat(h, cpp, cb)
    }

}

function matchingBracket(text, pos) {
    let open = text[pos]
    let close = open === '(' ? ')' : '}'
    let d1 = 0
    for (var i=pos;i<text.length;i++) {
        if (text[i] == open) {
            d1 += 1
        } else if (text[i] == close) {
            d1 -= 1
        }
        if (d1 == 0 && text[i] == close) {
            return i
        }
    }
}

/**
 * @param {string} text 
 */
function parseClass(text, options) {

    let [_1, className, _2, inheritanceAccess, inheritance] = text.match(/class\s+(\w+)\s*(:)?\s*(public|private|protected)?\s*(\w+)?/m)

    let body = text.substr(text.indexOf('{') + 1)

    let l = 0
    let buf = ''
    let exprs = []
    let x = [...body].forEach(c => {
        if (c == '{') {
            l += 1
        } else if (c == '}') {
            l -= 1
        }
        buf += c
        if (l == 0 && (c == '}' || c == ';')) {
            exprs.push(buf)
            buf = ''
        }
    })
    /*exprs.push(buf)
    buf = ''*/

    let access = acc.PRIVATE
    let exprs_ = exprs.map(expr => {
        let x = [[/\s*public\s*:\s*/m,acc.PUBLIC],[/\s*private\s*:\s*/m,acc.PRIVATE],[/\s*protected\s*:\s*/m,acc.PROTECTED]]
                .forEach(([label,access_]) => {
            if (expr.match(label)) {
                access = access_
                expr = expr.replace(label,'')
            }
        })
        expr = expr.replace(/^[;\s]*/,'')
        return [expr,access]
    })

    let constructors = []
    let methods = []
    let members = []
    let definitions = []
    let desctuctor

    exprs_.forEach(([expr,access]) => {
        if (expr.match(new RegExp('^' + className + '\\s*[(]'))) {
            constructors.push(parseConstructor(expr, access))
        } else if (expr.match(new RegExp('^(virtual)?\\s*~' + className + '\\s*[(]'))) {
            desctuctor = parseDestructor(expr)
        } else if (expr.match(/[(].*[)].*[{].*[}]/ms)) {
            methods.push(parseMethod(expr, access))
        } else if (expr.match(/^typedef/)) {
            definitions.push(new CppDefinition(expr, sc.CLASS))
        } else if (expr.match(/;$/m)) {
            members.push(parseMember(expr, access))
        } else if (expr.match(/^enum\s*/)) {
            definitions.push(new CppDefinition(expr + ';', sc.CLASS))
        } else if (expr.length > 0) {
            throw expr
        }
    })

    let c = new CppClass(className, options)

    if (inheritance !== undefined) {
        c.inherits(inheritance, inheritanceAccess.match(/public/m) ? acc.PUBLIC : (inheritanceAccess.match(/private/m) ? acc.PRIVATE : acc.PROTECTED))
    }

    constructors.forEach(constructor_ => c.constructor_(constructor_))
    methods.forEach(method => c.method(method))
    members.forEach(member => c.member(member))
    definitions.forEach(forward => c.definition(forward))
    if (desctuctor !== undefined) {
        c.destructor(desctuctor)
    }

    return c
    
}

function collectClassNames(classNames, ...names) {
    if (classNames === undefined) {
        classNames = []
    }
    names.forEach(name => {
        if (classNames.indexOf(name) < 0) {
            classNames = [name, ...classNames]
        }
    })
    return classNames;
}

function uniqClassNames(items) {
    let res = {}
    for(let item of items) {
        if (isString(item)) {
            if (res[item] === undefined) {
                res[item] = item
            }
        } else {
            let {name, namespace} = item
            res[name] = item
        }
    }
    return Object.values(res)
}

class CppNamedArgs {
    /**
     * @param {string} implName 
     * @param {string} proxyName 
     * @param {object} options 
     */
    constructor(implName, proxyName, options = {}) {
        this._options = defaults2({simpleTypes: [], style: 0, classNames: [implName, proxyName]}, options)
        this._options.classNames = uniqClassNames(this._options.classNames)
        this._impl = new CppClass(implName, this._options)
        this._proxy = new CppClass(proxyName, this._options)
        let implPointer = this._implPointer()
        this._proxy.member('mImpl', implPointer, undefined, defaults(this._options,{getter: false, setter: false}))
        this._proxy.constructor_({impl: implPointer})
    }

    _implPointer() {
        return pointer(this._impl._name)
    }

    _proxyRef() {
        return ref(this._proxy._name)
    }

    member(name, type, value, options) {

        let options_ = defaults(this._options, options)

        let member = this._impl.member(name, type, value, options_)

        if (options_.getter !== false) {
            let getterName = member._getter._name
            this._proxy.method(getterName, type, '', `return mImpl->${getterName}();`).const_()
        }

        if (options_.setter !== false) {
            let setterName = member._setter._name
            this._proxy.method(setterName, ref(this._proxy._name), typeSign('value', type, this._options.simpleTypes), `mImpl->${setterName}(value); return *this;`)
        }
        
        return member
    }

    /**
     * @param {string} name 
     * @param {string} type 
     * @param {string|object} signature 
     * @param {string} implementation 
     * @param {number} access 
     * @param {number} flags 
     * @returns {CppNamedArgsMethods}
     */
    method(name, type = cpp.void, signature = '', implementation = undefined, access = acc.PUBLIC, flags = 0) {
        let signatureNames_ = isObject(signature) ? Object.keys(signature).join(', ') : signatureNames(signature)
        let implCall = `mImpl->${name}(${signatureNames_})`
        let implementation_ = type === cpp.void ? `${implCall}; return *this;` : `return ${implCall};`
        let type_ = type === cpp.void ? this._proxyRef() : type
        let ret = []
        ret.push(this._proxy.method(name, type_, signature, implementation_, access, flags))
        if (implementation !== undefined) {
            ret.push(this._impl.method(name, type, signature, implementation, access, flags))
        }
        return new CppNamedArgsMethods(ret)
    }

    write(dest, cb = () => {}) {
        this._impl.write(dest, () => {
            this._proxy.write(dest, cb)
        })
    }
}

module.exports = {
    // enums 
    acc, met, qt, cpp, sc, st,

    // classes
    CppClass, CppMember, CppMethod, CppOperator, CppGetter, CppSetter, CppConstructor, CppDestructor, 
    CppGuard, CppInheritance, CppGlobal, CppNamespace, CppWarning, CppInclude, CppDefinition, 
    CppClassSingleton, CppNoClass, CppClassGroup, CppNamedArgs, CppSignature, 
    
    // parsers
    parseClass, parseDestructor, parseConstructor, parseMethod, parseMember, parseInitList, splitSignature, 
    signatureNames, stripOptional,

    // isx
    isArray, isString, isObject, isFunction, isNumber, 

    // utils
    ths, lastItem, range, uniq, defaults, defaults2,

    // type utils
    constRef, ref, pointer, constp, isRefType, typeSign,

    // name utils
    mName, wName, sName, gName, capitalized, uncapitalized
}