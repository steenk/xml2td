import assert from 'assert';
import xml2td, { td2xml, node } from './index.js';

describe('Test simple XMLs', () => {
	it('should work', () => {
		let str = '<root><test nr="1"/></root>';
		let td = xml2td(str);
		let xml = td2xml(td);
		assert.equal(str, xml);
	});
	it('should also work', () => {
		let str = '<root><test nr="2">hello</test></root>';
		let td = xml2td(str);
		let xml = td2xml(td);
		assert.equal(str, xml);
	});
	it('should also work with boolean', () => {
		let str = '<root><test nr="3" with="bool">true</test><test>false</test></root>';
		let td = xml2td(str);
		let xml = td2xml(td);
		assert.equal(str, xml);
	});
	it('should also work with numbers', () => {
		let str = '<root><test nr="4" with="number">678</test><test>90.7</test><test>1.2e-3</test></root>';
		let td = xml2td(str);
		let xml = td2xml(td);
		assert.equal('<root><test nr="4" with="number">678</test><test>90.7</test><test>0.0012</test></root>', xml);
	});
	it('should also work with spaces', () => {
		let str = '<root>\t  <test nr="5" with="spaces">678 </test>\n<test>hello</test>\n<test>\t\t</test> </root>';
		let td = xml2td(str);
		let xml = td2xml(td);
		assert.equal(str, xml);
	});
	it('should recognize processing instructions', () => {
		let str = '<?xml version="1.0" encoding="UTF-8"?><root/>';
		let td = xml2td(str);
		assert.equal('root', td[0]);
	});
});
describe('Test a node chain', () => {
	const xml = `<root>
		<test nr="4" with="number">678</test>
		<test>90.7</test><test>0.0012</test>
	</root>`;
	const td = xml2td(xml);
	it('should be undefined when passing xml', () => {
		let elem = node(xml);
		assert.equal(elem.type, undefined);
	})
	it('should be "element" when passing tdstruct', () => {
		let elem = node(xml2td(xml));
		assert.equal(elem.type, 'element');
	})
	it('should be "fraction" when getting multiple elements', () => {
		let elem = node(xml2td(xml)).node('test');
		assert.equal(elem.type, 'fraction');
	})
	it('should have the right size count of multiple elements', () => {
		let elem = node(xml2td(xml)).node('test');
		assert.equal(elem.size, 3);
	})
	it('should get the second of multiple elements when asking for 1', () => {
		let elem = node(xml2td(xml)).node('test').node(1);
		assert.equal(JSON.stringify(elem.content), '["test","90.7"]');
	})
	it('should give undefined when asking for "nonsence"', () => {
		let elem = node(xml2td(xml)).node('test').node(1).node('nonsence');
		assert.equal(JSON.stringify(elem.content), undefined);
	})
	it('should convert back', () => {
		let td = xml2td(xml);
		let xml2 = td2xml(td);
		assert.equal(xml, xml2);
	});
	it('should get the text of a node', () => {
		let str = '<root><example><test nr="2">hello</test></example></root>';
		let td = xml2td(str);
		let xml = td2xml(td);
		let hello = node(td).node('example').node('test').text;
		assert.equal(hello, 'hello');
	})
	it('should recognize closed elements', () => {
		let xml = '<root><test nr="1"/><test/><test/></root>';
		let td = xml2td(xml);
		let fract = node(td).node('test');
		assert.equal(fract.size, 3); 
	})
})


