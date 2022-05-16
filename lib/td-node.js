
function node (td) {
    const self = this;
    let n = function () {};
    n.node = node;
    if (Array.isArray(td) && typeof td[0] === 'string') {
        n.type = 'element';
        n.tagname = td[0];
        n.content = td;
        n.text = td.slice(1).filter(x => { return typeof(x) !== 'object'}).join('');
        let attr = td.filter(x => { return typeof(x) === 'object' && !Array.isArray(x)});
        if (attr.length) {
            n.attributes = attr[0];
        } else {
            n.attributes = {};
        }
        return n;
    }
    if (self) {
        if (typeof td === 'string' && Array.isArray(self.content)) {
            let sub = self.content.filter(x => {return Array.isArray(x) && x[0] === td});
            if (sub.length === 1) {
                n.tagname = td;
                n.type = 'element';
                n.content = sub[0];
                n.size = 1;
                let attr = n.content.filter(x => { return typeof(x) === 'object' && !Array.isArray(x)});
                if (attr.length) n.attributes = attr[0];
                n.text = sub[0].slice(1).filter(x => { return typeof(x) !== 'object'}).join('');
            } else if (sub.length > 1) {
                n.tagname = td;
                n.type = 'fraction';
                n.content = sub;
                n.size = sub.length;
            }
        } else if (typeof td === 'number' && self.size) {
            let sub = node(self.content[td]);
            n.tagname = sub.tagname;
            n.type = sub.type;
            n.content = sub.content;
            if (sub.type === 'fraction') n.size = sub.size;
            n.text = sub.text;
            n.attributes = sub.attributes || {};
        } else if (Array.isArray(td) && typeof td[0] === 'string') {
            n.node.type = 'element';
            n.node.name = td[0];
        } else {
        }
    }
    return n;
}


export default node;