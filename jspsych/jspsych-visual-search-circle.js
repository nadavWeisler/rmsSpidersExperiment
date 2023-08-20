/**
 *
 * jspsych-visual-search-circle
 * Nadav Weisler
 *
 * display a set of objects, with or without a target, equidistant from fixation
 * subject responds to whether or not the target is present
 *
 * based on baed on Josh de Leeuw's plugin
 *
 *
 **/

jsPsych.plugins["visual-search-circle"] = (function () {
  var plugin = {};

  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'target', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'foil', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'fixation_image', 'image');

  plugin.info = {
    name: 'visual-search-circle',
    description: '',
    parameters: {
      target: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Target',
        default: undefined,
        description: 'The image to be displayed.'
      },
      foil: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Foil',
        default: undefined,
        description: 'Path to image file that is the foil/distractor.'
      },
      fixation_image: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Fixation image',
        default: undefined,
        description: 'Path to image file that is a fixation target.'
      },
      set_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Set size',
        default: undefined,
        description: 'How many items should be displayed?'
      },
      target_present: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Target present',
        default: true,
        description: 'Is the target present?'
      },
      target_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Target size',
        array: true,
        default: [50, 50],
        description: 'Two element array indicating the height and width of the search array element images. in milliseconds'
      },
      fixation_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation size',
        array: true,
        default: [12.5, 12.5],
        description: 'Two element array indicating the height and width of the fixation image. in milliseconds'
      },
      circle_diameter: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Circle diameter',
        default: 150,
        description: 'The diameter of the search array circle in milliseconds.'
      },
      target_present_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Target present key',
        default: 'j',
        description: 'The key to press if the target is present in the search array.'
      },
      target_absent_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Target absent key',
        default: 'f',
        description: 'The key to press if the target is not present in the search array.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'The maximum duration to wait for a response.'
      },
      fixation_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation duration',
        default: 1000,
        description: 'How long to show the fixation image for before the search array (in milliseconds).'
      }
    }
  }

  plugin.trial = function (display_element, trial) {
    const cm = Number(document.getElementById("dpiDiv").clientHeight);
    const diameter = trial.circle_diameter * cm;
    const radius = diameter / 2;
    const stimuli_width = trial.target_size[0] * cm;
    const stimuli_height = trial.target_size[1] * cm;

    const frame_size = diameter + stimuli_width;

    let display_locations = [];
    const possible_display_locations = trial.set_size;
    const random_offset = Math.floor(Math.random() * 360);
    for (let i = 0; i < possible_display_locations; i++) {
      display_locations.push([
        Math.floor(frame_size / 2 + (cosd(random_offset + (i * (360 / possible_display_locations))) * radius) - (stimuli_width / 2)),
        Math.floor(frame_size / 2 - (sind(random_offset + (i * (360 / possible_display_locations))) * radius) - (stimuli_height / 2))
      ]);
    }

    display_element.innerHTML += '<div id="jspsych-visual-search-circle-container" ' +
      'style="position: relative; width:' + frame_size + 'px; height:' + frame_size + 'px; background-color: black"></div>';
    var paper = display_element.querySelector("#jspsych-visual-search-circle-container");

    // show fixation
    const fixation_width = trial.fixation_size[0] * cm;
    const fixation_height = trial.fixation_size[1] * cm;
    const fixation_location = [
      Math.floor((frame_size / 2) - (fixation_width / 2)),
      Math.floor((frame_size / 2) - (fixation_height / 2))
    ];

    paper.innerHTML += "<img src='" + trial.fixation_image +
      "' style='position: absolute; top:" + fixation_location[0] + "px; left:" + fixation_location[1] + "px; " +
      "width:" + fixation_width + "px; height:" + fixation_height + "px;'></img>";

    jsPsych.pluginAPI.setTimeout(function () {
      show_search_array();
    }, trial.fixation_duration);


    function show_search_array() {
      let present_items = [];
      if (trial.target_present) {
        present_items.push(trial.target);
      }

      present_items = present_items.concat(trial.foil);

      for (var i = 0; i < display_locations.length; i++) {
        paper.innerHTML += "<img src='" + present_items[i] +
          "' style='position: absolute; top:" + display_locations[i][0] + "px; left:" + display_locations[i][1] + "px; " + 
          "width:" + stimuli_width + "px; height:" + stimuli_height + "px;'></img>";
      }

      let trial_over = false;

      const after_response = function (info) {
        trial_over = true;

        let correct = false;

        if (jsPsych.pluginAPI.compareKeys(info.key, trial.target_present_key) && trial.target_present ||
          jsPsych.pluginAPI.compareKeys(info.key, trial.target_absent_key) && !trial.target_present) {
          correct = true;
        }

        clear_display();

        end_trial(info.rt, correct, info.key);

      }

      const valid_keys = [trial.target_present_key, trial.target_absent_key];

      key_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: valid_keys,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });

      if (trial.trial_duration !== null) {
        jsPsych.pluginAPI.setTimeout(function () {

          if (!trial_over) {

            jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);

            trial_over = true;

            var rt = null;
            var correct = 0;
            var key_press = null;

            clear_display();

            end_trial(rt, correct, key_press);
          }
        }, trial.trial_duration);

      }

      function clear_display() {
        display_element.innerHTML = '';
      }
    }


    function end_trial(rt, correct, key_press) {
      const trial_data = {
        correct: correct,
        rt: rt,
        key_press: key_press,
        locations: JSON.stringify(display_locations),
        target_present: trial.target_present,
        set_size: trial.set_size
      };

      // go to next trial
      jsPsych.finishTrial(trial_data);
    }
  };

  // helper function for determining stimulus locations

  function cosd(num) {
    return Math.cos(num / 180 * Math.PI);
  }

  function sind(num) {
    return Math.sin(num / 180 * Math.PI);
  }

  return plugin;
})();
