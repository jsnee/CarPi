// *********************************************************************************
//   String & Array prototype helpers
// *********************************************************************************

String.prototype.contains = function (value) {
	return this.indexOf(value) != -1;
};

String.prototype.startsWith = function (value) {
	return this.indexOf(value) == 0;
};

String.prototype.endsWith = function (suffix) {
	return this.indexOf(suffix, this.length - suffix.length) != -1;
};

String.prototype.format = function () {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function (match, number) {
		return (args[number] != undefined ? args[number] : '');
	});
};

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

String.prototype.replaceAll = function (search, replace) {
    if (search instanceof Array) {
        if (search.length < 1) return this;
        if (search.length == 1) return this.replaceAll(search[0][0], search[0][1]);
        else return this.replaceAll([search.shift()]).replaceAll(search);
    }
    return this.split(search).join(replace);
};

if (!String.prototype.trim) {
	String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); };
}

String.prototype.padLeft = function (pad, length) {
	var str = this;
	while (str.length < length) str = pad + str;
	return str;
}

Number.prototype.currency = function () {
	return "$" + this.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
};

if (!Array.prototype.forEach) {
	Array.prototype.forEach = function (func) {
		for (var i = 0; i < this.length; i++) func.call(this[i], this[i]);
	};
}

if (!Array.prototype.select) {
    Array.prototype.select = function (func) {
        var list = [];
        for (var i = 0; i < this.length; i++) list.push(func.call(this[i], this[i]));
        return list;
    };
}

if (!Array.prototype.orderBy) {
    Array.prototype.orderBy = function (field, descending, nullHigh) {
        if (!field) return this;
        var reverse = descending ? -1 : 1;
        return this.sort(function (a, b) {
            var koA = ko.unwrap(a[field]), koB = ko.unwrap(b[field]);
            if (nullHigh && koA != koB && [koA, koB].contains(null)) {
                if (koA < koB) return reverse;
                if (koA > koB) return -1 * reverse;
            }
            if (koA < koB) return -1 * reverse;
            if (koA > koB) return reverse;
            return 0;
        });
    }
}

Array.prototype.contains = function (value) {
	for (var i = 0; i < this.length; i++) if (this[i] == value) return true;
	return false;
};

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (value) {
		for (var i = 0; i < this.length; i++) if (this[i] == value) return i;
		return -1;
	};
}

Array.prototype.list = function (func) {
	var list = [];
	for (var i = 0; i < this.length; i++) if (func.call(this[i], this[i])) list.push(this[i]);
	return list;
};

Array.prototype.where = Array.prototype.list;

Array.prototype.find = function (func) {
	for (var i = 0; i < this.length; i++) if (func.call(this[i], this[i])) return this[i];
	return null;
};

Array.prototype.any = function (func) {
    for (var i = 0; i < this.length; i++) if (func.call(this[i], this[i])) return true;
    return false;
};

Array.prototype.all = function (func) {
    for (var i = 0; i < this.length; i++) if (!func.call(this[i], this[i])) return false;
    return true;
};

Array.prototype.sum = function (func) {
    var sum = 0;
    for (var i = 0; i < this.length; i++) sum += func.call(this[i], this[i]);
    return sum;
};

Array.prototype.remove = function (value) {
	value = core.makeArray(value);
	for (var v = 0; v < value.length; v++) {
		for (var i = this.length - 1; i >= 0; i--) {
			if (this[i] == value[v]) this.splice(i, 1);
		}
	}
	return this;
};

Array.prototype.backwards = function () {
    var result = this.concat([]);
    result.reverse();
    return result;
};