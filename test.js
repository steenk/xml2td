import assert from 'assert';
import xml2td, { td2xml } from './index.js';

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
		//console.log('JSON:', td);
		let xml = td2xml(td);
		//console.log('XML:', xml);
		assert.equal(str, xml);
	});
})