var TableView = function (id, tableModel) {
    this.model = tableModel;

    this.div = document.createElement("div");
    this.div.id = "spreadsheet-div";


    var target = document.getElementById(id);
    if (target)
        target.appendChild(this.div);


    this.input = document.createElement("input");
    this.input.type = "text";
    this.div.appendChild(this.input);

    this.button = document.createElement("button");
    this.button.innerHTML = "&#10003;";
    this.div.appendChild(this.button);

    //We add the bold button, right next to the validate button
    this.buttonBold = document.createElement("button");
    this.buttonBold.id = "button-bold";
    this.buttonBold.className = "button-style";
    this.div.appendChild(this.buttonBold);

    //We add the underline button, right next to the bold button
    this.buttonUnderline = document.createElement("button");
    this.buttonUnderline.id = "button-underline";
    this.buttonUnderline.className = "button-style";
    this.div.appendChild(this.buttonUnderline);

    //We add the italic button, right next to the underline button
    this.buttonItalic = document.createElement("button");
    this.buttonItalic.id = "button-italic";
    this.buttonItalic.className = "button-style";
    this.div.appendChild(this.buttonItalic);

    this.table = document.createElement("table");
    this.div.appendChild(this.table);
};

TableView.prototype.createTable = function () {
    var model = this.model;
    var table = this.table;


    //Clear the table

    for (var c = table.firstChild; c != null; c = c.nextSibling)
        table.removeChild(c);


    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);
    tr.appendChild(document.createElement("th"));

    model.forEachCol(function (c) {
        var th = document.createElement("th");
        th.appendChild(document.createTextNode(c));
        tr.appendChild(th);
    });

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    model.forEachRow(function (j) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        var td = document.createElement("td");
        var text = document.createTextNode(j);
        td.appendChild(text);
        tr.appendChild(td);
        model.forEachCol(function (i) {
            var cell = model.getCell(i, j);
            var td = document.createElement("td");
            cell.setView(td);

            //monkey patching
            td.row = j;
            td.col = i;

            td.notify = function (cell) {
                td.firstChild.nodeValue = cell.getValue();
            };

            td.isSelected = function () {
                return this.classList.contains("selected");
            };

            td.select = function (b) {
                if (b)
                    this.classList.add("selected");
                else
                    this.classList.remove("selected");
            };

            var text = document.createTextNode(cell.getValue());
            td.appendChild(text);
            tr.appendChild(td);
        });

    });


};
