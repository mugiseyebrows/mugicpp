function parseEnum(namespace, text) {

    let m = text.match(/enum (\w+)\s*[{](.*)[}]/ms)

    if (m === null) {
        console.log(text)
        return {}
    }
    
    let [_, name, values_] = m
    let arg = ''
    let comment = false
    let value = false
    let values = []
    values.push(name.trim())
    let x = [...values_].forEach((c,i) => {
        
        if (c === '/' && values_[i+1] === '/') {
            comment = true
        }
        if (c === '\n') {
            comment = false
        }
        if (c === '=' && !comment) {
            value = true
        }
        if (c === ',' && !comment) {
            values.push(arg.trim())
            arg = ''
            value = false
        } else {
            if (!comment && !value) {
                arg = arg + c
            }
        }
    })
    values.push(arg.trim())
    return values.reduce((p,c) => {
        p[c] = `${namespace}::${c}`
        return p
    }, {})
}

let enums =
    `enum Orientation {
        Horizontal = 0x1,
        Vertical = 0x2
    };
    enum MouseButton {
        NoButton         = 0x00000000,
        LeftButton       = 0x00000001,
        RightButton      = 0x00000002,
        MidButton        = 0x00000004, // ### Qt 6: remove me
        MiddleButton     = MidButton,
        BackButton       = 0x00000008,
        XButton1         = BackButton,
        ExtraButton1     = XButton1,
        ForwardButton    = 0x00000010,
        XButton2         = ForwardButton,
        ExtraButton2     = ForwardButton,
        TaskButton       = 0x00000020,
        ExtraButton3     = TaskButton,
        ExtraButton4     = 0x00000040,
        ExtraButton5     = 0x00000080,
        ExtraButton6     = 0x00000100,
        ExtraButton7     = 0x00000200,
        ExtraButton8     = 0x00000400,
        ExtraButton9     = 0x00000800,
        ExtraButton10    = 0x00001000,
        ExtraButton11    = 0x00002000,
        ExtraButton12    = 0x00004000,
        ExtraButton13    = 0x00008000,
        ExtraButton14    = 0x00010000,
        ExtraButton15    = 0x00020000,
        ExtraButton16    = 0x00040000,
        ExtraButton17    = 0x00080000,
        ExtraButton18    = 0x00100000,
        ExtraButton19    = 0x00200000,
        ExtraButton20    = 0x00400000,
        ExtraButton21    = 0x00800000,
        ExtraButton22    = 0x01000000,
        ExtraButton23    = 0x02000000,
        ExtraButton24    = 0x04000000,
        AllButtons       = 0x07ffffff,
        MaxMouseButton   = ExtraButton24,
        // 4 high-order bits remain available for future use (0x08000000 through 0x40000000).
        MouseButtonMask  = 0xffffffff
    };
    enum Orientation {
        Horizontal = 0x1,
        Vertical = 0x2
    };
    enum SortOrder {
        AscendingOrder,
        DescendingOrder
    };
    enum AlignmentFlag {
        AlignLeft = 0x0001,
        AlignLeading = AlignLeft,
        AlignRight = 0x0002,
        AlignTrailing = AlignRight,
        AlignHCenter = 0x0004,
        AlignJustify = 0x0008,
        AlignAbsolute = 0x0010,
        AlignHorizontal_Mask = AlignLeft | AlignRight | AlignHCenter | AlignJustify | AlignAbsolute,

        AlignTop = 0x0020,
        AlignBottom = 0x0040,
        AlignVCenter = 0x0080,
        AlignBaseline = 0x0100,
        // Note that 0x100 will clash with Qt::TextSingleLine = 0x100 due to what the comment above
        // this enum declaration states. However, since Qt::AlignBaseline is only used by layouts,
        // it doesn't make sense to pass Qt::AlignBaseline to QPainter::drawText(), so there
        // shouldn't really be any ambiguity between the two overlapping enum values.
        AlignVertical_Mask = AlignTop | AlignBottom | AlignVCenter | AlignBaseline,

        AlignCenter = AlignVCenter | AlignHCenter
    };
    enum ScrollBarPolicy {
        ScrollBarAsNeeded,
        ScrollBarAlwaysOff,
        ScrollBarAlwaysOn
    };

    enum CaseSensitivity {
        CaseInsensitive,
        CaseSensitive
    };
    enum CheckState {
        Unchecked,
        PartiallyChecked,
        Checked
    };
    enum ItemDataRole {
        DisplayRole = 0,
        DecorationRole = 1,
        EditRole = 2,
        ToolTipRole = 3,
        StatusTipRole = 4,
        WhatsThisRole = 5,
        // Metadata
        FontRole = 6,
        TextAlignmentRole = 7,
        BackgroundColorRole = 8,
        BackgroundRole = 8,
        TextColorRole = 9,
        ForegroundRole = 9,
        CheckStateRole = 10,
        // Accessibility
        AccessibleTextRole = 11,
        AccessibleDescriptionRole = 12,
        // More general purpose
        SizeHintRole = 13,
        InitialSortOrderRole = 14,
        // Internal UiLib roles. Start worrying when public roles go that high.
        DisplayPropertyRole = 27,
        DecorationPropertyRole = 28,
        ToolTipPropertyRole = 29,
        StatusTipPropertyRole = 30,
        WhatsThisPropertyRole = 31,
        // Reserved
        UserRole = 0x0100
    };
    enum ItemFlag {
        NoItemFlags = 0,
        ItemIsSelectable = 1,
        ItemIsEditable = 2,
        ItemIsDragEnabled = 4,
        ItemIsDropEnabled = 8,
        ItemIsUserCheckable = 16,
        ItemIsEnabled = 32,
        ItemIsAutoTristate = 64,
        ItemNeverHasChildren = 128,
        ItemIsUserTristate = 256
    };
    enum TextElideMode {
        ElideLeft,
        ElideRight,
        ElideMiddle,
        ElideNone
    };`
   


let result = enums.split(';').map(enum_ => parseEnum('Qt', enum_)).reduce((p,c) => ({...p,...c}))

console.log(result)