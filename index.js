import SAX from './lib/sax.js';

export default function (xml, td) {
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
		} else if (/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/.test(txt)) {
			td.push(',' + txt + '');
		} else {
			td.push(',"' + txt + '"');
		}
	})

	sax.parse(xml);

	return td.join('');
}

import td2xml from './lib/element.js';

export { td2xml };