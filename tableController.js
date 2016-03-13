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


    function tdClickHandler(e) {

        var td = findTD(e.target);

        if (!td) {
            this_.selection = null;
            return;
        }
        ;

        if (this_.selection)
            this_.selection.select(false);
        this_.selection = td;
        this_.selection.select(true);

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


};