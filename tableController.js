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
        if (!(e.metaKey || e.ctrlKey))
            this_.tdOrigin = td; // We update the original cell only if we don't click on the ctrl or meta key (Mac OS).


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
        cell.setBold();
    };

    function buttonUnderlineClickHandler(e) {
        var td = this_.selection;
        if (!td) return;
        var cell = view.model.getCell(td.col, td.row);
        cell.setUnderline();
    };
    function buttonItalicClickHandler(e) {
        var td = this_.selection;
        if (!td) return;
        var cell = view.model.getCell(td.col, td.row);
        cell.setItalic();
    };

    function buttonBackgroundColorClickHandler(e) {
        var td = this_.selection;
        if (!td) return;
        var cell = view.model.getCell(td.col, td.row);
        cell.setBackgroundColor(view.buttonBackgroundColor.value);
    }

    function buttonTextColorClickHandler(e) {
        var td = this_.selection;
        if (!td) return;
        var cell = view.model.getCell(td.col, td.row);
        cell.setTextColor(view.buttonTextColor.value);
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
                    cell.setBorderStyle(borderStyleEnum.DOTTED)
                    break;
                case "button-borders-dashed" :
                    cell.setBorderStyle(borderStyleEnum.DASHED);
                    break;
                case "button-borders-solid" :
                    cell.setBorderStyle(borderStyleEnum.SOLID);
                    break;
                case "button-borders-none" :
                    cell.setBorderStyle(borderStyleEnum.NONE);
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
                // TODO : I need to add all the new cells in a list in order to modify their styles all at once !! .

                for (i; i <= colToIdx(td.col); i++) {
                    var j = this_.tdOrigin.row - 0; // Convert the string corresponding to a row to a number.
                    for (j; j <= td.row; j++) {
                        console.log("i = " + i + " j = " + j);
                        var cellTmp = view.model.getCell(idxToCol(i), j);
                        cellTmp.setBackgroundColor("#CCFFFF");
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