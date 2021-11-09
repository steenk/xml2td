export default function element (array) {
	let closed, content, n = 0;
	let str = '<' + array[0];
	for (let i=1; i<array.length; i++) {
		if (Array.isArray(array[i])) {
			content = true;
			!n && (str += '>');
			closed = true;
			str += element(array[i]);
			n++;
		} else if (typeof array[i] === 'object' && array[i] !== null) {
			Object.entries(array[i]).forEach(ent => {
				str += ' ' + ent[0] + '="' + String(ent[1]).trim() + '"';
			})
		} else {
			if (array[i] === null) {
				content = false;
			} else {
				content = true;
				if (!closed) str += '>';
				closed = true;
				str += array[i];
			}
		}
	}
	if (!closed) str += '>';
	if (content) {
		str += '</' + array[0] + '>';
	} else {
		str = str.slice(0, -1) + '/>';
	}
	return str;
}
