import assert from 'assert';
import xml2td, { td2xml } from './index.js';

describe('Test simple XML', () => {
	it('should work', () => {
		let str = '<root><test nr="1"/></root>';
		let td = xml2td(str);
		console.log(td);
		let xml = td2xml(JSON.parse(td));
		console.log(xml);
		assert.equal(str, xml);
	});
	it('should also work', () => {
		let str = '<root><test nr="2">hello</test></root>';
		let td = xml2td(str);
		console.log(td);
		let xml = td2xml(JSON.parse(td));
		console.log(xml);
		assert.equal(str, xml);
	});
	it('should also work with boolean', () => {
		let str = '<root><test nr="3" with="bool">true</test><test>false</test></root>';
		let td = xml2td(str);
		console.log(td);
		let xml = td2xml(JSON.parse(td));
		console.log(xml);
		assert.equal(str, xml);
	});
	it('should also work with numbers', () => {
		let str = '<root><test nr="3" with="number">678</test><test>90.7</test><test>1.2e-3</test></root>';
		let td = xml2td(str);
		console.log(td);
		let xml = td2xml(JSON.parse(td));
		console.log(xml);
		assert.equal('<root><test nr="3" with="number">678</test><test>90.7</test><test>0.0012</test></root>', xml);
	});
})