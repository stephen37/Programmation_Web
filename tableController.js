var borderStyleEnum = {
    DOTTED: "dotted",
    DASHED: "dashed",
    SOLID: "solid",
    NONE: "none"
};

var TableController = function (view) {

    var this_ = this;

    if (!(view instanceof TableView))
        throw "Invalid view";

    function findTD(obj) {
        if (!obj || obj.nodeName == "TD") return obj
        else findTD(obj.parentNode);
    };


    this_.selection = null;
    this_.multipleSelection = null;
    this_.cellSelected = null;
    this_.tdOrigin = null;
    this_.listSelectedCells = [];


    /*
     * This is where the click listener for the mouse is handle. Here we can select multiples cases with the mouse.
     */

    function tdClickHandler(e) {


        var td = findTD(e.target);

        if (!td) {
            this_.selection = null;
            return;
        }

        if (this_.selection)
            this_.selection.select(false);
        this_.selection = td;
        this_.selection.select(true);
        if (!(e.metaKey || e.ctrlKey)) {
            this_.tdOrigin = td;
            for (var i = 0; i < this_.listSelectedCells.length; i++) {
                //if (this_.listSelectedCells[i].getOriginalBackgroundColor() == "#CCFFFF") {
                //TODO : I have to handle the background color change when we unselect the group of cells.
                this_.listSelectedCells[i].setBackgroundColor("#FFFFFF");
                //}
            }
            this_.listSelectedCells = []; // We update the original cell only if we don't click on the ctrl or meta key (Mac OS).
        } else {
            console.log("on n'a pas appuyé sur ctrl");
        }


        var cell = view.model.getCell(td.col, td.row);
        var form = cell.getFormula();
        view.input.value = form ? '=' + form.toString() : "";

        //focus the input.

        setTimeout(function () {
            view.input.focus();
        }, 100);

    };


    view.table.addEventListener("mousedown", tdClickHandler);


    function buttonClickHandler(e) {
        var td = this_.selection;
        if (!td) return;
        var s = view.input.value;
        var cell = view.model.getCell(td.col, td.row);

        //test if it is a formula:
        var res = s.match(/^=(.*)$/);
        try {
            var address = td.col + "," + td.row;
            if (res)
                cell.setFormula(res[1], address);
            else
                cell.setFormula('"' + s + '"', address);
        } catch (e) {
            alert(e);
        }
    };

    /*
     Listeners for the buttons Italic, Bold and Underline
     */
    function buttonBoldClickHandler(e) {
        var td = this_.selection;
        if (!td) return;
        var cell = view.model.getCell(td.col, td.row);
        if (this_.listSelectedCells.length != 0) {
            for (var i = 0; i < this_.listSelectedCells.length; i++) {
                this_.listSelectedCells[i].setBold();
            }
        } else {
            cell.setBold();
        }

    };

    function buttonUnderlineClickHandler(e) {
        var td = this_.selection;
        if (!td) return;
        var cell = view.model.getCell(td.col, td.row);
        if (this_.listSelectedCells.length != 0) {
            for (var i = 0; i < this_.listSelectedCells.length; i++) {
                this_.listSelectedCells[i].setUnderline();
            }
        } else {
            cell.setUnderline();
        }
    };
    function buttonItalicClickHandler(e) {
        var td = this_.selection;
        if (!td) return;
        var cell = view.model.getCell(td.col, td.row);
        if (this_.listSelectedCells.length != 0) {
            for (var i = 0; i < this_.listSelectedCells.length; i++) {
                this_.listSelectedCells[i].setItalic();
            }
        } else {
            cell.setItalic();
        }
    };

    function buttonBackgroundColorClickHandler(e) {
        var td = this_.selection;
        if (!td) return;
        var cell = view.model.getCell(td.col, td.row);
        if (this_.listSelectedCells.length != 0) {
            for (var i = 0; i < this_.listSelectedCells.length; i++) {
                this_.listSelectedCells[i].setBackgroundColor(view.backgroundColor.value);
            }
        } else {
            cell.setBackgroundColor(view.buttonBackgroundColor.value);
        }
    }

    function buttonTextColorClickHandler(e) {
        var td = this_.selection;
        if (!td) return;
        var cell = view.model.getCell(td.col, td.row);
        if (this_.listSelectedCells.length != 0) {
            for (var i = 0; i < this_.listSelectedCells.length; i++) {
                this_.listSelectedCells[i].setTextColor(view.buttonTextColor.value);
            }
        } else {
            cell.setTextColor(view.buttonTextColor.value);
        }
    }

    function buttonBorderStyleClickHandler(event) {
        event = event || window.event;
        event.target = event.target || event.srcElement;

        var element = event.target;

        if (element.nodeName === "BUTTON" && element) {
            var td = this_.selection;
            if (!td) return;
            var cell = view.model.getCell(td.col, td.row);


            switch (element.id) {
                case "button-borders-dotted":
                    if (this_.listSelectedCells.length != 0) {

                        for (var i = 0; i < this_.listSelectedCells.length; i++) {
                            this_.listSelectedCells[i].setBorderStyle(borderStyleEnum.DOTTED);
                        }
                    } else {
                        cell.setBorderStyle(borderStyleEnum.DOTTED);
                    }
                    break;
                case "button-borders-dashed" :
                    if (this_.listSelectedCells.length != 0) {
                        for (var i = 0; i < this_.listSelectedCells.length; i++) {
                            this_.listSelectedCells[i].setBorderStyle(borderStyleEnum.DASHED);
                        }
                    } else {
                        cell.setBorderStyle(borderStyleEnum.DASHED);
                    }
                    break;
                case "button-borders-solid" :
                    if (this_.listSelectedCells.length != 0) {
                        for (var i = 0; i < this_.listSelectedCells.length; i++) {
                            this_.listSelectedCells[i].setBorderStyle(borderStyleEnum.SOLID);
                        }
                    } else {
                        cell.setBorderStyle(borderStyleEnum.SOLID);
                    }
                    break;
                case "button-borders-none" :
                    if (this_.listSelectedCells.length != 0) {
                        for (var i = 0; i < this_.listSelectedCells.length; i++) {
                            this_.listSelectedCells[i].setBorderStyle(borderStyleEnum.NONE);
                        }
                    } else {
                        cell.setBorderStyle(borderStyleEnum.NONE);
                    }
                    break;
                default :
                    cell.setBorderStyle(borderStyleEnum.SOLID);
                    break;
            }
        }
    }


    /*
     *
     * The listeners for the style buttons.
     *
     */
    view.buttonBold.addEventListener("click", buttonBoldClickHandler);
    view.buttonItalic.addEventListener("click", buttonItalicClickHandler);
    view.buttonUnderline.addEventListener("click", buttonUnderlineClickHandler);
    view.buttonBackgroundColor.addEventListener("input", buttonBackgroundColorClickHandler);
    view.buttonTextColor.addEventListener("input", buttonTextColorClickHandler);
    view.buttonBorderDotted.addEventListener("click", buttonBorderStyleClickHandler);
    view.buttonBorderDashed.addEventListener("click", buttonBorderStyleClickHandler);
    view.buttonBorderSolid.addEventListener("click", buttonBorderStyleClickHandler);

    view.button.addEventListener("click", buttonClickHandler);
    view.input.addEventListener("keypress", function (e) {
        if (e.keyCode == 13) //[enter]
            buttonClickHandler(e);
    });


    var colToIdx = function (s) {
        var res = 0;
        for (var i = 0; i < s.length; i++) {
            res *= 26;
            res += (s.charCodeAt(i) - 64);
        }
        return (res - 1);
    };

    var idxToCol = function (i) {
        var res = "";
        var n = i + 1;
        var c = 0;
        while (n > 0) {
            c = n % 26;
            c = c == 0 ? 26 : c;
            res = String.fromCharCode(c + 64) + res;
            n = Math.trunc((n - c) / 26);
        }
        ;
        return res;

    };

    view.table.addEventListener("click", function (e) {
        var td = findTD(e.target);

        if (!td) {
            this_.multipleSelection = null;
            return;
        }
        if (td.isSelected()) {
            console.log("td origin : " + this_.tdOrigin.col + "" + this_.tdOrigin.row);
            if (e.metaKey || e.ctrlKey) {
                var cell = view.model.getCell(td.col, td.row);
                var i = colToIdx(this_.tdOrigin.col);
                
                for (i; i <= colToIdx(td.col); i++) {
                    var j = this_.tdOrigin.row - 0; // Convert the string corresponding to a row to a number.
                    for (j; j <= td.row; j++) {
                        console.log("i = " + i + " j = " + j);
                        var cellTmp = view.model.getCell(idxToCol(i), j);
                        cellTmp.setOriginalBackgroundColor(cellTmp.getBackgroundColor());
                        cellTmp.setBackgroundColor("#CCFFFF");
                        this_.listSelectedCells.push(cellTmp);
                    }
                }
                var form = cell.getFormula();
                view.input.value = form ? '=' + form.toString() : "";

                //focus the input.

                setTimeout(function () {
                    view.input.focus();
                }, 100);

            }
        }
    })

};