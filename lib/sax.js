const known = {
	'<': (ctx) => {
		ctx.start = true;
		ctx.open = false;
	},
	'start': (ctx) => {
		ctx.starttag = true;
		ctx.name.unshift('');
		ctx.attrs = '';			
	},
	'end': (ctx) => {
		ctx.tagname = ctx.name.shift();
		if (ctx.text) {
			ctx.emitter.emit('text', ctx);
			delete ctx.text;
		}
		ctx.endtag = true;
	},
	'procstart': (ctx) => {
		delete ctx.start;
		delete ctx.starttag;
	},
	'procend': (ctx) => {
		ctx.emitter.emit('processingInstructions', ctx);
	},
	'>': (ctx) => {
		ctx.attribute = false;
		ctx.open = true;

		if (ctx.starttag) {
			ctx.tagname = ctx.name[0];
			if (ctx.last === '/') {
				ctx.endtag = true;
			}
			ctx.emitter.emit('startElement', ctx);
			ctx.text = '';
			delete ctx.starttag;
		}
		if (ctx.endtag) {
			ctx.tagname = ctx.name.shift();
			ctx.emitter.emit('endElement', ctx);
			ctx.tagname = ctx.name[0];
			ctx.text = '';
			delete ctx.endtag;
		}
		ctx.starttag = false;
	},
	' ': (ctx) => {
		if (ctx.starttag) {
			ctx.attribute = true;
		}
	}
}

function parseAttrs (str) {
	if (!str) return;
	let attrs = {};
	let a = str.trim().replace(/"$/,'').split('" ');
	a.forEach(x => {
		let [key, val] = x.split('="');
		attrs[key] = val;
	})
	return attrs;
}

function Emitter () {}

Emitter.prototype.listeners = {}

Emitter.prototype.emit = function (event, ctx) {
	[].concat(ctx.emitter.listeners[event]).forEach(listener => {
		if (typeof listener === 'function') {
			if (event === 'startElement') {
				let attrs = parseAttrs(ctx.attrs);
				delete ctx.attrs;
				listener(ctx.tagname, attrs);
			} else if (event === 'text') {
				listener(ctx.tagname, ctx.text);
			} else if (event === 'endElement') {
				listener(ctx.tagname);
			} else if (event === 'processingInstructions') {
				listener();
			}
		}
	});
}

function Parser () {
	this.emitter = new Emitter();
	this.emitter.listeners = {};
}

Parser.prototype.on = function (event, callback) {
	this.emitter.listeners[event] || (this.emitter.listeners[event] = []);
	this.emitter.listeners[event].push(callback);
}

Parser.prototype.parse = function (xml) {
	let iterator = xml[Symbol.iterator]();
	let ctx = {name:[]}
	ctx.emitter = this.emitter;
	var c = iterator.next();
	while (!c.done) {
		(typeof known[c.value] === 'function') && known[c.value](ctx);
		if (ctx.last === '<' && ctx.text) {
			ctx.emitter.emit('text', ctx);
			delete ctx.text;
		}
		if (ctx.last === '<' && c.value === '?') {
			known.procstart(ctx);
		} else
		if (ctx.last === '?' && c.value === '>') {
			known.procend(ctx);
		} else
		if (ctx.last === '<' && c.value === '/') {
			ctx.name.shift();
			delete ctx.starttag;
			ctx.endtag = true;
			ctx.open = false;
		} else
		if (ctx.start) {
			delete ctx.start;
			if (c.value === '/') {
				known.end(ctx);
			} else {
				known.start(ctx);
			}
		} else if (ctx.starttag && !(ctx.attribute) && c.value !== '<') {
			if (c.value === '/') {
				ctx.endtag = true;
			} else {
				ctx.name[0] += c.value;
			}
		} else if (ctx.attribute) {
			if (ctx.last === '"' && c.value === '/') {
				ctx.endtag = true;
			} else {
				ctx.attrs += c.value;
			}
		} else if (ctx.open && c.value !== '<' && c.value !== '>' && c.value !== undefined) {
			ctx.text += c.value;
		}
		ctx.last = c.value;
		c = iterator.next();
	}
}

export default Parser;