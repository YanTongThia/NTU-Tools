

function append_input() {
    let code = $('#code');
    $.ajax({
        type: "GET",
        url: "/query",
        success: function(data) {
            let items = data.success;
            console.log(data); 
            let div = document.createElement("div");
            div.setAttribute("id", "inner_code");
            let select = document.createElement("select");
            select.setAttribute("id", "select");
            
            let option = document.createElement("option");
            option.setAttribute("disabled", "disabled");
            option.defaultSelected = true;
            option.value = "Code";
            option.text = "Code";
            select.appendChild(option);
            for (let item of items)
            {
                let option = document.createElement("option");
                option.value = item;
                option.text = item.charAt(0).toUpperCase() + item.slice(1);
                select.appendChild(option);
            }
            div.appendChild(select);

            let innerdiv = document.createElement("div");
            innerdiv.setAttribute("id", "buttons");
            let minus_button = document.createElement("button");
            minus_button.setAttribute("id", "minus_button");
            minus_button.innerHTML = "-";
            innerdiv.appendChild(minus_button);
            let add_button = document.createElement("button");
            add_button.setAttribute("id", "add_button");
            add_button.innerHTML = "+";
            innerdiv.appendChild(add_button);
            div.appendChild(innerdiv);

            code.append(div);
        }
    });
}

$(document).ready(function() {
    let count = 1;

    $("#code").on("click", "#add_button", function(e) {
        e.preventDefault();
        if (count < 5) {
            append_input();
            count++;
        }
    });

    $("#code").on("click", "#minus_button", function(e) {
        e.preventDefault();
        if (count != 1) {
            $(this).parentsUntil("#code").remove();
            count--;
        } 
    });
})


function create_table(data) {
    let plot = data.plot;
    let current_index = data.index;
    let length = data.length;
    
    let table = document.createElement('table');
    let first_column = ['0730 - 0830', '0830 - 0930', '0930 - 1030', '1030 - 1130', '1130 - 1230', '1230 - 1330', '1330 - 1430', '1430 - 1530', '1530 - 1630', '1630 - 1730', '1730 - 1830', '1830 - 1930', '1930 - 2030', '2030 - 2130'];
    let first_row = ['Time / Day','Mon','Tue','Wed','Thu','Fri','Sat'];
    // table.setAttribute("class","text-center table-auto self-center min-w-full");

    var tr = document.createElement('tr');
    tr.setAttribute("class","bg-slate-400 text-white border-2 border-black");
    for (let i = 0; i < first_row.length; i++) {
        let td = document.createElement('td');
        let text = document.createTextNode(first_row[i]);
        td.appendChild(text);
        tr.appendChild(td);
        // td.setAttribute("class","px-7 py-1 border-2 border-black");
        tr.setAttribute("id", "header");
        
    }
    table.appendChild(tr);

    for (let i =0; i < first_column.length; i++) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        let text = document.createTextNode(first_column[i]);
        td.appendChild(text);
        tr.append(td);
        // tr.setAttribute("class","border-2 border-black text-center");
        for (let j=0; j < first_row.length -1; j++) {
            let td = document.createElement('td');
            let text = document.createTextNode(plot[j][i]);
            td.appendChild(text);
            // td.setAttribute("class","px-5 py-2 border-2 border-black text-center");
            tr.appendChild(td);
        }
        table.append(tr);
    }
    $("#table").html("");
    $("#table").append(table);
    $("#start").html('');
    $("#start").append(current_index + 1);
    $("#end").html('');
    $("#end").append(length);
}
function append_table(input) {
    
    let results = {};
    for (let i = 0; i < input.length; i++) {
        results[i] = input[i];
    }
    console.log(results);
    $.ajax({
        type: "POST",
        url: "/process",
        data: results,
        success: function(data) {
            console.log(data);
            create_table(data);
        }
    });
}

function inputverification(e) {
    $.ajax({
        type: "GET",
        url: "/query",
        success: function(data) {
            let extract = data["success"];
            let input = Array.from(document.querySelectorAll("#select"), ({ value }) => value);
            console.log(input);
            // if every value in Input is inlcuded in Extract
            //console.log(input.every(val => extract.includes(val)));

            // if they are equal <True>, all elements are distinct
            // console.log(_.isEqual(Array.from(new Set(input)), input)); 
            
            // if <True>, empty string not in Array
            // console.log($.inArray("Code", input)==-1);

            // if <True> and <True>, then <True>
            if (_.isEqual(Array.from(new Set(input)), input) && $.inArray("Code", input)==-1 && input.every(val => extract.includes(val))) {
                console.log("Input Check Passed");
                $("#error").addClass("hidden");
                append_table(input);
            } else {
                console.log("Input Check Failed");
                $("#error").removeClass("hidden");
            }
        }
    });
}

function increment(e) {
    let counter = $("#start").innerHTML;
    if (counter != 0) {
        $.ajax({
            type: "POST",
            url: "increment_decrement",
            data: {"req_type":"increment"},
            success: function(data) {
                create_table(data);
            }
        });
    }
}

function decrement(e) {
    let counter = $("#start").innerHTML;
    if (counter != 0) {
        $.ajax({
            type: "POST",
            url: "increment_decrement",
            data: {"req_type":"decrement"},
            success: function(data) {
                create_table(data);
            }
        });
    }
} 

