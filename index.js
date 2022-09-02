import SAX from './lib/sax.js';
import node from './lib/td-node.js';

function cleanup (str) {
	return str
		.replace(new RegExp('\t','g'), '\\t')
		.replace(new RegExp('\n','g'), '\\n')
		.replace(new RegExp('"','g'), '\\"');
}

export default function (xml, td) {
  if (/^\s?<!DOCTYPE\shtml>/.test(xml)) return;
	const sax = new SAX();
	sax.on('startElement', (name, attrs) => {
		if (td) {
			td.push(',[', '"' + name + '"');
		} else {
			td = ['["' + name + '"'];
		}
		if (attrs) {
			td.push(',' + JSON.stringify(attrs));
		}
	});

	sax.on('endElement', () => {
		td.push(']');
	});

	sax.on('text', (name, txt) => {
		if (txt === 'true' || txt === 'false') {
			td.push(',' + txt + '');
		} else if (/^[\+\-]?[1-9]+\.?\d+(?:[Ee][\+\-]?\d+)?$/.test(txt)) {
			td.push(',' + txt + '');
		} else {
			td.push(',"' + cleanup(txt) + '"');
		}
	});

	sax.on('processingInstructions', () => {
		/* we don't care */
	})

	sax.parse(xml.trim());
	if (td) {
		return JSON.parse(td.join(''));
	}
}

import td2xml from './lib/element.js';

export { td2xml, node };
