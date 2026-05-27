(function () {
    "use strict";

    var currentTurn = 0;

    var ROW_COORDS = [-19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32];
    var COL_COORDS = [-127, -126, -125, -124, -123, -122, -121, -120, -119, -118, -117, -116, -115, -114];

    var grid = document.getElementById("grid");
    var historyTable = document.getElementById("history-table");
    var dateEl = document.getElementById("date");
    var timeEl = document.getElementById("time");
    var turnLabelEl = document.getElementById("turn-label");
    var slider = document.getElementById("turn-slider");
    var display = document.getElementById("turn-display");
    var prevBtn = document.getElementById("prev-btn");
    var nextBtn = document.getElementById("next-btn");

    function getAltText(src) {
        if (!src) return "";
        var filename = src.split("/").pop().replace(".gif", "").replace(/%20/g, " ");
        
        var nameMap = {
            // Personnages
            "HalfelinM": "Loxka",
            // Monstres ennemis Forêt de saphir
            "88": "Princesse Sombre",
            "87": "Observateur",
            "86": "Fée maline",
            "85": "Matagot",
            "84": "Cauchemar",
            // Alliés / invocations
            "29": "Tréant",
            "37": "Mulet",
            "62": "Hati",
            "63": "Élémentaire de glace",
            "72": "Fantôme",
            "151": "Kuma",
            // PNJ
            "139": "Nienor",
            // Lieux
            "1": "Arbre",
            "2": "Arbuste",
            "4": "Arbre mort",
            "11": "Campement",
            "13": "Dépouille",
            "21": "Vieil arbre",
            "30": "Arbre fruitier",
            "41": "Débris",
            "90": "Rosier",
            "97": "Barricade",
            "126": "Arbre millénaire enchanté",
            "129": "Chapelle sinistre",
            "130": "Arbuste enchanté",
            "138": "Demeure hantée"
        };
        
        if (src.indexOf("/lieu/") !== -1) return nameMap[filename] || "Lieu " + filename;
        if (src.indexOf("/monstre/") !== -1) return nameMap[filename] || "Monstre " + filename;
        if (src.indexOf("/pj/") !== -1) return nameMap[filename] || filename;
        if (src.indexOf("/sol/") !== -1) return "Sol " + filename;
        return filename;
    }

    function createDiv(className, text) {
        var div = document.createElement("div");
        div.className = className;
        if (text !== undefined) div.textContent = text;
        return div;
    }

    function renderTurn(index) {
        var turn = TURNS[index];

        dateEl.textContent = turn.date;
        timeEl.textContent = turn.time;
        turnLabelEl.textContent = turn.turn;

        grid.innerHTML = "";

        for (var row = 0; row < 14; row++) {
            grid.appendChild(createDiv(
                "item " + (row % 2 === 0 ? "impair" : "pair"),
                ROW_COORDS[row]
            ));

            for (var col = 0; col < 14; col++) {
                var cellDiv = document.createElement("div");
                cellDiv.className = "item";
                var src = turn.grid[row][col];
                if (src) {
                    var img = document.createElement("img");
                    img.src = src;
                    img.alt = getAltText(src);
                    img.title = getAltText(src);
                    cellDiv.appendChild(img);
                }
                grid.appendChild(cellDiv);
            }
        }

        grid.appendChild(createDiv("item neutral"));
        for (var c = 0; c < 14; c++) {
            grid.appendChild(createDiv(
                "item " + (c % 2 === 0 ? "impair" : "pair"),
                COL_COORDS[c]
            ));
        }

        historyTable.innerHTML = "";
        for (var i = 0; i < turn.history.length; i++) {
            var event = turn.history[i];
            var tr = document.createElement("tr");
            tr.className = i % 2 === 0 ? "tr-impair" : "tr-pair";

            if (event.time || event.result) {
                var tdTime = document.createElement("td");
                tdTime.textContent = event.time;
                var tdText = document.createElement("td");
                tdText.innerHTML = event.text;
                var tdResult = document.createElement("td");
                tdResult.innerHTML = event.result;
                tr.appendChild(tdTime);
                tr.appendChild(tdText);
                tr.appendChild(tdResult);
            } else {
                var td = document.createElement("td");
                td.innerHTML = event.text;
                tr.appendChild(td);
            }

            historyTable.appendChild(tr);
        }

        slider.value = index;
        display.textContent = (index + 1) + " / " + TURNS.length;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === TURNS.length - 1;

        document.title = "Princesse Sombre - " + turn.turn;
    }

    function go(index) {
        if (index >= 0 && index < TURNS.length) {
            currentTurn = index;
            renderTurn(currentTurn);
        }
    }

    slider.max = TURNS.length - 1;
    slider.addEventListener("input", function (e) {
        go(parseInt(e.target.value, 10));
    });
    prevBtn.addEventListener("click", function () { go(currentTurn - 1); });
    nextBtn.addEventListener("click", function () { go(currentTurn + 1); });
    prevBtn.addEventListener("touchstart", function (e) { if (!prevBtn.disabled) { e.preventDefault(); go(currentTurn - 1); } }, { passive: false });
    nextBtn.addEventListener("touchstart", function (e) { if (!nextBtn.disabled) { e.preventDefault(); go(currentTurn + 1); } }, { passive: false });

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") go(currentTurn - 1);
        if (e.key === "ArrowRight") go(currentTurn + 1);
        if (e.key === "Home") go(0);
        if (e.key === "End") go(TURNS.length - 1);
    });

    // Prevent double-tap zoom on grid (iOS Safari)
    var lastTap = 0;
    document.getElementById("grid").addEventListener("touchend", function (e) {
        var now = Date.now();
        if (now - lastTap < 300) { e.preventDefault(); }
        lastTap = now;
    }, { passive: false });

    renderTurn(0);
})();
