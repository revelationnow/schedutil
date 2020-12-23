function update_template(template, translation, resolution_table) {
  for(var i = 0; i < translation.length; i++) {
    template = template.replace(translation[i][0], translation[i][1]);
    for(var j = 0; j < resolution_table.length; j++) {
      template = template.replace(resolution_table[j][0], resolution_table[j][1]);
    }
  }
  console.log(template);
  return template;
}

function add_element(parent, list, new_object, template, translation, self_count, resolution_table) {

  new_element_html = update_template(template, translation, resolution_table );
  var new_element = $(new_element_html);
  parent.append(new_element);
  new_object.set_id(self_count);
  list.push([new_object, new_element]);
  return new_element;
}

function remove_element(element_number, element_list) {
  var element = element_list[element_number][1];
  element.remove();
  element_list.splice(element_number, 1);
}

function update_element(template, translation, resolution_table, element_list, element_number) {

    var res = update_template(template, translation, resolution_table);
    var new_element = $(res);
    element_list[element_number][1].replaceWith(new_element);
    element_list[element_number][1] = new_element;
    element_list[element_number][0].set_id(element_number);
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
    this.resolution_table = [["XXXXELEMENTNUMBERXXXX",""],
                             ["XXXXPARENTELEMENTNUMBERXXXX",""]];
  }

  add_core() {
    var new_core = new Core();
    this.resolution_table[0][1] = this.core_list.length;
    this.resolution_table[1][1] = 0;
    add_element(this.core_div, this.core_list, new_core, this.core_html_template, this.translation, this.core_list.length, this.resolution_table);
  }

  remove_core(core_number) {
    remove_element(core_number, this.core_list);
    for(var i = core_number; i < this.core_list.length; i++) {
      this.resolution_table[0][1] = i;
      update_element(this.core_html_template, this.translation, this.resolution_table, this.core_list, i);
    }
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
          '  </div>' +
          '  <input type="button" id="xxxx_subtask_btn_field_xxxx" class="w3-button w3-block w3-ripple w3-black add_button add_subtask_button" value="Add Subtask"></input>' +
          '</div>';
    this.resolution_table = [["XXXXELEMENTNUMBERXXXX",""],
                             ["XXXXPARENTELEMENTNUMBERXXXX",""]];
  }

  add_task() {
    var new_task = new Task();
    var task_id = this.task_list.length;
    this.resolution_table[0][1] = task_id;
    this.resolution_table[1][1] = 0;
    add_element(this.tasklist_div, this.task_list, new_task, this.task_html_template, this.translation, this.task_list.length, this.resolution_table);
    new_task.set_subtask_div( $("#task_" + task_id + "_subtask_box"));
  }

  add_subtask(task_number) {
    this.task_list[task_number][0].add_subtask();
  }

  remove_task(task_number) {
    remove_element(task_number, this.task_list);
    for(var i = task_number; i < this.task_list.length; i++) {
      this.resolution_table[0][1] = i;
      update_element(this.task_html_template, this.translation, this.resolution_table, this.task_list, i);
    }
  }

  remove_subtask(task_number, subtask_number) {
    this.task_list[task_number][0].remove_subtask(subtask_number);

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
    this.subtask_html_template = '<div id="xxxx_id_field_xxxx" class="w3-display-container div_common div_per_subtask" data-index="xxxx_data_index_xxxx" data-parentindex="xxxx_parent_index_xxxx">' +
                '<legend>xxxx_legend_field_xxxx</legend>' +
                '<input type="button" id="xxxx_close_button_xxxx" class="w3-button w3-black w3-display-topright w3-black close_common close_subtask" value="&times"></input>' +
                '<input id="xxxx_text_field_xxxx" class="input_common input_subtask" placeholder="Enter Subtask Name"></input>' +
                '<input id="xxxx_deadline_field_xxxx" class="input_common input_subtask" placeholder="Enter Subtask deadline (us)" type="number"></input>' +
                '<input id="xxxx_exec_time_field_xxxx" class="input_common input_subtask" placeholder="Enter execution time (cycles)" type="number"></input>' +
                '<div id="xxxx_deps_field_xxxx" class="div_common">' +
                '<legend>Dependencies</legend>'
                '</div>' +
              '</div>';
    this.resolution_table = [["XXXXELEMENTNUMBERXXXX",""],
                             ["XXXXPARENTELEMENTNUMBERXXXX",""]];
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
    var subtask_id = this.subtask_list.length;
    this.resolution_table[0][1] = subtask_id;
    this.resolution_table[1][1] = this.task_id;
    add_element(this.subtask_list_div, this.subtask_list, new_subtask, this.subtask_html_template, this.translation, subtask_id, this.resolution_table);
    new_subtask.set_dependency_div( $("#task_" + this.task_id +  "_subtask_" + subtask_id + "_deps") );
    new_subtask.add_all_dependencies(subtask_id);
    for(var i = 0; i < subtask_id; i++) {
      this.subtask_list[i][0].update_new_dependencies(subtask_id);
    }
  }



  remove_subtask(subtask_number) {
    remove_element(subtask_number, this.subtask_list);
    for(var i = 0; i < this.subtask_list.length; i++) {
      this.resolution_table[0][1] = i;
      update_element(this.subtask_html_template, this.translation, this.resolution_table, this.subtask_list, i);
      this.subtask_list[i][0].set_dependency_div($("#task_" + this.task_id +  "_subtask_" + i + "_deps") );
      this.subtask_list[i][0].add_all_dependencies(this.subtask_list.length);
    }
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
    this.dependency_list_div = "";
    this.translation = [["xxxx_dep_input_field_xxxx","tXXXXPARENTELEMENTNUMBERXXXX_stXXXXELEMENTNUMBERXXXX_dXXXXDEPNUMBERXXXX_input"],
      ["xxxx_dep_label_field_xxxx","tXXXXPARENTELEMENTNUMBERXXXX_stXXXXELEMENTNUMBERXXXX_dXXXXDEPNUMBERXXXX_input"],
      ["xxxx_dep_number_field_xxxx","XXXXDEPNUMBERXXXX"]
    ];
    this.dependency_html_template = '<input id="xxxx_dep_input_field_xxxx" type="checkbox"></input>' +
                  '<label for="xxxx_dep_label_field_xxxx"><span>xxxx_dep_number_field_xxxx</span></label>';
    this.resolution_table = [["XXXXELEMENTNUMBERXXXX",""],
                             ["XXXXPARENTELEMENTNUMBERXXXX",""],
                             ["XXXXDEPNUMBERXXXX",""]];
  }

  set_id(id) {
    this.subtask_id = id;
  }

  set_parent_id(id) {
    this.parent_task_id = id;
  }

  set_dependency_div(depdendency_div) {
    this.dependency_list_div = depdendency_div;
  }

  add_all_dependencies(last_subtask) {
    for(var i = 0; i < last_subtask; i++) {
      if(i != this.subtask_id) {
        this.resolution_table[0][1] = this.subtask_id;
        this.resolution_table[1][1] = this.parent_task_id;
        this.resolution_table[2][1] = i;
        add_element(this.dependency_list_div, this.dependency_list, new Dependency() , this.dependency_html_template, this.translation, i, this.resolution_table);
      }
    }
  }

  update_new_dependencies(last_subtask) {
    this.resolution_table[0][1] = this.subtask_id;
    this.resolution_table[1][1] = this.parent_task_id;
    this.resolution_table[2][1] = last_subtask;
    add_element(this.dependency_list_div, this.dependency_list, new Dependency() , this.dependency_html_template, this.translation, this.dependency_list.length, this.resolution_table);
  }

  set_subtask_info() {
  }
}


class Dependency {
  constructor() {
    this.dependency_id = 0;
  }

  set_id(id) {
    this.depdendency_div = id;
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
    tasklist.remove_subtask(parseInt($(this).parent().data("parentindex")), parseInt($(this).parent().data("index")));
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
