
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const CHECK_INTERVAL = 1;

let label, button, file, timeout;

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: false,
                          can_focus: false,
                          x_fill: true,
                          y_fill: false,
                          track_hover: false });

    file = Gio.file_new_for_path('/proc/acpi/bbswitch');

    label = new St.Label();
    button.set_child(label);
    timeout = GLib.timeout_add_seconds(
      GLib.PRIORITY_DEFAULT,
      CHECK_INTERVAL,
      _updateState
    );
}

function _updateState() {
  file.load_contents_async(null, function(f, res) {
    let contents;
    try {
      contents = file.load_contents_finish(res)[1];
    } catch (e) {
      log('bbswitch-status error:' + e.message);
      return;
    }
    let state = contents.toString().indexOf('ON') >= 0;
    label.set_text(state ? 'd' : 'i');
  });
  return true;
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
