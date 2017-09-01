$(document).ready(function () {
    $('.btn-go').on('click', function () {
        start();
    });
});

// Validate input; Set default animation speed or take it from params. Insert hidden table on the page.
// Tag body using because 'document.write' rewriting all page and background-image is not install.
function start() {
    var edge = $("#edge").val();
    if (edge === "") {
        alert('Enter the dimension of the matrix');
    } else if (edge < 1 || edge > 100) {
        alert('Enter number from 1 to 100');
    } else {
        $("#edge").fadeOut(1000)
        $(".btn-go").fadeOut(1000)
        matrix = spiralArray(edge);
        if (getAllUrlParams().animation_speed == undefined ||
            getAllUrlParams().animation_speed < 100) {
            animation_speed = 100;
        } else if (getAllUrlParams().animation_speed > 2000) {
            animation_speed = 2000;
        } else {
            animation_speed = getAllUrlParams().animation_speed;
        }

        console.log(animation_speed)
        for (i = 0; i < edge; i++) {
            $(".spiral-matrix").append("<tr class = tr_" + i + ">");
            for (j = 0; j < edge; j++) {
                $(".tr_" + i).append("<td id = " + i + "_" + j + ">");
            }
        }

        for (i = 0; i < edge; i++) {
            for (j = 0; j < edge; j++) {
                document.getElementById("" + i + "_" + j).innerHTML = matrix[i][j];
            }
        }
        fillTheMatrix(animation_speed, edge);
    }
}

//Draw square and increase indent by 2. Indent changes after every 4 changes of direction.
function fillTheMatrix(animation_speed, edge) {
    var direction = 0, // 0 = bottom, 1 = right, 2 = top, 3 = left
        row = 0,
        col = 0,
        stepsToTake = edge - 1,
        steps = edge * edge - 1,
        indent = 0,
        counter = 0;

    var PrintAndStep = function () {
        setTimeout(function () {
            printCurrentCell(col, row)
            if (direction == 0 || direction == 2) {
                newCell = moveToNewCell(col, row, direction);
                col = newCell[0];
                row = newCell[1];
            } else {
                newCell = moveToNewCell(col, row, direction);
                col = newCell[0];
                row = newCell[1];
            }
            stepsToTake--;
            steps--;
            if (stepsToTake == 0) {
                counter++;
                if (counter == 4) {
                    indent += 2
                    counter = 0;
                    direction = (direction + 1) % 4; // Rotate direction
                    stepsToTake = CalculateNewNumberOfSteps(direction, edge, indent);
                } else {
                    direction = (direction + 1) % 4; // Rotate direction
                    stepsToTake = CalculateNewNumberOfSteps(direction, edge, indent);
                }
            }

            if (stepsToTake >= 0) {
                PrintAndStep();
            }
        }, animation_speed);
    }
    PrintAndStep()
}

function CalculateNewNumberOfSteps(direction, edge, indent) {
    if (direction == 1 || direction == 2) {
        return (edge - 1 - indent);
    } else if (direction == 3) {
        return (edge - 2 - indent);
    } else {
        return (edge - indent);
    }
}

function printCurrentCell(col, row) {
    $("#" + col + "_" + row).css("cssText", "visibility: visible;");
}

function moveToNewCell(col, row, direction) {
    switch (direction) {
        case 0:
            newCell = [++col, row];
            break;
        case 1:
            newCell = [col, ++row];
            break;
        case 2:
            newCell = [--col, row];
            break;
        case 3:
            newCell = [col, --row];
            break;
    }
    return newCell;
}

function spiralArray(edge) {
    var arr = Array(edge),
        x = 0,
        y = edge,
        total = edge * edge--,
        dx = 1,
        dy = 0,
        i = 0,
        j = 0;

    while (y) {
        arr[--y] = [];
    }

    while (i < total) {
        if (String(i).search("6") != -1) {
            total++;
        }
        i++;
    }

    while (i > 0) {
        if (String(i).search("6") != -1) {
            while (String(i).search("6") != -1) {
                i--;
            }
        } else {
            arr[y][x] = i--;
            x += dy;
            y += dx;

            if (++j == edge) {
                if (dy < 0) {
                    x++;
                    y++;
                    edge -= 2;
                }
                j = dx;
                dx = -dy;
                dy = j;
                j = 0;
            }
        }
    }

    return arr;
}

//getAllUrlParams().* - return params. Where "*" = same string with text after "?" in url.
function getAllUrlParams(url) {
    var queryString = url ? url.split("?")[1] : window.location.search.slice(1);
    var obj = {};

    if (!queryString) {
        return obj;
    }

    queryString = queryString.split("#")[0];
    var arr = queryString.split("&");

    for (var i = 0; i < arr.length; i++) {
        var a = arr[i].split("=");
        var paramNum = undefined;
        var paramName = a[0].replace(/\[\d*\]/, function (v) {
            paramNum = v.slice(1, -1);
            return "";
        });
        var paramValue = typeof(a[1]) === "undefined" ? true : a[1];

        paramName = paramName.toLowerCase();
        paramValue = paramValue.toLowerCase();

        if (obj[paramName]) {
            if (typeof obj[paramName] === "string") {
                obj[paramName] = [obj[paramName]];
            }
            if (typeof paramNum === "undefined") {
                obj[paramName].push(paramValue);
            } else {
                obj[paramName][paramNum] = paramValue;
            }
        } else {
            obj[paramName] = paramValue;
        }

        return obj;
    }

}

