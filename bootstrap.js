const { classes: Cc, interfaces: Ci, utils: Cu } = Components;

Cu.import("resource://gre/modules/Home.jsm");
Cu.import("resource://gre/modules/HomeProvider.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/Task.jsm");


const PANEL_ID = "com.margaretleibovic.test";
const PANEL_TITLE = "Margaret's Test";

const DATASET_ID = "com.margaretleibovic.test.data";

// Keep track of the message id so that we can remove it.
var gMessageIds = [];

function addBanners() {
  gMessageIds.push(Home.banner.add({
    // 140 characters
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec purus in ante pretium blandit. Aliquam erat volutpat. Nulla libero lectus.",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAYAAADnRuK4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGODdGMTE3NDA3MjA2ODExODA4M0ZCMjlBOUNFMjIzMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1REEyRTc3MDI2RjgxMUUyQjU0MkM0MUI5QkQ5Q0M5MCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1REEyRTc2RjI2RjgxMUUyQjU0MkM0MUI5QkQ5Q0M5MCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUFFMzIzNjg1RDIwNjgxMTgwODNGNjIyRUVCN0ExRkUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Rjg3RjExNzQwNzIwNjgxMTgwODNGQjI5QTlDRTIyMzEiLz4gPC9yZGY6RGVzY3Jp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",
    onclick: function() {
      Services.console.logStringMessage("Demo banner message clicked");
    },
    onshown: function() {
      Services.console.logStringMessage("Demo banner message shown");
    }
  }));

  gMessageIds.push(Home.banner.add({
    text: "32x32 data URI",
    icon: "data:image/png;base64,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"
  }));
}

function saveData() {
  Task.spawn(function saveDataTask() {
    let storage = HomeProvider.getStorage(DATASET_ID);
    yield storage.deleteAll();
    yield storage.save([{
      "url": "http://mozilla.org",
      "title": "Mozilla",
      "description": "This is an example"
    }, {
      "url": "http://margaretleibovic.com",
      "title": "Margaret Leibovic",
      "description": "This is a second example"
    }, {
      "url": "http://nytimes.com",
      "title": "New York Times",
      "description": "Yet another example"
    }]);
  }).then(function(result) {
    dump("*** saveDataTask: result - " + JSON.stringify(result));
  }, function(error) {
    dump("*** saveDataTask: error - " + JSON.stringify(error));    
  });
}

function addSync() {
  Services.prefs.setIntPref("home.sync.checkIntervalSecs", 5);
  let count = 0;

  HomeProvider.addPeriodicSync(DATASET_ID, 15, function syncCallback(){
    dump("*** periodic sync callback ***");

    saveData();

    count++;
    if (count == 2) {
      dump("*** removing periodic sync ***");
      HomeProvider.removePeriodicSync(DATASET_ID);
      Services.prefs.clearUserPref("home.sync.checkIntervalSecs");
    }
  });
}

function loadIntoWindow(window) {
  //addBanners();

  Home.panels.add({
    id: PANEL_ID,
    title: PANEL_TITLE,
    layout: Home.panels.Layout.FRAME,
    views: [{
      type: Home.panels.View.LIST,
      dataset: DATASET_ID
    }],
    autoInstall: true
  });

  saveData();
}

function unloadFromWindow(window) {
  gMessageIds.forEach(id => Home.banner.remove(id));

  Home.panels.remove(PANEL_ID);
}

/**
 * bootstrap.js API
 */
var windowListener = {
  onOpenWindow: function(aWindow) {
    // Wait for the window to finish loading
    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
    domWindow.addEventListener("load", function() {
      domWindow.removeEventListener("load", arguments.callee, false);
      loadIntoWindow(domWindow);
    }, false);
  },
  
  onCloseWindow: function(aWindow) {
  },
  
  onWindowTitleChange: function(aWindow, aTitle) {
  }
};

function startup(aData, aReason) {
  let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);

  // Load into any existing windows
  let windows = wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    loadIntoWindow(domWindow);
  }

  // Load into any new windows
  wm.addListener(windowListener);
}

function shutdown(aData, aReason) {
  // When the application is shutting down we normally don't have to clean
  // up any UI changes made
  if (aReason == APP_SHUTDOWN)
    return;

  let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);

  // Stop listening for new windows
  wm.removeListener(windowListener);

  // Unload from any existing windows
  let windows = wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    unloadFromWindow(domWindow);
  }
}

function install(aData, aReason) {
}

function uninstall(aData, aReason) {
}
