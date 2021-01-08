var fs = require("fs");

var custom_crc_table = new Uint32Array(256);
const poly = 0x04C11DB7;

function int_to_bytes(i) {
	var array = [(i >>> 24) & 0xFF, (i >>> 16) & 0xFF, (i >>> 8) & 0xFF, i & 0xFF];
    return array;
}

function generate_crc32_table(_poly) {
    for(var i = 0; i < 256; i ++) {
		c = i << 24;

        for(var j = 0; j < 8; j ++) {
			if(c & 0x80000000) {
				c = (c << 1) ^ _poly;
			}
			else {
				c = c << 1;
			}
		}

        custom_crc_table[i] = c & 0xffffffff;
	}
}

function custom_crc32(buf) {
    var crc = 0xffffffff;

    for(var ind = 0; ind < buf.length; ind ++) {
        b = int_to_bytes(buf[ind]);

        for (var b_ind = 0; b_ind < b.length; b_ind ++) {
			crc = ((crc << 8) & 0xffffffff) ^ custom_crc_table[(crc >> 24) & 0xff ^ b[b_ind]];
			crc = crc >>> 0;
		}
	}

    return crc;
}

const FLASH_WORD_SIZE = 0x20000 / 4;

function get_file_crc(file) {
	var words = new Uint32Array(file);
	var data = new Uint32Array(FLASH_WORD_SIZE);
	data.fill(0xFFFFFFFF);
	for(var n = 0; n < words.length; n ++) {
		data[n] = words[n];
	}
	fs.appendFileSync("output.bin", Buffer.from(data));
	console.log(custom_crc32(data));
}

generate_crc32_table(poly);

module.exports = {get_file_crc};