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

  clear() {
    for(var i = 0; i < this.task_list.length; i++) {
      this.task_list[i][0].clear();
    }
    this.tasklist_div.empty();
    this.task_list.splice(0, this.task_list.length);
  }

  load_json(tasklist_json, coreaffinity_list) {
    this.clear();

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

  build_dependency_tree() {
    // Use adjacency List
    this.adjacency_lists = [];
    for(var i = 0; i < this.task_list.length; i++) {
      this.adjacency_lists.push([]);
    }
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
    for(var i = 0; i < this.subtask_list.length; i++) {
      this.subtask_list[i][0].clear();
    }
    this.subtask_list_div.empty();
    this.subtask_list.splice(0, this.subtask_list.length);
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

  clear() {
    this.dependency_list_div.empty();
    this.coreaffinity_list_div.empty();
    this.dependency_list.splice(0, this.dependency_list.length);
    this.coreaffinity_list.splice(0, this.coreaffinity_list.length);
  }

  set_subtask_info(subtask_div) {
    this.info_resolution[0][1] = this.subtask_id;
    this.info_resolution[1][1] = this.parent_task_id;
    this.subtask_name = get_field_value(subtask_div, this.info_translation, this.info_resolution, "subtask_name");
    this.deadline     = get_field_value(subtask_div, this.info_translation, this.info_resolution, "deadline");
    this.execution_time = get_field_value(subtask_div, this.info_translation, this.info_resolution, "execution_time");
    this.mem_size       = get_field_value(subtask_div, this.info_translation, this.info_resolution, "mem_size");
    this.earliest_start = get_field_value(subtask_div, this.info_translation, this.info_resolution, "earliest_start");
    for(var i = 0; i < this.dependency_list.length; i++) {
      this.dependency_list[i][0].set_state(this.dependency_list[i][1]);
    }

    for(var i = 0; i < this.coreaffinity_list.length; i++) {
      this.coreaffinity_list[i][0].set_state(this.coreaffinity_list[i][1]);
    }

  }

  set_parent_id(id) {
    this.parent_task_id = id;
  }

  set_dependency_div(dependency_div) {
    this.dependency_list_div = dependency_div;
  }

  set_coreaffinity_div(coreaffinity_div) {
    this.coreaffinity_list_div = coreaffinity_div;
  }

  add_coreaffinity_list(coreaffinity_list) {
    for(var i = 0; i < coreaffinity_list.core_list.length; i++) {
      var new_coreaffinity = new CoreAffinity();
      new_coreaffinity.set_core_id(coreaffinity_list.core_list[i][0].core_id);
      this.resolution_table[0][1] = this.subtask_id;
      this.resolution_table[1][1] = this.parent_task_id;
      this.resolution_table[3][1] = coreaffinity_list.core_list[i][0].core_id;
      add_element(this.coreaffinity_list_div, this.coreaffinity_list, new_coreaffinity, this.coreaffinity_html_template, this.translation, i, this.resolution_table);
    }
  }

  remove_all_core_affinity() {
    this.coreaffinity_list_div.empty();
    this.coreaffinity_list.splice(0, this.coreaffinity_list.length);
  }

  add_all_dependencies(last_subtask) {
    for(var i = 0; i < last_subtask; i++) {
      if(i != this.subtask_id) {
        var new_dep = new Dependency();
        new_dep.set_subtask_id(i);
        this.resolution_table[0][1] = this.subtask_id;
        this.resolution_table[1][1] = this.parent_task_id;
        this.resolution_table[2][1] = i;
        add_element(this.dependency_list_div, this.dependency_list, new_dep , this.dependency_html_template, this.translation, i, this.resolution_table);
      }
    }
  }

  generate_subtask_json() {
    var json = '"SubtaskName": "' + this.subtask_name + '","SubtaskDeadline": "' + this.deadline + '","SubtaskMemory":"' + this.mem_size + '","SubtaskExecTime":"' + this.execution_time + '", "SubtaskEarliestStart": "' + this.earliest_start + '","DependencyList":[';
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
    var new_dep = new Dependency();
    new_dep.set_subtask_id(last_subtask);
    this.resolution_table[0][1] = this.subtask_id;
    this.resolution_table[1][1] = this.parent_task_id;
    this.resolution_table[2][1] = last_subtask;
    add_element(this.dependency_list_div, this.dependency_list, new_dep , this.dependency_html_template, this.translation, this.dependency_list.length, this.resolution_table);
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
        this.coreaffinity_list[i][0].set_state(this.coreaffinity_list[i][1]);
      }

      for(var i = 0; i < subtask_json.CoreList.length; i++) {
        var coreaffinity_id = parseInt(subtask_json.CoreList[i]);
        this.coreaffinity_list[coreaffinity_id][1].prop('checked', true);
        this.coreaffinity_list[coreaffinity_id][0].set_state(this.coreaffinity_list[coreaffinity_id][1]);
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
      this.dependency_list[dep_id][0].set_state(this.dependency_list[dep_id][1]);
    }
  }

}


class Dependency {
  constructor() {
    this.dependency_id = 0;
    this.subtask_id = 0;
    this.dependency_state = false;
  }

  set_id(id) {
    this.dependency_id = id;
  }

  set_state(dependency_div) {
    this.dependency_state = dependency_div.prop('checked');
  }

  set_subtask_id(subtask_id) {
    this.subtask_id = subtask_id;
  }
}

class CoreAffinity {
  constructor() {
    this.coreaffinity_id = 0;
    this.core_id = 0;
    this.coreaffinity_state = false;
  }

  set_id(id) {
    this.coreaffinity_id = id;
  }

  set_state(coreaffinity_div) {
    this.coreaffinity_state = coreaffinity_div.prop('checked');
  }
  set_core_id(core_id) {
    this.core_id = core_id;
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

  draw_schedule(sched_result, prio_json) {

    var cores = new vis.DataSet();
    for(var i = 0; i < prio_json.CoreList.length; i++) {
      cores.add({id: i,
                 content:prio_json.CoreList[i].CoreName,
                 value:i});
    }

    var sched_data_vis = new vis.DataSet();
    var item_id = 0;
    for(var core_id = 0; core_id < sched_result.length; core_id++) {
      for(var job_id = 0; job_id < sched_result[core_id].length; job_id++) {
        var task_name = prio_json.TaskList[sched_result[core_id][job_id].job['task']].TaskName;
        var subtask_name = prio_json.TaskList[sched_result[core_id][job_id].job['task']].SubtaskList[sched_result[core_id][job_id].job['subtask']].SubtaskName;


        var item_row = {id      : item_id,
                        group   : core_id,
                        content : '<span class="timeline_item_content">' + task_name + " : " + subtask_name + '</span>',
          title   : "Task : " + task_name + "<br>Subtask : " + subtask_name + "<br>Start (us) :" + parseInt(sched_result[core_id][job_id].current_time).toString() + "<br>End (us): " + parseInt(sched_result[core_id][job_id].current_time + sched_result[core_id][job_id].job['time_executed']).toString(),
                        start   : new Date(parseInt(sched_result[core_id][job_id].current_time)),
                        end     : new Date(parseInt(sched_result[core_id][job_id].current_time + sched_result[core_id][job_id].job['time_executed'] )),
                        className  : 'timeline_item',
                        type:'range'
                       };

        sched_data_vis.add(item_row);
        item_id = item_id + 1;
      }
    }


    var container = document.getElementById('timeline_div');
    $('#timeline_div').empty();
    var timeline = new vis.Timeline(container);
    var options = {
      stack:false,
      height:'500px',
      start:new Date(0),
      min: new Date(0),
      end: new Date(500),
      snap: null

    };
    timeline.setOptions(options);
    timeline.setGroups(cores);
    timeline.setItems(sched_data_vis);
    var num_marker_slots = 20;
    for(var i = 0; i < num_marker_slots; i++) {
      timeline.addCustomTime(new Date(125 * i),i);
      timeline.setCustomTimeMarker((125 * i).toString(),i);
      timeline.customTimes[timeline.customTimes.length - 1].hammer.off("panstart panmove panend");
    }
    timeline.addCustomTime(new Date(60),num_marker_slots);
    timeline.setCustomTimeMarker("Move me!",num_marker_slots);
    timeline.on("timechange", function(properties) {
      console.log(properties.time.getTime());
      timeline.setCustomTimeTitle(properties.time.getTime() , properties.id);
      timeline.customTimes[num_marker_slots].bar.innerHTML = '<div style=\"position: relative; top: 0px; left: -10px; height: 100%; width: 20px; touch-action: none; user-select: none;\"></div><div class=\"vis-custom-time-marker\" style=\"position: absolute;\">'  + properties.time.getTime().toString() + '</div>';
    });


    /*
    var container = document.getElementById('right');
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();

    dataTable.addColumn({type: 'string', id:'Core id'});
    dataTable.addColumn({type: 'string', id:'Task name'});
    dataTable.addColumn({type: 'date', id:'Start'});
    dataTable.addColumn({type: 'date', id:'End'});

    for (var core_id = 0; core_id < sched_result.length; core_id++) {
      for (var job_id = 0; job_id < sched_result[core_id].length; job_id++) {

        var task_name = prio_json.TaskList[sched_result[core_id][job_id].job['task']].TaskName;
        var subtask_name = prio_json.TaskList[sched_result[core_id][job_id].job['task']].SubtaskList[sched_result[core_id][job_id].job['subtask']].SubtaskName;
        var core_name = prio_json.CoreList[core_id].CoreName;
        var data_row = [core_name , task_name + ":" + subtask_name, new Date(parseInt(sched_result[core_id][job_id].current_time)), new Date(parseInt(sched_result[core_id][job_id].current_time + sched_result[core_id][job_id].job['time_executed'] ))  ];
        dataTable.addRows([data_row]);
      }
    }
    */

/*
    dataTable.addRows([
      ['Core 0', new Date(0), new Date(100)],
      ['Core 0', new Date(100), new Date(120)],
      ['Core 0', new Date(120), new Date(160)],
      ['Core 0', new Date(180), new Date(220)],
      ['Core 0', new Date(230), new Date(250)],
      ['Core 1', new Date(0), new Date(50)],
      ['Core 1', new Date(50), new Date(150)],
      ['Core 1', new Date(150), new Date(230)],
      ['Core 1', new Date(250), new Date(330)]
    ]);*/

    /*
    var options = {
      height:500,
      width:4000
      };
    chart.draw(dataTable, options);
    */
  }

  load_charts_and_draw(sched_result, priority_assigned_json) {
    /*
    var stage = new createjs.Stage(canvas_name);
    var rectangle = new createjs.Shape();
    rectangle.graphics.beginFill("DeepSkyBlue").drawRect(0,0,100,50);
    rectangle.x = 100;
    rectangle.y = 100;
    stage.addChild(rectangle);
    stage.update();
    */
   this.draw_schedule(sched_result, priority_assigned_json);
  }

  build_dependency_tree(json) {
    // Separate Trees for each Task
    // Look for independent subtask in each task
    // Connect to each task that depends on it
    // More Graph than Tree
    return this.create_adj_list(json);
  }

  solve_dependency_tree(prio_json, adj_list_obj) {
    // Requires exponential time solution, however dependencies should reduce search space significantly
    // In general job with earlier deadline is higher priority
    // if not enough cores are available, higher priority job will be scheduled. Each combination of
    // job, core combination needs to be tried for the ready jobs
    // A job is ready when all its dependencies are completed
    // The output looks like a list of all possible workable schedules
    // Output will contain a list per core of the job scheduled and the timestamp of the schedule

    // Create a ready list of subtasks, starting with independent subtasks
    var ready_list = [];
    for(var i = 0; i < adj_list_obj.indep_subtasks.length; i++) {
      for(var j = 0; j < adj_list_obj.indep_subtasks[i].length; j++) {
        adj_list_obj.indep_subtasks[i][j].time_executed = 0;
        ready_list.push(adj_list_obj.indep_subtasks[i][j]);
      }
    }

    var waiting_list = [];
    for(var i = 0; i < adj_list_obj.dep_subtasks.length; i++) {
      for(var j = 0; j < adj_list_obj.dep_subtasks[i].length; j++) {
        adj_list_obj.dep_subtasks[i][j].time_executed = 0;
        waiting_list.push(adj_list_obj.dep_subtasks[i][j]);
      }
    }


    // Create output structure, a list per core of job scheduled and timestamp
    var sched_list = new Array(prio_json.CoreList.length);
    var core_state = new Array(prio_json.CoreList.length);
    var current_time = 0;
    var earliest_cores_busy_till = Number.MAX_SAFE_INTEGER;

    for(var i = 0; i < core_state.length; i++) {
      core_state[i] = [];
      core_state[i]['in_use'] = false;
      core_state[i]['busy_till'] = 0;
      core_state[i]['last_scheduled_at'] = 0;
      core_state[i]['job'] = null;

      sched_list[i] = [];
//      sched_list[i]['job'] = null;
//      sched_list[i]['current_time'] = 0;
    }

    // Create a first dummy schedule
    while(waiting_list.length > 0 || ready_list.length > 0) {
      var job_to_schedule = null;
      var core_to_use = null;
      var found = false;
      var list_index_to_splice = 0;
      var job_to_unschedule = -1;
      var unsched_job_runtime = 0;
      var earliest_time_across_jobs = Number.MAX_SAFE_INTEGER;
      //Search for next job to schedule
      for(var i = 0; i < ready_list.length; i++) {
        var job = ready_list[i];
        //Run this job on first core in its coreaffinity list if it is free, else go to next one and try again
        for(var j = 0; j < prio_json.TaskList[job.task].SubtaskList[job.subtask].CoreList.length; j++) {
          var preferred_core = parseInt(prio_json.TaskList[job.task].SubtaskList[job.subtask].CoreList[j]);
          var earliest_start = parseInt(prio_json.TaskList[job.task].SubtaskList[job.subtask].SubtaskEarliestStart);

          earliest_time_across_jobs = Math.min(earliest_start, earliest_time_across_jobs);
          console.log('Prefered core ' + preferred_core);

          var current_job_on_core = core_state[preferred_core]['job'];

          if(earliest_start <= current_time) {
            if( core_state[preferred_core]['in_use'] == false ) {
              job_to_schedule = job;
              core_to_use = preferred_core;
              found = true;
              list_index_to_splice = i;
              break;
            }
            //If the current task on the preferred core is lower priority, then replace it with the new task
            else if(prio_json.TaskList[job.task].SubtaskList[job.subtask].SubtaskPriority > prio_json.TaskList[current_job_on_core.task].SubtaskList[current_job_on_core.subtask].SubtaskPriority) {
              job_to_schedule = job;
              core_to_use = preferred_core;
              found = true;
              list_index_to_splice = i;
              job_to_unschedule = current_job_on_core;
              unsched_job_runtime = current_job_on_core.time_executed + current_time - core_state[preferred_core]['last_scheduled_at'];
              break;

            }
          }
        }

        if(found == true) {
          break;
        }
      }

      // Insert the job into the sched list and mark the core as busy
      // If no job could be scheduled then advance the time and see if
      // any cores become free

      if(found == true) {
        var sched_update = [];
        sched_update['job'] = job_to_schedule;
        sched_update['current_time'] = current_time;
        sched_list[core_to_use].push(sched_update);
        core_state[core_to_use]['in_use'] = true;
        var exec_time_us = (parseInt(prio_json.TaskList[job_to_schedule.task].SubtaskList[job_to_schedule.subtask].SubtaskExecTime) - job_to_schedule.time_executed )/parseFloat(prio_json.CoreList[core_to_use].CoreFreq);
        core_state[core_to_use]['busy_till'] = current_time + exec_time_us;
        core_state[core_to_use]['job'] = job_to_schedule;
        core_state[core_to_use]['last_scheduled_at'] = current_time;
        earliest_cores_busy_till = Math.min(core_state[core_to_use]['busy_till'] , earliest_cores_busy_till);
        ready_list.splice(list_index_to_splice, 1);
        if (job_to_unschedule != -1) {
          job_to_unschedule.time_executed = unsched_job_runtime;
          ready_list.push(job_to_unschedule);
        }

        console.log("Job scheduled : ");
        console.log(job_to_schedule);
        console.log("Core busy till : ",earliest_cores_busy_till);
      }
      else {
        // Move current time forward and update the core states accordingly
        if(earliest_cores_busy_till != Number.MAX_SAFE_INTEGER) {
          current_time = earliest_cores_busy_till;
          earliest_cores_busy_till = Number.MAX_SAFE_INTEGER;

          // Update state of the cores that have completed processing and add new jobs to the ready list.
          for(var core_id = 0; core_id < core_state.length; core_id++) {
            if(((current_time + 0.001) >= core_state[core_id]['busy_till']) && (core_state[core_id]['in_use'] == true)) {

              sched_list[core_id][sched_list[core_id].length - 1].job.time_executed = current_time - sched_list[core_id][sched_list[core_id].length - 1].current_time;

              core_state[core_id]['in_use'] = false;
              var task_id = core_state[core_id]['job']['task'];
              var subtask_id = core_state[core_id]['job']['subtask'];
              var adj_list = adj_list_obj.adj_lists[task_id];
              for(var adj_id = 0; adj_id < adj_list.length; adj_id++) {
                if(adj_list[adj_id][subtask_id] == 1) {
                  //Need mechanism to check that all dependencies are satisfied TODO. for now just assume single dep
                  var st_list_obj = [];
                  st_list_obj['task'] = task_id;
                  st_list_obj['subtask'] = adj_id;
                  st_list_obj['time_executed'] = 0;
                  ready_list.push(st_list_obj);

                  for(var wl_id = 0; wl_id < waiting_list.length; wl_id++) {
                    if((waiting_list[wl_id]['task'] == task_id) && (waiting_list[wl_id]['subtask'] == adj_id)) {
                      waiting_list.splice(wl_id , 1);
                      break;
                    }
                  }
                }
              }
            }
            else if(core_state[core_id]['in_use'] == true) {
              earliest_cores_busy_till = Math.min(earliest_cores_busy_till, core_state[core_id]['busy_till']);
            }
          }
        }
        else if(earliest_time_across_jobs != Number.MAX_SAFE_INTEGER) {
          current_time = Math.max(current_time, earliest_time_across_jobs);
          earliest_time_across_jobs = Number.MAX_SAFE_INTEGER;
        }
        else {
          console.assert(0, "Schedule Failed");
          return;
        }

      }

    }

    console.log(sched_list);
    return sched_list;

  }
  create_adj_list(graph_json) {

    var adj_list_obj = [];
    adj_list_obj.adj_lists = [];
    adj_list_obj.indep_subtasks = [];
    adj_list_obj.dep_subtasks = [];
    for(var i = 0; i < graph_json.TaskList.length; i++) {

      //Create storage for Adj List
      var this_task = graph_json.TaskList[i];
      var thisList = new Array(this_task.SubtaskList.length);
      var thisIndepSubtaskList = [];
      var thisDepSubtaskList = [];
      for(var j = 0; j < thisList.length; j++) {
        thisList[j] = new Array(thisList.length);
      }

      //Start filling Adj list
      for(var j = 0; j < thisList.length; j++) {
        if(this_task.SubtaskList[j].DependencyList.length == 0 ) {
          var st_list_obj = [];
          st_list_obj['task'] = i;
          st_list_obj['subtask'] = j;
          thisIndepSubtaskList.push(st_list_obj);
        }
        else {
          var st_list_obj = [];
          st_list_obj['task'] = i;
          st_list_obj['subtask'] = j;
          thisDepSubtaskList.push(st_list_obj);

        }
        for(var k = 0; k < thisList.length; k++) {
          thisList[j][k] = 0;
          if( j != k ) {
            for(var l = 0; l < this_task.SubtaskList[j].DependencyList.length; l++) {
              if (k == this_task.SubtaskList[j].DependencyList[l] ) {
                thisList[j][k] = 1;
                break;
              }
            }
          }
        }
      }

      adj_list_obj.adj_lists.push(thisList);
      adj_list_obj.indep_subtasks.push(thisIndepSubtaskList);
      adj_list_obj.dep_subtasks.push(thisDepSubtaskList);
    }
    console.log(adj_list_obj);
    return adj_list_obj;
  }

  add_repeat_tasks(json) {
    //TODO : Add additional tasks for repetition : Basically the task with longest deadline should run 3 times and the other tasks should repeat until the end of the last deadline of the task with the longest deadline
    //
    //Find task with highest period
    var max_period = json.TaskList[0].TaskPeriod;
    var max_period_id = 0;
    for(var i = 0; i < json.TaskList.length; i++) {
      //TODO : Ideally this should come from the start time of the earliest subtask.
      json.TaskList[i].StartTime = 0;
      json.TaskList[i].TaskId = i;
      if(max_period < json.TaskList[i].TaskPeriod) {
        max_period = json.TaskList[i].TaskPeriod;
        max_period_id = i;
      }
      for(var j = 0; j < json.TaskList[i].SubtaskList.length; j++ ) {
        json.TaskList[i].SubtaskList[j].SubtaskId = j;
      }
    }

    //Add 3 more of the longest task and then accordingly additional for the rest
    var num_repeats_to_add = 2;
    var period_for_repeats = max_period * num_repeats_to_add;

    //Add additional tasks for each task, but change the subtask earliers start time by the task period times the index of the dummy task
    var orig_task_list_len = json.TaskList.length;
    for(var i = 0; i < orig_task_list_len; i++) {
      var num_repeats = (parseInt(period_for_repeats) + parseInt(json.TaskList[i].TaskPeriod) - 1)/parseInt(json.TaskList[i].TaskPeriod);
      console.log(period_for_repeats + ": " + json.TaskList[i].TaskPeriod);
      console.log(num_repeats);
      for(var j = 0; j < num_repeats; j++) {
        // JSON method of deep cloning an object
        var task = JSON.parse(JSON.stringify(json.TaskList[i]));
        task.TaskName += '_r' + j.toString();
        task.StartTime = task.StartTime + ((j+1) * parseInt(json.TaskList[i].TaskPeriod));
        for(var k = 0; k < task.SubtaskList.length; k++) {
          task.SubtaskList[k].SubtaskName += '_r' + j.toString();
          task.SubtaskList[k].SubtaskEarliestStart = parseInt(task.SubtaskList[k].SubtaskEarliestStart) + parseInt(task.TaskPeriod) * (j + 1);
        }
        task.TaskId = json.TaskList.length;
        json.TaskList.push(task);
      }
    }
    return json;
  }

  sort_by_deadline(json) {
    json.TaskList = json.TaskList.sort(function(task1, task2) { return (parseInt(task1.StartTime) + parseInt(task1.TaskPeriod)) - (parseInt(task2.StartTime) + parseInt(task2.TaskPeriod));  } );
    console.log(json);
    return json;
  }

  assign_task_priorities_helper(json, adj_list_obj, task_id, subtask_id) {
    // The adjacency list is in order of the task ids in the TaskList
    console.log(task_id);
    for(var dep_subtask_id = 0; dep_subtask_id < adj_list_obj.adj_lists[task_id][subtask_id].length; dep_subtask_id++) {
      if(dep_subtask_id != subtask_id) {
        if(adj_list_obj.adj_lists[task_id][dep_subtask_id][subtask_id] == 1) {
          json.TaskList[task_id].SubtaskList[dep_subtask_id].SubtaskPriority = Math.max(json.TaskList[task_id].SubtaskList[dep_subtask_id].SubtaskPriority, json.TaskList[task_id].SubtaskList[subtask_id].SubtaskPriority + 1);
          this.assign_task_priorities_helper(json, adj_list_obj, task_id, dep_subtask_id);
        }
      }
    }
  }

  assign_task_priorities(json, adj_list_obj) {
    //TODO : Assign priorities based on deadlines. The further the deadline, the lower the priority of the task. WIthin the task the subtasks should be assigned priority such that the independent tasks have the lower priority and each dependent task has one level higher priority than it's predecessors
    // Sort tasks based on their deadlines then within each task sort them based on their dependency

    // Initialize all subtask priorities to 0 first
    for(var task_id = 0; task_id < json.TaskList.length; task_id++) {
      for(var subtask_id = 0; subtask_id < json.TaskList[task_id].SubtaskList.length; subtask_id++) {
        json.TaskList[task_id].SubtaskList[subtask_id].SubtaskPriority = 0;
      }
    }

    // Starting from independent tasks assign priorities to the rest
    for(var i = 0; i < adj_list_obj.indep_subtasks.length; i++) {
      for(var j = 0; j < adj_list_obj.indep_subtasks[i].length; j++) {
        var task_id = adj_list_obj.indep_subtasks[i][j]['task'];
        var subtask_id = adj_list_obj.indep_subtasks[i][j]['subtask'];

        this.assign_task_priorities_helper(json, adj_list_obj, task_id, subtask_id);
      }

    }

    console.log(json);


    return json;

  }

  create_schedule(canvas_obj) {
    var json_str = this.generate_schedule_json();
    var original_json = JSON.parse(json_str);
    var repeat_task_json = this.add_repeat_tasks(original_json);
    var sort_repeat_task_json = this.sort_by_deadline(repeat_task_json);
    var adj_list_obj = this.build_dependency_tree(sort_repeat_task_json);
    var priority_assigned_json = this.assign_task_priorities(repeat_task_json, adj_list_obj);
    var sched_result = this.solve_dependency_tree(priority_assigned_json, adj_list_obj);
    this.load_charts_and_draw(sched_result, priority_assigned_json);
  }
}

var scheduler
function init()
{
  scheduler = new Scheduler();
  $("#update").on("click", function(e) {
    scheduler.create_schedule('mycanvas');
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
