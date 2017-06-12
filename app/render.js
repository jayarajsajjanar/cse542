var questions = [];
var current_points = 0;
var global_question= null;
var assumption_selected = null;

function evaluate_submission() {
    window.alert("global question "+ global_question['questiontitle']);

    // document.getElementByName('Submit').style.display = 'block';
    // document.getElementsByName('Submit').style.visibility = "hidden"; 
    document.getElementById('Submit_assm').style.visibility = "hidden"; 
    // document.getElementById('id').style.visibility = "hidden"; 
    // document.getElementById('id').style.visibility = "hidden"; 
    // document.getElementById('id').style.visibility = "hidden"; 
    window.alert("hiding working");

    var radios = document.getElementsByName('selection');
    for (i = 0; i < radios.length; i++) {
        if (radios[i].type == 'radio' && radios[i].checked) {
            assumption_selected = radios[i].value;
            window.alert("radio selected : "+radios[i].value);
        }
    }
    var assumptions_ele = global_question["assumptions"];
    if(assumptions_ele[assumption_selected]["assumption_type"]=="needed"){
        window.alert("assumption type needed"); 
        current_points+=assumptions_ele[assumption_selected]["assumption_points"];
        window.alert("modified points:"+current_points);
        document.getElementById('score_display_ele').innerHTML = "Score obtained : "+current_points;
        window.alert("Score displayed");

    }
    else if(assumptions_ele[assumption_selected]["assumption_type"]=="unneeded" || assumptions_ele[assumption_selected]["assumption_type"]=="complicatingfactor"){
        window.alert("assumption type unneeded or complicatingfactor");

        current_points+=assumptions_ele[assumption_selected]["assumption_points"];
        window.alert("modified points:"+current_points);

        document.getElementById('score_display_ele').innerHTML += "Wrong selection!! Score: "+current_points+"<br>";
        document.getElementById('score_display_ele').innerHTML += "To increase, select reason"+"<br>";

        window.alert("Score displayed");


        var all_reasons = assumptions_ele[assumption_selected]["reasons"];

        for (i = 0; i < all_reasons.length; i++){
            document.getElementById('reasons').innerHTML += "<input type='checkbox' name='reasons' value="+i+">"+all_reasons[i]["reason_text"]+"<br>";
        }
        window.alert("Reason checkboxes displayed");

        //show submit button as well once all the radios are loaded. 

        document.getElementById('reasons').innerHTML += "<input type='submit' name='Submit_reasons' value='Submit Reason'>"+"<br>";

        window.alert("Reason submit displayed");

        return 1;


    }
    return 1;

}


function evaluate_reasons_submission(){
    window.alert("evaluate_reasons_submission");

    var checkboxes = document.getElementsByName('reasons');
    for (i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type == 'checkbox' && checkboxes[i].checked) {
            // assumption_selected = radios[i].value;
            window.alert("checkbox selected:"+checkboxes[i].value);
            var reas_seq = checkboxes[i].value;
            window.alert("points for this reason :"+global_question["assumptions"][assumption_selected]["reasons"][reas_seq]["reason_points"]);
            current_points += global_question["assumptions"][assumption_selected]["reasons"][reas_seq]["reason_points"];
            window.alert("mofified points:"+current_points);

        }
    }
    document.getElementById('score_display_reasons').innerHTML = "Score obtained after reasons: "+current_points+"<br>";
    window.alert("Score displayed");

    return 1;

}

function render_question(q) {
        // window.alert("create question element");
        
        // document.getElementById('testing').innerHTML = JSON.stringify(q, null, 2);


        document.getElementById('question_ele').innerHTML += "<br>" +"<b>"+q["questiontitle"]+"</b>" + "<br>";

        var assumptions_ele = q["assumptions"];
        // window.alert("assumptions_ele length" + assumptions_ele.length);

        for (i = 0; i < assumptions_ele.length; i++){
            document.getElementById('assumptions').innerHTML += "<input type='radio' name='selection' value="+i+">"+assumptions_ele[i]["assumption_text"]+"<br>";
        }

        //show submit button as well once all the radios are loaded. 

        document.getElementById('assumptions').innerHTML += "<input type='submit' name='Submit' id='Submit_assm' value='Submit'>"+"<br>";

}
  
function load_file() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var file = document.forms['aform']['uploadData'].files[0];
        if (file) {
            var fr = new FileReader();
            fr.onload = function(e) {
                try {
                    questions = parse(e.target.result);
                    if (questions.length == 0) alert("That file seems to have no questions.");
                    else {
                        var qn = Math.floor(questions.length * Math.random());
                        var random_question = questions[qn];
                        global_question = random_question;
                        // render_question(random_question);
                        // display_ques(random_question);
                        render_question(questions[qn]);
                    }
                } catch (e) {
                    alert("Something went wrong: " + e);
                }
            };
            fr.readAsText(file);
        }
    }
    else {
        alert('The File APIs are not fully supported in this browser.');
    }
    return 1;
}

