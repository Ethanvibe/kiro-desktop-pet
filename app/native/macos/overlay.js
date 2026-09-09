ObjC.import("Cocoa");

const WIDTH = 150;
const HEIGHT = 230;
const CLICK_DISTANCE = 5;

let app;
let panel;
let petView;
let images = [];
let activeSkin = 0;
let statePath = "";
let dragMouse = null;
let dragOrigin = null;
let dragged = false;

function stringValue(value) {
  return typeof value === "string" ? value : ObjC.unwrap(value);
}

function readState() {
  const manager = $.NSFileManager.defaultManager;
  if (!manager.fileExistsAtPath($(statePath))) return null;
  const content = $.NSString.stringWithContentsOfFileEncodingError(
    $(statePath),
    $.NSUTF8StringEncoding,
    null,
  );
  if (!content) return null;
  const parts = stringValue(content).trim().split("\t");
  const skin = Number(parts[0]);
  const x = Number(parts[1]);
  const y = Number(parts[2]);
  if (![skin, x, y].every(Number.isFinite)) return null;
  return { skin: skin === 1 ? 1 : 0, x, y };
}

function saveState() {
  if (!panel) return;
  const origin = panel.frame.origin;
  const value = [activeSkin, Number(origin.x), Number(origin.y)].join("\t");
  $.NSString.stringWithString($(value)).writeToFileAtomicallyEncodingError(
    $(statePath),
    true,
    $.NSUTF8StringEncoding,
    null,
  );
}

function showSkin(index) {
  activeSkin = index === 1 ? 1 : 0;
  petView.setImage(images[activeSkin]);
}

function toggleSkin() {
  showSkin(activeSkin === 0 ? 1 : 0);
  saveState();
}

ObjC.registerSubclass({
  name: "KiroDesktopPetImageView",
  superclass: "NSImageView",
  methods: {
    "acceptsFirstMouse:": {
      types: ["bool", ["id"]],
      implementation: function () {
        return true;
      },
    },
    "mouseDown:": {
      types: ["void", ["id"]],
      implementation: function () {
        dragMouse = $.NSEvent.mouseLocation;
        dragOrigin = panel.frame.origin;
        dragged = false;
      },
    },
    "mouseDragged:": {
      types: ["void", ["id"]],
      implementation: function () {
        if (!dragMouse || !dragOrigin) return;
        const current = $.NSEvent.mouseLocation;
        const dx = Number(current.x) - Number(dragMouse.x);
        const dy = Number(current.y) - Number(dragMouse.y);
        if (Math.hypot(dx, dy) >= CLICK_DISTANCE) dragged = true;
        panel.setFrameOrigin(
          $.NSMakePoint(Number(dragOrigin.x) + dx, Number(dragOrigin.y) + dy),
        );
      },
    },
    "mouseUp:": {
      types: ["void", ["id"]],
      implementation: function () {
        if (dragged) saveState();
        else toggleSkin();
        dragMouse = null;
        dragOrigin = null;
        dragged = false;
      },
    },
  },
});

function initialOrigin(saved) {
  if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
    return $.NSMakePoint(saved.x, saved.y);
  }
  const frame = $.NSScreen.mainScreen.visibleFrame;
  return $.NSMakePoint(
    Number(frame.origin.x) + Number(frame.size.width) - WIDTH - 28,
    Number(frame.origin.y) + 28,
  );
}

function run(argv) {
  if (argv.length < 3) {
    throw new Error("expected business image, casual image and state path");
  }

  const businessPath = stringValue(argv[0]);
  const casualPath = stringValue(argv[1]);
  statePath = stringValue(argv[2]);

  images = [
    $.NSImage.alloc.initWithContentsOfFile($(businessPath)),
    $.NSImage.alloc.initWithContentsOfFile($(casualPath)),
  ];
  if (!images[0] || !images[1]) throw new Error("could not load pet images");

  const saved = readState();
  activeSkin = saved ? saved.skin : 0;
  const origin = initialOrigin(saved);

  app = $.NSApplication.sharedApplication;
  app.setActivationPolicy($.NSApplicationActivationPolicyAccessory);

  panel = $.NSPanel.alloc.initWithContentRectStyleMaskBackingDefer(
    $.NSMakeRect(Number(origin.x), Number(origin.y), WIDTH, HEIGHT),
    $.NSWindowStyleMaskBorderless | $.NSWindowStyleMaskNonactivatingPanel,
    $.NSBackingStoreBuffered,
    false,
  );
  panel.setOpaque(false);
  panel.setBackgroundColor($.NSColor.clearColor);
  panel.setHasShadow(false);
  panel.setLevel($.NSFloatingWindowLevel);
  panel.setHidesOnDeactivate(false);
  panel.setCollectionBehavior(
    $.NSWindowCollectionBehaviorCanJoinAllSpaces |
      $.NSWindowCollectionBehaviorFullScreenAuxiliary,
  );

  petView = $.KiroDesktopPetImageView.alloc.initWithFrame($.NSMakeRect(0, 0, WIDTH, HEIGHT));
  petView.setImageScaling($.NSImageScaleProportionallyUpOrDown);
  petView.setImageAlignment($.NSImageAlignBottom);
  panel.setContentView(petView);
  showSkin(activeSkin);
  panel.orderFrontRegardless;

  app.run;
}
