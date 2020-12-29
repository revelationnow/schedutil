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

function get_field_value(div, info_translation, info_resolution_table, field_name) {
  var res = "";
  for(var i = 0; i < info_translation.length; i++) {
    if(field_name == info_translation[i][0] ) {
      var field_id = info_translation[i][1];
      for(var j = 0; j < info_resolution_table.length; j++) {
        var field_id = field_id.replace(info_resolution_table[j][0],info_resolution_table[j][1]);
      }
      res = $('#' + field_id).val();
      break;
    }
  }
  return res;
}

function set_field_value(div, info_translation, info_resolution_table, field_name, value) {

  for(var i = 0; i < info_translation.length; i++) {
    if(field_name == info_translation[i][0] ) {
      var field_id = info_translation[i][1];
      for(var j = 0; j < info_resolution_table.length; j++) {
        var field_id = field_id.replace(info_resolution_table[j][0],info_resolution_table[j][1]);
      }
      $('#' + field_id).val(value);
      break;
    }
  }

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
'          <input id="xxxx_text_field_xxxx" class="input_common core_input" placeholder="Core Name"></input>' +
'          <input id="xxxx_freq_field_xxxx" class="input_common core_clock" placeholder="Core Freq (MHz)" pattern="[0-9]+(.?[0-9]+)?"></input>' +
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
    var core_id = this.core_list.length;
    this.resolution_table[0][1] = core_id;
    this.resolution_table[1][1] = 0;
    add_element(this.core_div, this.core_list, new_core, this.core_html_template, this.translation, core_id, this.resolution_table);
    return core_id;
  }

  set_info() {
    for(var i = 0; i < this.core_list.length; i++) {
      this.core_list[i][0].set_core_info(this.core_list[i][1]);
    }
  }

  remove_core(core_number) {
    remove_element(core_number, this.core_list);
    for(var i = core_number; i < this.core_list.length; i++) {
      this.resolution_table[0][1] = i;
      update_element(this.core_html_template, this.translation, this.resolution_table, this.core_list, i);
    }
  }

  load_json(corelist_json) {
    this.core_div.empty();
    this.core_list.splice(0, this.core_list.length);
    for(var i = 0; i < corelist_json.length; i++) {
      var core_id = this.add_core();
      this.core_list[core_id][0].load_json(corelist_json[i]);
    }
  }


  generate_corelist_json() {
    var json = '"CoreList" : [';
    for(var i = 0; i < this.core_list.length; i++) {
      json = json + '{' + this.core_list[i][0].generate_core_json() + '}';
      if (i != this.core_list.length - 1) {
        json = json + ',';
      }
    }
    json = json + ']';
    return json;
  }
}

class Core {
  constructor() {
    this.core_name = "";
    this.clock_freq = 0;
    this.ctxt_switch_latency = 0;
    this.core_id = 0;
    this.info_translation = [["core_name","core_XXXXELEMENTNUMBERXXXX_text"],
      ["clock_freq","core_XXXXELEMENTNUMBERXXXX_freq"],
      ["ctxt_switch_latency","core_XXXXELEMENTNUMBERXXXX_ctx_latency"]
    ];
    this.info_resolution = [["XXXXELEMENTNUMBERXXXX",""],
                            ["XXXXPARENTELEMENTNUMBERXXXX","0"]]
  }

  set_core_info(core_div) {
    this.info_resolution[0][1] = this.core_id;
    this.core_name = get_field_value(core_div, this.info_translation, this.info_resolution, "core_name");
    this.clock_freq = get_field_value(core_div, this.info_translation, this.info_resolution, "clock_freq");
    this.ctxt_switch_latency = get_field_value(core_div, this.info_translation, this.info_resolution, "ctxt_switch_latency");
  }

  set_id(id) {
    this.core_id = id;
  }

  load_json(core_json, core_div) {
    this.core_name = core_json.CoreName;
    this.clock_freq = core_json.CoreFreq;
    this.ctxt_switch_latency = core_json.CoreCtxtLat;

    this.info_resolution[0][1] = this.core_id;
    set_field_value(core_div, this.info_translation, this.info_resolution, "core_name", this.core_name);
    set_field_value(core_div, this.info_translation, this.info_resolution, "clock_freq", this.clock_freq);
    set_field_value(core_div, this.info_translation, this.info_resolution, "ctxt_switch_latency", this.ctxt_switch_latency);

  }

  generate_core_json() {
    var json = '"CoreName": "' + this.core_name + '","CoreFreq": "' + this.clock_freq + '","CoreCtxtLat":"' + this.ctxt_switch_latency + '"';
    return json;
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
          '  <input id="xxxx_text_field_xxxx"   class="input_common input_task"  placeholder="Task Name"></input>' +
          '  <input id="xxxx_period_field_xxxx" class="input_common input_task" placeholder="Task Periodicity (us)" type="number"></input>' +
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
    return task_id;
  }

  set_info() {
    for(var i = 0; i < this.task_list.length; i++) {
      this.task_list[i][0].set_task_info(this.task_list[i][1]);
    }
  }

  load_json(tasklist_json, coreaffinity_list) {
    this.tasklist_div.empty();

    for(var i = 0; i < this.task_list.length; i++) {
      this.task_list[i][0].clear();
    }

    this.task_list.splice(0, this.task_list.length);

    for(var i = 0; i < tasklist_json.length; i++) {
      var task_id = this.add_task();
      this.task_list[task_id][0].load_json(tasklist_json[i], coreaffinity_list);

    }
  }

  add_subtask(task_number, coreaffinity_list) {
    this.task_list[task_number][0].add_subtask(coreaffinity_list);
  }

  remove_task(task_number) {
    remove_element(task_number, this.task_list);
    for(var i = task_number; i < this.task_list.length; i++) {
      this.resolution_table[0][1] = i;
      update_element(this.task_html_template, this.translation, this.resolution_table, this.task_list, i);
    }
  }

  remove_subtask(task_number, subtask_number, coreaffinity_list) {
    this.task_list[task_number][0].remove_subtask(subtask_number, coreaffinity_list);

  }

  update_all_subtask_coreaffinity(coreaffinity_list) {
    for(var i = 0; i < this.task_list.length; i++) {
      this.task_list[i][0].update_all_subtask_coreaffinity( coreaffinity_list);
    }
  }

  generate_tasklist_json() {
    var json = '"TaskList" : [';
    for(var i = 0; i < this.task_list.length; i++) {
      json = json + '{' + this.task_list[i][0].generate_task_json() + '}';
      if (i != this.task_list.length - 1) {
        json = json + ',';
      }
    }
    json = json + ']';
    return json;
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
                         ["xxxx_memsize_field_xxxx", "task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_memsize"],
                         ["xxxx_exec_time_field_xxxx", "task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_exectime"],
                         ["xxxx_earliest_start_field_xxxx", "task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_earliest_start"],
                         ["xxxx_deps_field_xxxx", "task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_deps"],
                         ["xxxx_coreaffinity_list_field_xxxx", "task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_coreaffinity_list"]
    ];
    this.subtask_html_template = '<div id="xxxx_id_field_xxxx" class="w3-display-container div_common div_per_subtask" data-index="xxxx_data_index_xxxx" data-parentindex="xxxx_parent_index_xxxx">' +
                '<legend>xxxx_legend_field_xxxx</legend>' +
                '<input type="button" id="xxxx_close_button_xxxx" class="w3-button w3-black w3-display-topright w3-black close_common close_subtask" value="&times"></input>' +
                '<input id="xxxx_text_field_xxxx" class="input_common input_subtask" placeholder="Subtask Name"></input>' +
                '<input id="xxxx_deadline_field_xxxx" class="input_common input_subtask" placeholder="Subtask deadline (us)" type="number"></input>' +
                '<input id="xxxx_memsize_field_xxxx" class="input_common input_subtask" placeholder="Input memory size (bytes)" type="number"></input>' +
                '<input id="xxxx_exec_time_field_xxxx" class="input_common input_subtask" placeholder="Execution time (cycles)" type="number"></input>' +
                '<input id="xxxx_earliest_start_field_xxxx" class="input_common input_subtask" placeholder="Earliest start time (us)" type="number"></input>' +
                '<div id="xxxx_deps_field_xxxx" class="div_common">' +
                '<legend>Dependencies</legend>' +
                '</div>' +
                '<div id="xxxx_coreaffinity_list_field_xxxx" class="div_common">' +
                '<legend>Core Affinity</legend>' +
                '</div>' +
              '</div>';
    this.resolution_table = [["XXXXELEMENTNUMBERXXXX",""],
                             ["XXXXPARENTELEMENTNUMBERXXXX",""]];
    this.info_translation = [["task_name","task_XXXXELEMENTNUMBERXXXX_text"],
                             ["periodicity","task_XXXXELEMENTNUMBERXXXX_period"]
    ];
    this.info_resolution = [["XXXXELEMENTNUMBERXXXX",""],
                            ["XXXXPARENTELEMENTNUMBERXXXX","0"]]
  }

  set_task_info(task_div) {
    this.info_resolution[0][1] = this.task_id;
    this.task_name = get_field_value(task_div, this.info_translation, this.info_resolution, "task_name");
    this.periodicity = get_field_value(task_div, this.info_translation, this.info_resolution, "periodicity");
    console.log("Num subtasks : " + this.subtask_list.length);
    for(var i = 0; i < this.subtask_list.length; i++) {
      this.subtask_list[i][0].set_subtask_info(this.subtask_list[i][1]);
    }

  }

  set_id(id) {
    this.task_id = id;
  }

  set_subtask_div(subtask_div) {
    this.subtask_list_div = subtask_div;
  }

  update_all_subtask_coreaffinity(coreaffinity_list) {
    for(var i = 0; i < this.subtask_list.length; i++) {
      this.subtask_list[i][0].remove_all_core_affinity();
      this.subtask_list[i][0].add_coreaffinity_list(coreaffinity_list);
    }
  }


  add_subtask(coreaffinity_list) {
    var new_subtask = new SubTask();
    var subtask_id = this.subtask_list.length;
    this.resolution_table[0][1] = subtask_id;
    this.resolution_table[1][1] = this.task_id;
    add_element(this.subtask_list_div, this.subtask_list, new_subtask, this.subtask_html_template, this.translation, subtask_id, this.resolution_table);
    new_subtask.set_parent_id(this.task_id);
    new_subtask.set_dependency_div( $("#task_" + this.task_id + "_subtask_" + subtask_id + "_deps") );
    new_subtask.add_all_dependencies(subtask_id);
    new_subtask.set_coreaffinity_div($("#task_"+ this.task_id + "_subtask_" + subtask_id + "_coreaffinity_list"));
    new_subtask.add_coreaffinity_list(coreaffinity_list);
    for(var i = 0; i < subtask_id; i++) {
      this.subtask_list[i][0].update_new_dependencies(subtask_id);
    }
    return subtask_id;
  }

  remove_subtask(subtask_number, coreaffinity_list) {
    remove_element(subtask_number, this.subtask_list);
    for(var i = 0; i < this.subtask_list.length; i++) {
      this.resolution_table[0][1] = i;
      update_element(this.subtask_html_template, this.translation, this.resolution_table, this.subtask_list, i);
      this.subtask_list[i][0].set_dependency_div($("#task_" + this.task_id +  "_subtask_" + i + "_deps") );
      this.subtask_list[i][0].add_all_dependencies(this.subtask_list.length);
      this.subtask_list[i][0].set_coreaffinity_div($("#task_"+ this.task_id + "_subtask_" + i + "_coreaffinity_list"));
      this.subtask_list[i][0].add_coreaffinity_list(coreaffinity_list);
    }
  }

  generate_task_json() {
    var json = '"TaskName": "' + this.task_name + '","TaskPeriod": "' + this.periodicity + '","SubtaskList":[';
    for(var i = 0; i < this.subtask_list.length; i++)    {
      json = json + '{' + this.subtask_list[i][0].generate_subtask_json() + '}';
      if (i != this.subtask_list.length - 1) {
        json += ',';
      }
    }
    json = json + ']';
    return json;
  }

  clear() {
    this.dependency_list_div.empty();
    this.coreaffinity_list_div.empty();
    this.dependency_list.splice(0, this.dependency_list.length);
    this.coreaffinity_list.splice(0, this.coreaffinity_list.length);
  }

  load_json(task_json, coreaffinity_list) {
    this.task_name = task_json.TaskName;
    this.periodicity = task_json.TaskPeriod;
    for(var i = 0; i < task_json.SubtaskList.length; i++) {
      var subtask_id = this.add_subtask(coreaffinity_list);
      this.subtask_list[subtask_id][0].load_json(task_json.SubtaskList[i], coreaffinity_list);
    }

    for(var i = 0; i < this.subtask_list.length; i++) {
      this.subtask_list[i][0].update_dependency_state(task_json.SubtaskList[i]);
    }
    this.info_resolution[0][1] = this.task_id;
    set_field_value(this.task_div, this.info_translation, this.info_resolution, "task_name", this.task_name);
    set_field_value(this.task_div, this.info_translation, this.info_resolution, "periodicity",this.periodicity);
  }
}

class SubTask {
  constructor() {
    this.subtask_name = "";
    this.deadline = "";
    this.execution_time= "";
    this.parent_task_id = 0;
    this.mem_size = "";
    this.subtask_id = 0;
    this.dependency_list = [];
    this.dependency_list_div = "";
    this.coreaffinity_list = [];
    this.coreaffinity_list_div = "";
    this.translation = [["xxxx_dep_input_field_xxxx","tXXXXPARENTELEMENTNUMBERXXXX_stXXXXELEMENTNUMBERXXXX_dXXXXDEPNUMBERXXXX_input"],
      ["xxxx_dep_label_field_xxxx","tXXXXPARENTELEMENTNUMBERXXXX_stXXXXELEMENTNUMBERXXXX_dXXXXDEPNUMBERXXXX_input"],
      ["xxxx_dep_number_field_xxxx","XXXXDEPNUMBERXXXX"],
      ["xxxx_dep_index_field_xxxx","XXXXDEPNUMBERXXXX"],
      ["xxxx_coreaffinity_input_field_xxxx","tXXXXPARENTELEMENTNUMBERXXXX_stXXXXELEMENTNUMBERXXXX_caXXXXCOREAFFINITYNUMBERXXXX_input"],
      ["xxxx_coreaffinity_label_field_xxxx","tXXXXPARENTELEMENTNUMBERXXXX_stXXXXELEMENTNUMBERXXXX_caXXXXCOREAFFINITYNUMBERXXXX_input"],
      ["xxxx_coreaffinity_number_field_xxxx","XXXXCOREAFFINITYNUMBERXXXX"],
      ["xxxx_coreaffinity_index_xxxx","XXXXCOREAFFINITYNUMBERXXXX"]
    ];
    this.dependency_html_template = '<input id="xxxx_dep_input_field_xxxx" type="checkbox" data-index="xxxx_dep_index_field_xxxx"></input>' +
                  '<label for="xxxx_dep_label_field_xxxx"><span>xxxx_dep_number_field_xxxx</span></label>';
    this.resolution_table = [["XXXXELEMENTNUMBERXXXX",""],
                             ["XXXXPARENTELEMENTNUMBERXXXX",""],
                             ["XXXXDEPNUMBERXXXX",""],
                             ["XXXXCOREAFFINITYNUMBERXXXX",""]
    ];
    this.info_translation = [["subtask_name","task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_text"],
                             ["deadline","task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_deadline"],
                             ["execution_time","task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_exectime"],
                             ["earliest_start","task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_earliest_start"],
                             ["parent_task_id","XXXXPARENTELEMENTNUMBERXXXX"],
                             ["mem_size","task_XXXXPARENTELEMENTNUMBERXXXX_subtask_XXXXELEMENTNUMBERXXXX_memsize"]
    ];

    this.info_resolution = [["XXXXELEMENTNUMBERXXXX",""],
                            ["XXXXPARENTELEMENTNUMBERXXXX","0"]]
    this.coreaffinity_html_template = '<input id="xxxx_coreaffinity_input_field_xxxx" type="checkbox" data-index="xxxx_coreaffinity_index_xxxx" checked></input>' +
                  '<label for="xxxx_coreaffinity_label_field_xxxx"><span>xxxx_coreaffinity_number_field_xxxx</span></label>';

  }

  set_id(id) {
    this.subtask_id = id;
  }

  set_subtask_info(subtask_div) {
    this.info_resolution[0][1] = this.subtask_id;
    this.info_resolution[1][1] = this.parent_task_id;
    this.subtask_name = get_field_value(subtask_div, this.info_translation, this.info_resolution, "subtask_name");
    this.deadline     = get_field_value(subtask_div, this.info_translation, this.info_resolution, "deadline");
    this.execution_time = get_field_value(subtask_div, this.info_translation, this.info_resolution, "execution_time");
    this.mem_size       = get_field_value(subtask_div, this.info_translation, this.info_resolution, "mem_size");
    this.earliest_start = get_field_value(subtask_div, this.info_translation, this.info_resolution, "earliest_start");

  }

  set_parent_id(id) {
    this.parent_task_id = id;
  }

  set_dependency_div(depdendency_div) {
    this.dependency_list_div = depdendency_div;
  }

  set_coreaffinity_div(coreaffinity_div) {
    this.coreaffinity_list_div = coreaffinity_div;
  }

  add_coreaffinity_list(coreaffinity_list) {
    for(var i = 0; i < coreaffinity_list.core_list.length; i++) {
      this.resolution_table[0][1] = this.subtask_id;
      this.resolution_table[1][1] = this.parent_task_id;
      this.resolution_table[3][1] = coreaffinity_list.core_list[i][0].core_id;
      add_element(this.coreaffinity_list_div, this.coreaffinity_list, new CoreAffinity(), this.coreaffinity_html_template, this.translation, i, this.resolution_table);
    }
  }

  remove_all_core_affinity() {
    this.coreaffinity_list_div.empty();
    this.coreaffinity_list.splice(0, this.coreaffinity_list.length);
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

  generate_subtask_json() {
    var json = '"SubtaskName": "' + this.subtask_name + '","SubtaskDeadline": "' + this.deadline + '","SubtaskMemory":"' + this.mem_size + '","SubtaskExecTime":"' + this.execution_time + '", "EarliestStart": "' + this.earliest_start + '","DependencyList":[';
    for(var i = 0; i < this.dependency_list.length; i++) {
      if(this.dependency_list[i][1].is(":checked")) {
        json = json + '"' + this.dependency_list[i][1].data("index") + '"';
        if((i != this.dependency_list.length - 1) && (this.dependency_list[i+1][1].is(":checked"))) {
          json = json + ',';
        }
      }
    }
    json += '],"CoreList":[';
    for(var i = 0; i < this.coreaffinity_list.length; i++) {
      if(this.coreaffinity_list[i][1].is(":checked")) {
        json = json + '"' + this.coreaffinity_list[i][1].data("index") + '"';
        if((i != this.coreaffinity_list.length - 1) && (this.coreaffinity_list[i+1][1].is(":checked"))) {
          json = json + ',';
        }
      }
    }

    json += ']';

    return json;
  }

  update_new_dependencies(last_subtask) {
    this.resolution_table[0][1] = this.subtask_id;
    this.resolution_table[1][1] = this.parent_task_id;
    this.resolution_table[2][1] = last_subtask;
    add_element(this.dependency_list_div, this.dependency_list, new Dependency() , this.dependency_html_template, this.translation, this.dependency_list.length, this.resolution_table);
  }

  load_json(subtask_json, coreaffinity_list) {
    this.subtask_name = subtask_json.SubtaskName;
    this.deadline = subtask_json.SubtaskDeadline;
    this.execution_time = subtask_json.SubtaskExecTime;
    this.mem_size = subtask_json.SubtaskMemory;
    this.earliest_start = subtask_json.SubtaskEarliestStart;

    this.info_resolution[0][1] = this.subtask_id;
    this.info_resolution[1][1] = this.parent_task_id;
    set_field_value(this.subtask_div, this.info_translation, this.info_resolution, "subtask_name", this.subtask_name);
    set_field_value(this.subtask_div, this.info_translation, this.info_resolution, "deadline", this.deadline);
    set_field_value(this.subtask_div, this.info_translation, this.info_resolution, "execution_time", this.execution_time);
    set_field_value(this.subtask_div, this.info_translation, this.info_resolution, "mem_size",this.mem_size);
    set_field_value(this.subtask_div, this.info_translation, this.info_resolution, "earliest_start", this.earliest_start);

    if(subtask_json.CoreList.length != 0) {
      for(var i = 0; i < this.coreaffinity_list.length; i++) {
        this.coreaffinity_list[i][1].prop('checked', false);
      }

      for(var i = 0; i < subtask_json.CoreList.length; i++) {
        var coreaffinity_id = parseInt(subtask_json.CoreList[i]);
        this.coreaffinity_list[coreaffinity_id][1].prop('checked', true);
      }
    }
  }

  update_dependency_state(subtask_json) {
    for(var i = 0; i < subtask_json.DependencyList.length; i++) {
      var dep_id = parseInt(subtask_json.DependencyList[i]);
      if(dep_id > this.subtask_id) {
        dep_id = dep_id - 1;
      }
      this.dependency_list[dep_id][1].prop('checked',true);
    }
  }

}


class Dependency {
  constructor() {
    this.dependency_id = 0;
  }

  set_id(id) {
    this.depdendency_id = id;
  }
}

class CoreAffinity {
  constructor() {
    this.coreaffinity_id = 0;
  }

  set_id(id) {
    this.coreaffinity_id = id;
  }
}


class Scheduler {
  constructor () {
    this.corelist = new CoreList();
    this.tasklist = new TaskList();
  }

  add_core() {
    this.corelist.add_core();
    this.tasklist.update_all_subtask_coreaffinity(this.corelist);
  }

  remove_core(corenum) {
    this.corelist.remove_core(corenum);
    this.tasklist.update_all_subtask_coreaffinity(this.corelist);
  }

  add_task() {
    this.tasklist.add_task();
  }

  remove_task(tasknum) {
    this.tasklist.remove_task(tasknum);
  }

  add_subtask(tasknum) {
    this.tasklist.add_subtask(tasknum, this.corelist);
  }

  remove_subtask(tasknum, subtasknum) {
    this.tasklist.remove_subtask(tasknum, subtasknum, this.corelist);
  }

  generate_schedule_json() {
    this.corelist.set_info();
    this.tasklist.set_info();
    var json = '{' + this.corelist.generate_corelist_json() + ',' + this.tasklist.generate_tasklist_json() + '}';
    console.log(json);
    return json;

  }

  show_json_view() {
    var json = this.generate_schedule_json();
    var json_pretty = JSON.stringify(JSON.parse(json),null,4);
    $("#json_view_popup_content").html('<code>' + json_pretty + '</code>');
    $("#json_view_popup").show();
  }

  hide_json_view() {
    $("#json_view_popup").hide();
  }

  show_json_load() {
    $("#json_load_popup").show();
  }

  hide_json_load() {
    $("#json_load_popup").hide();
  }

  load_json() {
    var res = confirm("Any existing content will be cleared and overwritten");

    if(res == true) {
      var json = JSON.parse($("#json_load_popup_data").val());
      console.log(json);
      this.corelist.load_json(json.CoreList);
      this.tasklist.load_json(json.TaskList, this.corelist);
      this.hide_json_load();
    }
  }
}

var scheduler;

function init()
{
  scheduler = new Scheduler();

  $("#update").on("click", function(e) {
    scheduler.generate_schedule_json();
  });

  $("#show_json").on("click", function(e) {
    scheduler.show_json_view();
  });

  $("#json_view_popup_close").on("click", function(e) {
    scheduler.hide_json_view();
  });

  $("#load_json").on("click", function(e) {
    scheduler.show_json_load();
  });

  $("#json_load_popup_close").on("click", function(e) {
    scheduler.hide_json_load();
  });

  $("#json_load_popup_update").on("click", function(e) {
    scheduler.load_json();
  });


  $("#add_core_button").on("click", function (e) {
    scheduler.add_core();
  });

  $("#core_box").on("click", ".close_core", function(e) {
    scheduler.remove_core(parseInt($(this).parent().data("index")));
  });

  $("#add_task_button").on("click", function (e) {
    scheduler.add_task();
  });

  $("#task_box").on("click", ".close_task", function(e) {
    scheduler.remove_task(parseInt($(this).parent().data("index")));
  });

  $("#task_box").on("click", ".add_subtask_button", function(e) {
    scheduler.add_subtask(parseInt($(this).parent().data("index")));
  });

  $("#task_box").on("click", ".close_subtask", function(e) {
    scheduler.remove_subtask(parseInt($(this).parent().data("parentindex")), parseInt($(this).parent().data("index")));
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
