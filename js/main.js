function update_template(template, translation, element_number, parent_number)
{
  for(var i = 0; i < translation.length; i++)
  {
    template = template.replace(translation[i][0], translation[i][1]).replace("XXXXELEMENTNUMBERXXXX",element_number).replace("XXXXPARENTELEMENTNUMBERXXXX",parent_number);
  }
  console.log(template);
  return template;
}

function add_element(parent, list, new_object, template, translation, self_count, parent_count) {

  new_element_html = update_template(template, translation, self_count, parent_count);

  var new_element = $(new_element_html);
  parent.append(new_element);
  new_object.set_id(self_count);
  list.push([new_object, new_element]);
  return new_element;
}

function remove_element(element_number, element_list, template, translation, parent_element_number) {
  var element = element_list[element_number][1];
  element.remove();
  element_list.splice(element_number, 1);
  for(var i = element_number; i < element_list.length; i++) {
    var res = update_template(template, translation, i, parent_element_number);
    var new_element = $(res);
    element_list[i][1].replaceWith(new_element);
    element_list[i][1] = new_element;
    element_list[i][0].set_id(i);
  }
}


class CoreList {
  constructor() {
    this.core_list = [];
    this.core_html_template = '<div id="xxxx_id_field_xxxx" class="w3-display-container div_common div_per_core" data-index="xxxx_data_index_xxxx">' +
'          <legend>xxxx_legend_field_xxxx</legend>' +
'          <input type="button" id="xxxx_close_button_xxxx" class="w3-button w3-black w3-display-topright w3-black close_common close_core" value="&times"></input>' +
'          <input id="xxxx_text_field_xxxx" class="input_common core_input" placeholder="Enter Core Name"></input>' +
'          <input id="xxxx_freq_field_xxxx" class="input_common core_clock" placeholder="Enter Core Freq (MHz)" pattern="[0-9]+(.?[0-9]+)?"></input>' +
'          <input id="xxxx_latency_field_xxxx" class="input_common core_latency" placeholder="Context Switch Latency (cycles)" type="number"></input>' +
'        </div>';
    this.core_div = $("#core_box");
    this.translation = [["xxxx_id_field_xxxx", "core_XXXXELEMENTNUMBERXXXX_box"],
                        ["xxxx_legend_field_xxxx", "Core XXXXELEMENTNUMBERXXXX Info"],
                        ["xxxx_close_button_xxxx", "core_XXXXELEMENTNUMBERXXXX_close"],
                        ["xxxx_text_field_xxxx", "core_XXXXELEMENTNUMBERXXXX_text"],
                        ["xxxx_freq_field_xxxx", "core_XXXXELEMENTNUMBERXXXX_freq"],
                        ["xxxx_latency_field_xxxx", "core_XXXXELEMENTNUMBERXXXX_ctx_latency"],
                        ["xxxx_data_index_xxxx", "XXXXELEMENTNUMBERXXXX"]
                       ];
  }

  add_core() {
    var new_core = new Core();
    add_element(this.core_div, this.core_list, new_core, this.core_html_template, this.translation, this.core_list.length, 0);
  }

  remove_core(core_number) {
    remove_element(core_number, this.core_list, this.core_html_template, this.translation, 0);
  }
}

class Core {
  constructor() {
    this.core_name = "";
    this.clock_freq = 0;
    this.ctxt_switch_latency = 0;
    this.core_id = 0;
  }

  set_core_info(name, freq, latency, id) {
    this.core_id = id;
    this.core_name = name;
    this.clock_freq = freq;
    this.ctxt_switch_latency = latency;
  }

  set_id(id) {
    this.core_id = id;
  }
}

class TaskList {
  constructor() {
    this.clock_freq = 0;
    this.task_list = [];
    this.tasklist_div = $("#task_box");
    this.translation = [ ["xxxx_id_field_xxxx" , "task_XXXXELEMENTNUMBERXXXX_box"],
                         ["xxxx_legend_field_xxxx", "Task XXXXELEMENTNUMBERXXXX Info"],
                         ["xxxx_close_button_xxxx", "task_XXXXELEMENTNUMBERXXXX_close"],
                         ["xxxx_data_index_xxxx", "XXXXELEMENTNUMBERXXXX"],
                         ["xxxx_text_field_xxxx", "task_XXXXELEMENTNUMBERXXXX_text"],
                         ["xxxx_period_field_xxxx", "task_XXXXELEMENTNUMBERXXXX_period"],
                         ["xxxx_subtask_field_xxxx", "task_XXXXELEMENTNUMBERXXXX_subtask_box"],
                         ["xxxx_subtask_btn_field_xxxx", "task_XXXXELEMENTNUMBERXXXX_add_subtask_button"]
                       ];
    this.task_html_template = '<div id="xxxx_id_field_xxxx" class="w3-display-container div_common div_per_task" data-index="xxxx_data_index_xxxx">' +
          '  <legend>xxxx_legend_field_xxxx</legend>' +
          '  <input type="button" id="xxxx_close_button_xxxx" class="w3-button w3-black w3-display-topright w3-black close_common close_task" value="&times"></input>' +
          '  <input id="xxxx_text_field_xxxx"   class="input_common input_task"  placeholder="Enter Task Name"></input>' +
          '  <input id="xxxx_period_field_xxxx" class="input_common input_task" placeholder="Enter Task Periodicity (us)" type="number"></input>' +
          '  <div id="xxxx_subtask_field_xxxx">' +
          '    <div id="task_0_subtask_0_box" class="w3-display-container div_common div_per_subtask" data-index="0">' +
          '      <legend>Subtask 0 Info</legend>' +
          '      <input type="button" id="task_0_subtask_0_close" class="w3-button w3-black w3-display-topright w3-black close_common close_subtask" value="&times"></input>' +
          '      <input id="task_0_subtask_0_text" class="input_common input_subtask" placeholder="Enter Subtask Name"></input>' +
          '      <input id="task_0_subtask_0_deadline" class="input_common input_subtask" placeholder="Enter Subtask deadline (us)" type="number"></input>' +
          '      <input id="task_0_subtask_0_exectime" class="input_common input_subtask" placeholder="Enter execution time (cycles)" type="number"></input>' +
          '<div id="task_0_subtask_0_deps" class="div_common">' +
          '  <legend>Dependencies</legend>' +
          '</div>' +
          '    </div>' +
          '  </div>' +
          '  <input type="button" id="xxxx_subtask_btn_field_xxxx" class="w3-button w3-block w3-ripple w3-black add_button add_subtask_button" value="Add Subtask"></input>' +
          '</div>';
  }

  add_task() {
    var new_task = new Task();
    var task_id = this.task_list.length;
    add_element(this.tasklist_div, this.task_list, new_task, this.task_html_template, this.translation, this.task_list.length, 0);
    new_task.set_subtask_div( $("#task_" + task_id + "_subtask_box"));
  }

  add_subtask(task_number) {
    this.task_list[task_number][0].add_subtask();
  }

  remove_task(task_number) {
    remove_element(task_number, this.task_list, this.task_html_template, this.translation, 0);
  }

  remove_subtask(task_number, subtask_number) {

  }
}


class Task {
  constructor() {
    this.task_name = "";
    this.task_id = 0;
    this.deadline = 0;
    this.periodicity = 0;
    this.subtask_list = [];
    this.subtask_list_div = "";
    this.translation = [ ["xxxx_id_field_xxxx" , "task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_box"],
                         ["xxxx_legend_field_xxxx", "Subtask XXXXELEMENTNUMBERXXXX Info"],
                         ["xxxx_close_button_xxxx", "task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_close"],
                         ["xxxx_data_index_xxxx", "XXXXELEMENTNUMBERXXXX"],
                         ["xxxx_parent_index_xxxx", "XXXXPARENTELEMENTNUMBERXXXX"],
                         ["xxxx_text_field_xxxx", "task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_text"],
                         ["xxxx_deadline_field_xxxx", "task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_deadline"],
                         ["xxxx_exec_time_field_xxxx", "task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_exectime"],
                         ["xxxx_deps_field_xxxx", "task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_deps"]
    ];
    this.subtask_html_template = '<div id="xxxx_id_field_xxxx" class="w3-display-container div_common div_per_subtask" data-index="xxxx_data_index_xxxx"> data-parentindex="xxxx_parent_index_xxxx"' +
                '<legend>Subtask 0 Info</legend>' +
                '<input type="button" id="xxxx_close_button_xxxx" class="w3-button w3-black w3-display-topright w3-black close_common close_subtask" value="&times"></input>' +
                '<input id="xxxx_text_field_xxxx" class="input_common input_subtask" placeholder="Enter Subtask Name"></input>' +
                '<input id="xxxx_deadline_field_xxxx" class="input_common input_subtask" placeholder="Enter Subtask deadline (us)" type="number"></input>' +
                '<input id="xxxx_exec_time_field_xxxx" class="input_common input_subtask" placeholder="Enter execution time (cycles)" type="number"></input>' +
                '<div id="xxxx_deps_field_xxxx" class="div_common">' +
                  '<legend>Dependencies for Task 0 Subtask 0 </legend>' +
                  '<input id="t0_st0_d0" type="checkbox"></input>' +
                  '<label for="t0_st0_d0"><span>0</span></label>' +
                '</div>' +
              '</div>';
  }

  set_task_info() {
  }

  set_id(id) {
    this.task_id = id;
  }

  set_subtask_div(subtask_div) {
    this.subtask_list_div = subtask_div;
  }

  add_subtask() {
    var new_subtask = new SubTask();
    add_element(this.subtask_list_div, this.subtask_list, new_subtask, this.subtask_html_template, this.translation, this.subtask_list.length, this.task_id);

  }

  remove_subtask(subtask_number) {
    remove_element(subtask_number, this.subtask_list, this.subtask_html_template, this.translation, this.task_id);
  }
}

class SubTask {
  constructor() {
    this.subtask_name = "";
    this.deadline = "";
    this.execution_time= "";
    this.parent_task_id = 0;
    this.subtask_id = 0;
    this.dependency_list = [];
  }

  set_subtask_info() {
  }
}

var corelist;
var tasklist;

function init()
{
  corelist = new CoreList();
  tasklist = new TaskList();

  $("#add_core_button").on("click", function (e) {
    corelist.add_core();
  });

  $("#core_box").on("click", ".close_core", function(e) {
    corelist.remove_core(parseInt($(this).parent().data("index")));
  });

  $("#add_task_button").on("click", function (e) {
    tasklist.add_task();
  });

  $("#task_box").on("click", ".close_task", function(e) {
    tasklist.remove_task(parseInt($(this).parent().data("index")));
  });

  $("#task_box").on("click", ".add_subtask_button", function(e) {
    tasklist.add_subtask(parseInt($(this).parent().data("index")));
  });

  $("#task_box").on("click", ".close_subtask", function(e) {
    tasklist.remove_subtask(parseInt($this).parent().data("parentindex"), parseInt($(this).parent().data("index")));
  });

/*  $(".task_input").on('keyup', function(e) {
      if(e.key === 'Enter' || e.keyCode === 13) {
        alert("Hi");
      }
    }
  )
  var stage = new createjs.Stage("mycanvas");
  var rectangle = new createjs.Shape();
  rectangle.graphics.beginFill("DeepSkyBlue").drawRect(0, 0, 100, 50);
  rectangle.x = 100;
  rectangle.y = 100;
  stage.addChild(rectangle);
  stage.update();
  */
}
