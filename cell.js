function Cell(model) {
    this.value = "";
    this.view = null;
    this.formula = null;
    this.model = model;
    this.forward = new Set();
    this.address = null;
    this.bold = false;
    this.italic = false;
    this.underline = false;
    this.backgroundColored = false;
    this.backgroundColor = "";
    this.originalBackgroundColor = "";
    this.textColor = "";
    this.borderStyle = "";
}


Cell.prototype = {

    getValue: function () {
        return this.value;
    },

    setValue: function (v) {
        this.value = v;
        if (typeof this.view.notify == "function")
            this.view.notify(this);
    },

    getView: function () {
        return this.view;
    },
    setView: function (v) {
        this.view = v;
    },

    getFormula: function () {
        return this.formula;
    },

    setFormula: function (s, address) {
        var f = Formula.parse(s, this.model); //peut lever une exception rattrapée dans le controleur

        var old_f = this.formula;
        var model = this.model;
        if (old_f) {

            var cellRefs = old_f.getCellRefs();
            cellRefs.forEach(function (k, v, s) {
                var coords = v.split(',');
                var cell = model.getCell(coords[0], coords[1]);
                if (cell)
                    cell.forward.delete(address);
            });
        }

        var cellRefs = f.getCellRefs();
        cellRefs.forEach(function (k, v, s) {
            var coords = v.split(',');
            var cell = model.getCell(coords[0], coords[1]);
            if (cell)
                cell.forward.add(address);
        });

        this.formula = f;
        this.address = address;
        this.update(new Set());
    },

    update: function (visited) {

        if (visited.has(this.address))
            throw "Cyclic definition of cell " + this.address.split(',').join("");

        visited.add(this.address);
        if (this.formula != null)
            this.setValue(this.formula.eval());
        var model = this.model;
        this.forward.forEach(function (k, v, s) {
            var coords = v.split(',');
            var cell = model.getCell(coords[0], coords[1]);
            cell.update(visited);
        });

    },

    isBold: function () {
        return this.bold;
    },
    isItalic: function () {
        return this.italic;
    },
    isUnderlined: function () {
        return this.underline;
    },
    isBackgroundColored: function () {
        return this.backgroundColored;
    },
    setBold: function () {
        this.isBold() ? this.bold = false : this.bold = true;
        this.update(new Set());
    },
    setUnderline: function () {
        this.isUnderlined() ? this.underline = false : this.underline = true;
        this.update(new Set());
    },
    setItalic: function () {
        this.isItalic() ? this.italic = false : this.italic = true;
        this.update(new Set());
    },
    setBackgroundColor: function (color) {
        this.backgroundColor = color;
        this.update(new Set());
    },
    getBackgroundColor: function () {
        return this.backgroundColor;
    },
    setOriginalBackgroundColor : function (color) {
        this.originalBackgroundColor = color;
        this.update(new Set());
    },
    getOriginalBackgroundColor : function () {
        return this.originalBackgroundColor;
    },
    setTextColor: function (color) {
        this.textColor = color;
        this.update(new Set());
    },
    getTextColor : function () {
        return this.textColor;
    },
    setBorderStyle : function(style) {
        this.borderStyle = style;
        this.update(new Set());
    },

    getBorderStyle : function () {
        return this.borderStyle;
    }
};
