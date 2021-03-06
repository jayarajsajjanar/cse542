var questions = [];
var question_number = -1;
var questions_shown = 0;
var max_questions = 0;

var current_points = 0;
var global_question= null;
var assumption_selected = [];
var submit_reasons_set = false;
var nextflag = false;
var reason_flag = false;

function display_feedback_for_assumptions(){
    // window.alert("display_feedback_for_assumptions");
    var assumptions_ele = global_question["assumptions"];
    var checkboxes = document.getElementsByName('all_assumptions_chk_bx');
    for(i=0;i<assumptions_ele.length;i++){
        // window.alert(i);
        var existing_content = document.getElementById("assm_"+i).innerHTML;
        if(assumptions_ele[i]["assumption_type"]=="needed"){
           // window.alert("needed"); 
           // document.getElementById("assm_"+i).innerHTML = existing_content.replace('<br>',' ');
           // document.getElementById("assm_"+i).innerHTML += "<div class='alert alert-success'><strong>Success!</strong> Indicates a successful or positive action.</div>";
           // document.getElementById("assm_"+i).innerHTML +="<p>hi</p>"
           document.getElementById("assm_"+i).style.color = "green"; 

        }
        else if(assumptions_ele[i]["assumption_type"]=="unneeded"){
            if(checkboxes[i].checked){
                document.getElementById("assm_"+i).style.color = "red";
                if(document.getElementById("reasons_div_"+i)){
                    document.getElementById("reasons_div_"+i).style.color = "black"; 
                }
            }else{
                document.getElementById("assm_"+i).style.color = "#D3D3D3"; 
            }
        }
        else if(assumptions_ele[i]["assumption_type"]=="complicatingfactor"){
           document.getElementById("assm_"+i).style.color = "blue"; 
        }
    }
}

function check_atleast_one_selected(){
    var atleast_one_selected = false;

    var checkboxes = document.getElementsByName('all_assumptions_chk_bx');
    for (i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type == 'checkbox' && checkboxes[i].checked) {
            atleast_one_selected = true;
        }   
   
    }

    if(atleast_one_selected == false){
        return false;
    }
    return true;
}

function evaluate_assumptions_submission() {
    if(!check_atleast_one_selected()){
        window.alert("Select Assumptions!!!");
        return false;
    }
    var k = 0; //to populate assumption selected array. Multiple assumptions can be selected. 
    var checkboxes = document.getElementsByName('all_assumptions_chk_bx');
    submit_reasons_set = false;
    for (i = 0; i < checkboxes.length; i++) {

        assumption_selected[k] = checkboxes[i].value; // if first checkbox checked then 0 stored in array. 
        var assumptions_ele = global_question["assumptions"];


        //process only if the checkbox is checked. else just disable the checkbox.
        if (checkboxes[i].type == 'checkbox' && checkboxes[i].checked) {
            // assumption_selected[k] = checkboxes[i].value; // if first checkbox checked then 0 stored in array. 
            // var assumptions_ele = global_question["assumptions"];
            if(assumptions_ele[assumption_selected[k]]["assumption_type"]=="needed"){
                document.getElementById("chk_"+i).disabled= true;
                console.log("assumption type needed"); 
                current_points+=assumptions_ele[assumption_selected[k]]["assumption_points"];
                console.log("modified points:"+current_points);
                // document.getElementById('score_display_ele').innerHTML = "Score obtained : "+current_points;
                console.log("Score displayed");
                if(!nextflag){
                    document.getElementById("next").style.display= "block";
                }  
            }
            else if(assumptions_ele[assumption_selected[k]]["assumption_type"]=="unneeded" || assumptions_ele[assumption_selected[k]]["assumption_type"]=="complicatingfactor"){
                console.log("assumption type unneeded or complicatingfactor");
                document.getElementById("chk_"+i).disabled= true;
                document.getElementById("next").style.display= "none";
                nextflag = true;
                current_points+=assumptions_ele[assumption_selected[k]]["assumption_points"];
                console.log("modified points:"+current_points);
                //Display reasons
                var all_reasons = assumptions_ele[assumption_selected[k]]["reasons"];

                if(all_reasons != null){
                    reason_flag = true;
                    display_reasons(i,all_reasons);
                }
            }
        }
        else{
            //blurr the checkbox
            console.log("checkbox not selected : "+checkboxes[i].value);
            document.getElementById("chk_"+i).disabled= true;

        }
        //k is incremented here so as to be able to use k in between. 
        k++;
    }
   
    display_feedback_for_assumptions();

    document.getElementById('Submit_assm').style.display="none";

    document.getElementById('score_button_id').innerHTML = "Score: "+current_points;

    if(nextflag && !reason_flag){
        document.getElementById("next").style.display= "block";
    } 

    return false;

}
function display_reasons(i,all_reasons){
    var reasons_div = document.createElement('div'); 
    reasons_div.id = "reasons_div_"+i;
    document.getElementById("assm_"+i).appendChild(reasons_div);
    for (j = 0; j < all_reasons.length; j++){
        var reasons = document.createElement('div');
        reasons.id = "reasons_"+i+"_"+j;
        document.getElementById('reasons_div_'+i).appendChild(reasons);
        document.getElementById('reasons_'+i+"_"+j).innerHTML += "<div class ='radio'><label><input type='radio' name='reasons_"+i+"' value="+j+" id = rd_"+j+" >"+" "+all_reasons[j]["reason_text"]+"</label></div>";
    }

    document.getElementById("chk_"+i).checked = true;

    console.log("Reason checkboxes displayed");

    //show submit button as well once all the radios are loaded. 

    if(submit_reasons_set == false){
       document.getElementById('reasons').innerHTML += "<input type='submit' id='submit_reasons' name='Submit_reasons' class='btn btn-primary' value='Submit Reason'>";
       submit_reasons_set = true;
    }
    console.log("Reason submit displayed");

}

function evaluate_reasons_submission(){

    console.log("evaluate_reasons_submission");
    document.getElementById('submit_reasons').style.display= "none";

    for (each_assm in assumption_selected){
        var radios = document.getElementsByName('reasons_'+each_assm);
        document.getElementsByName('reasons_'+each_assm).disabled = true;

        for (i = 0; i < radios.length; i++) {
            radios[i].disabled = true;
            var reas_seq = radios[i].value;
            if(global_question["assumptions"][each_assm]["reasons"][reas_seq]["reason_points"] == -1){
                    document.getElementById("reasons_"+each_assm+"_"+i).style.color = "#D3D3D3";
            }
            else{
                document.getElementById("reasons_"+each_assm+"_"+i).style.color = "green";
            }
            if (radios[i].type == 'radio' && radios[i].checked) {
                // assumption_selected = radios[i].value;
                console.log("radio selected:"+radios[i].value);
                
                console.log("points for this reason :"+global_question["assumptions"][each_assm]["reasons"][reas_seq]["reason_points"]);
                if(global_question["assumptions"][each_assm]["reasons"][reas_seq]["reason_points"] == -1){
                    document.getElementById("reasons_"+each_assm+"_"+i).style.color = "red";
                }
                current_points += global_question["assumptions"][each_assm]["reasons"][reas_seq]["reason_points"];
                console.log("modified points:"+current_points);
            }

        }
    }
    document.getElementById('score_button_id').innerHTML = "Score: "+current_points;
    console.log("Score displayed");
    document.getElementById("next").style.display= "block";
    return false;

}



function display_assumptions(q) {
    document.getElementById("questionbody").style.display= "block";
    // document.getElementById('question_ele').innerHTML += "<br>" +"<b>"+q["questiontitle"]+"</b>" + "<br>";
    var assumptions_ele = q["assumptions"];
    create_checkboxes(assumptions_ele);

    //show submit button as well once all the radios are loaded.

    document.getElementById('assumptions').innerHTML += "<input type='submit' name='Submit' id='Submit_assm' class='btn btn-primary' value='Submit' style = 'display:block;'>"+"<br>";

    display_images(q);
    return false;
}

function display_images(q){
    document.getElementById('realworld').innerHTML = "<img src='" + q['realworldmodelpath'] + "' class='img-fluid'/>";
    document.getElementById('idealized').innerHTML = "<img src='" + q['idealizedmodelpath'] + "' class='img-fluid'/>";
}
function create_checkboxes(assumptions_ele){
    for (i = 0; i < assumptions_ele.length; i++){
            document.getElementById('assumptions').innerHTML += "<div id='assm_"+i+"' class = 'checkbox'><label><input type='checkbox' name='all_assumptions_chk_bx' value="+i+" id= chk_"+i+">"+" "+assumptions_ele[i]["assumption_text"]+"</label></div>";
        }

}

function select_random_question() {
    if (questions.length == 0) return false;
    question_number = Math.floor(questions.length * Math.random());
    var random_question = questions.splice(question_number, 1)[0];
    global_question = random_question;
    return true;
}

function display_question() {
    set_questiontitle(global_question.questiontitle);
    display_assumptions(global_question);
}

function load_questions() {
    try {
        var p = new parser(questions_config);
        questions = p.parse();
        max_questions = questions.length;
        questions_shown = 1;
        if (questions.length == 0)
            alert("That file seems to have no questions.");
        else {
            select_random_question();
            set_progress_bar();
            display_question();
        }
    } catch (e) {
        alert("Something went wrong: " + e);
    }
    return false;
}

function set_questiontitle(t) {
    document.getElementById('questiontitle').innerHTML = t;
}

function set_progress_bar(p) {
    var percent_done = (100 * (questions_shown-1) / max_questions) + '%';
    if (p) percent_done = p + '%';
    console.log('width: ' + percent_done);
    document.getElementById('progbar').style = 'width: ' + percent_done;
    document.getElementById('readable_percent_done').innerHTML = percent_done + " Complete";
}

function load_nextquestion() {
   // document.getElementById('question_ele').innerHTML = "Question goes here";
    nextflag= false;
    reason_flag = false;
    var rad= document.getElementsByName("selection");
    remove_ele(rad);
    if(document.getElementsByName("reasons")!=null){
        remove_ele(document.getElementsByName("reasons"));
    }
    document.getElementById("assumptions").innerHTML = "";
    document.getElementById("reasons").innerHTML = "";
    // document.getElementById("score_display_ele").innerHTML = "Score obtained : "+current_points;
    document.getElementById("score_display_reasons").innerHTML= " ";
    document.getElementById("next").style.display= "none";

    if (select_random_question()) {
        questions_shown += 1;
        set_progress_bar();
        display_question();
    }
    else {
        document.getElementById('question_images').style.display= "none";
        set_progress_bar(100);
        document.getElementById('questionbody').style.display= "none";
        document.getElementById('end_page').style.display= "block";
        document.getElementById('Finalpage_score').innerHTML= "<h2>Your final score is : "+current_points+"</h2>"
    }
}
function remove_ele(ele){
    for(i=0;i<ele.length;i++){
        var id = ele[i].getAttribute('id');
        document.getElementById(id).remove();
    }
}
