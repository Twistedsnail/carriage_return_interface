const Blockly = require("blockly");

var alpha_keys = [
    ["a / A", "KEY_A"],
    ["b / B", "KEY_B"],
    ["c / C", "KEY_C"],
    ["d / D", "KEY_D"],
    ["e / E", "KEY_E"],
    ["f / F", "KEY_F"],
    ["g / G", "KEY_G"],
    ["h / H", "KEY_H"],
    ["i / I", "KEY_I"],
    ["j / J", "KEY_J"],
    ["k / K", "KEY_K"],
    ["l / L", "KEY_L"],
    ["m / M", "KEY_M"],
    ["n / N", "KEY_N"],
    ["o / O", "KEY_O"],
    ["p / P", "KEY_P"],
    ["q / Q", "KEY_Q"],
    ["r / R", "KEY_R"],
    ["s / S", "KEY_S"],
    ["t / T", "KEY_T"],
    ["u / U", "KEY_U"],
    ["v / V", "KEY_V"],
    ["w / W", "KEY_W"],
    ["x / X", "KEY_X"],
    ["y / Y", "KEY_Y"],
    ["z / Z", "KEY_Z"],
    ["1 / !", "KEY_1"],
    ["2 / @", "KEY_2"],
    ["3 / #", "KEY_3"],
    ["4 / $", "KEY_4"],
    ["5 / %", "KEY_5"],
    ["6 / ^", "KEY_6"],
    ["7 / &", "KEY_7"],
    ["8 / *", "KEY_8"],
    ["9 / (", "KEY_9"],
    ["0 / )", "KEY_0"]
];

var function_keys = [
    ["ENTER", "KEY_ENTER"],
    ["ESCAPE", "KEY_ESCAPE"],
    ["BACKSPACE", "KEY_BACKSPACE"],
    ["TAB", "KEY_TAB"],
    ["SPACE", "KEY_SPACE"],
    ["F1", "KEY_F1"],
    ["F2", "KEY_F2"],
    ["F3", "KEY_F3"],
    ["F4", "KEY_F4"],
    ["F5", "KEY_F5"],
    ["F6", "KEY_F6"],
    ["F7", "KEY_F7"],
    ["F8", "KEY_F8"],
    ["F9", "KEY_F9"],
    ["F10", "KEY_F10"],
    ["F11", "KEY_F11"],
    ["F12", "KEY_F12"]
];

var symbol_keys = [
    ["- / _", "KEY_MINUS"],
    ["= / +", "KEY_EQUALS"],
    ["[ / {", "KEY_LEFTBRACE"],
    ["] / }", "KEY_RIGHTBRACE"],
    ["\\ / |", "KEY_BACKSLASH"],
    ["; / :", "KEY_SEMICOLON"],
    ["\' / \"", "KEY_APOSTROPHE"],
    ["\` / ~", "KEY_GRAVE"],
    [", / <", "KEY_COMMA"],
    [". / >", "KEY_PERIOD"],
    ["/ / ?", "KEY_FORWARDSLASH"]
];

key_modes = [
    ["Alphanumeric", "KEYS_ALPHA"],
    ["Function", "KEYS_FUNCTION"],
    ["Symbols", "KEYS_SYMBOL"]
]

Blockly.Extensions.register('key_type_validator', function() {
    var this_block = this;
    var mode_field = this_block.getField('KEY_MODE');
    mode_field.setValidator(function(val) {
        var parent_block = this.getSourceBlock();
        var dummy = parent_block.getInput('KEY_VALUE_DUMMY');
        dummy.removeField('KEY_VALUE', true);

        if(val == "KEYS_ALPHA") {
            dummy.appendField(new Blockly.FieldDropdown(alpha_keys), 'KEY_VALUE');
        }
        else if(val == "KEYS_FUNCTION") {
            dummy.appendField(new Blockly.FieldDropdown(function_keys), 'KEY_VALUE');
        }
        else if(val == "KEYS_SYMBOL") {
            dummy.appendField(new Blockly.FieldDropdown(symbol_keys), 'KEY_VALUE');
        }

        return val;
    });
});

Blockly.defineBlocksWithJsonArray([
    {
        "type": "start_type",
        "message0": "Program name: %1 %2",
        "args0": [
            {
                "type": "field_input",
                "name": "PROGRAM_NAME",
                "text": "test_1"
            },
            {
                "type": "input_statement",
                "name": "PROGRAM_CODE"
            }
        ]
    },
    {
        "type": "string_typer",
        "message0": "Type %1",
        "args0": [
            {
                "type": "field_input",
                "name": "STRING_INPUT",
                "text": "hello world"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "color": 230
    },
    {
        "type": "key_selector",
        "message0": "Group %1 key %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "KEY_MODE",
                "options": key_modes
            },
            {
                "type": "input_dummy",
                "name": "KEY_VALUE_DUMMY",
                "value": "a / A"
            }
        ],
        "output": "Key",
        "extensions": ["key_type_validator"]
    },
    {
        "type": "modifier_type",
        "message0": "Use modifiers %1",
        "args0": [
            {
                "type": "input_dummy",
                "name": "MODIFIERS_DUMMY"
            }
        ],
        "message1": "Left - CTRL: %1 SHIFT:%2 ALT:%3 META:%4",
        "args1": [
            {
                "type": "field_checkbox",
                "name": "CHECK_LCTRL"
            },
            {
                "type": "field_checkbox",
                "name": "CHECK_LSHIFT"
            },
            {
                "type": "field_checkbox",
                "name": "CHECK_LALT"
            },
            {
                "type": "field_checkbox",
                "name": "CHECK_LMETA"
            }
        ],
        "message2": "Reft - CTRL: %1 SHIFT:%2 ALT:%3 META:%4",
        "args2": [
            {
                "type": "field_checkbox",
                "name": "CHECK_RCTRL"
            },
            {
                "type": "field_checkbox",
                "name": "CHECK_RSHIFT"
            },
            {
                "type": "field_checkbox",
                "name": "CHECK_RALT"
            },
            {
                "type": "field_checkbox",
                "name": "CHECK_RMETA"
            }
        ],
        "message3": "%1",
        "args3": [
            {
                "type": "input_statement",
                "name": "MODIFIER_STATEMENT"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "color": 230
    },
    {
        "type": "delay_type",
        "message0": "delay %1 ms",
        "args0": [
            {
                "type": "field_number",
                "name": "DELAY_NUMBER",
                "value": 1
            }
        ],
        "previousStatement": null,
        "nextStatement": null
    },
    {
        "type": "tap_type",
        "message0": "Tap %1",
        "args0": [
            {
                "type": "input_value",
                "name": "TAP_KEY",
                "checks": "Key"
            }
        ],
        "previousStatement": null,
        "nextStatement": null
    },
    {
        "type": "hold_type",
        "message0": "Hold %1",
        "args0": [
            {
                "type": "input_value",
                "name": "HOLD_KEY",
                "checks": "Key"
            }
        ],
        "message1": "%1",
        "args1": [
            {
                "type": "input_statement",
                "name": "HOLD_STATEMENT"
            }
        ],
        "previousStatement": null,
        "nextStatement": null
    }
]);

var carriage_return_toolbox = `
    <xml id="toolbox" style="display: none">
        <block type="string_typer"></block>
        <block type="key_selector"></block>
        <block type="modifier_type"></block>
        <block type="delay_type"></block>
        <block type="tap_type"></block>
        <block type="hold_type"></block>
    </xml>
`;
var start_space = `
    <xml>
        <block type="start_type" deletable="false" movable="false">
        </block>
    </xml>
`;

const custom_generator = new Blockly.Generator('CRKM');
custom_generator.PRECEDENCE = 0;

function to_hex(num_in) {
    var str = num_in.toString(16).toUpperCase();
    while (str.length < 2) {
        str = '0' + str;
    }
    return str + ' ';
}

function str_to_hex(str_in) {
    var str_out = '';

    for(var n = 0; n < str_in.length; n ++) {
        str_out = str_out + to_hex(str_in.charCodeAt(n) & 0xff);
    }

    return str_out;
}

custom_generator.scrub_ = function(block, code, opt_thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = opt_thisOnly ? '' : custom_generator.blockToCode(nextBlock);
    return code +  nextCode;
}

custom_generator['start_type'] = function(block) {
    var name = block.getFieldValue('PROGRAM_NAME');
    var code = custom_generator.statementToCode(block, 'PROGRAM_CODE').trimStart();
    var len = name.length;
    var total_len = len + (code.length / 3) + 1;
    return to_hex(total_len) + to_hex(len) + str_to_hex(name) + code;
};

custom_generator['string_typer'] = function(block) {
    var text = block.getFieldValue('STRING_INPUT');
    var len = to_hex(text.length);
    var code = to_hex(2);

    return code + len + str_to_hex(text);
}