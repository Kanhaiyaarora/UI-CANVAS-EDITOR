let elements = [];
let selected = null;
let idCounter = 0;

const canvas = document.getElementById("canvas");
const layers = document.getElementById("layers");
const props = document.getElementById("props");

/* ---------- SAVE / LOAD ---------- */
function save() {
  localStorage.setItem("layout", JSON.stringify(elements));
}

function load() {
  const data = JSON.parse(localStorage.getItem("layout") || "[]");
  data.forEach((d) => createElement(d.type, d));
}

/* ---------- SELECTION ---------- */
function deselect() {
  if (!selected) return;
  selected.el.classList.remove("selected");
  selected.el.querySelectorAll(".handle").forEach((h) => h.remove());
  selected = null;
  props.innerHTML = "";
}

canvas.addEventListener("mousedown", deselect);

/* ---------- CREATE ELEMENT ---------- */
function createElement(type, data = {}) {
  const el = document.createElement("div");
  el.className = `element ${type}`;

  const obj = {
    id: data.id || ++idCounter,
    type,
    x: data.x || 50,
    y: data.y || 50,
    w: data.w || 120,
    h: data.h || 80,
    bg: data.bg || "#0638cc",
    text: data.text || "Text",
    z: data.z ?? elements.length,
    rotate: data.rotate || 0,
  };

  Object.assign(el.style, {
    left: obj.x + "px",
    top: obj.y + "px",
    width: obj.w + "px",
    height: obj.h + "px",
    background: obj.bg,
    zIndex: obj.z,
    transform: `rotate(${obj.rotate}deg)`,
  });

  if (type === "text") el.textContent = obj.text;

  el.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    select(obj, el);
    startDrag(e, obj, el);
  });

  canvas.appendChild(el);
  elements.push(obj);
  updateLayers();
  save();
}

/* ---------- SELECT ---------- */
function select(obj, el) {
  deselect();
  selected = { obj, el };
  el.classList.add("selected");
  addHandles(el, obj);
  showProps(obj, el);
}

/* ---------- DRAG ---------- */
function startDrag(e, obj, el) {
  const sx = e.clientX;
  const sy = e.clientY;
  const ix = obj.x;
  const iy = obj.y;

  function move(ev) {
    let nx = ix + (ev.clientX - sx);
    let ny = iy + (ev.clientY - sy);

    nx = Math.max(0, Math.min(nx, canvas.clientWidth - obj.w));
    ny = Math.max(0, Math.min(ny, canvas.clientHeight - obj.h));

    obj.x = nx;
    obj.y = ny;
    el.style.left = nx + "px";
    el.style.top = ny + "px";
  }

  function up() {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
    save();
  }

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
}

/* ---------- RESIZE ---------- */
function addHandles(el, obj) {
  ["tl", "tr", "bl", "br"].forEach((pos) => {
    const h = document.createElement("div");
    h.className = `handle ${pos}`;
    h.onmousedown = (e) => resize(e, obj, el);
    el.appendChild(h);
  });
}

function resize(e, obj, el) {
  e.stopPropagation();
  const sx = e.clientX;
  const sy = e.clientY;
  const iw = obj.w;
  const ih = obj.h;

  function move(ev) {
    let nw = Math.max(30, iw + (ev.clientX - sx));
    let nh = Math.max(20, ih + (ev.clientY - sy));

    if (obj.x + nw <= canvas.clientWidth) obj.w = nw;
    if (obj.y + nh <= canvas.clientHeight) obj.h = nh;

    el.style.width = obj.w + "px";
    el.style.height = obj.h + "px";
  }

  function up() {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
    save();
  }

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
}

/* ---------- PROPERTIES ---------- */
function showProps(obj, el) {
  props.innerHTML = "";

  const w = input("number", obj.w, (v) => {
    obj.w = v;
    el.style.width = v + "px";
  });
  const h = input("number", obj.h, (v) => {
    obj.h = v;
    el.style.height = v + "px";
  });
  const bg = input("color", obj.bg, (v) => {
    obj.bg = v;
    el.style.background = v;
  });
  const r = input("range", obj.rotate, (v) => {
    obj.rotate = v;
    el.style.transform = `rotate(${v}deg)`;
  });

  props.append("Width", w, "Height", h, "BG", bg, "Rotate", r);

  if (obj.type === "text") {
    const t = document.createElement("textarea");
    t.value = obj.text;
    t.oninput = () => {
      obj.text = t.value;
      el.textContent = t.value;
      save();
    };
    props.append("Text", t);
  }
}

function input(type, value, cb) {
  const i = document.createElement("input");
  i.type = type;
  i.value = value;
  i.oninput = () => {
    cb(type === "range" ? i.value : +i.value || i.value);
    save();
  };
  return i;
}

/* ---------- LAYERS ---------- */
function updateLayers() {
  layers.innerHTML = "";
  elements
    .slice()
    .sort((a, b) => b.z - a.z)
    .forEach((o) => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.gap = "4px";

      const label = document.createElement("button");
      label.textContent = o.type + " #" + o.id;
      label.onclick = () =>
        select(
          o,
          [...canvas.children].find((c) => +c.style.zIndex === o.z),
        );

      const up = document.createElement("button");
      up.textContent = "▲";
      up.onclick = () => {
        o.z++;
        applyZ();
      };

      const dn = document.createElement("button");
      dn.textContent = "▼";
      dn.onclick = () => {
        o.z = Math.max(0, o.z - 1);
        applyZ();
      };

      row.append(label, up, dn);
      layers.appendChild(row);
    });
}

function applyZ() {
  elements.forEach((o) => {
    const el = [...canvas.children].find(
      (c) => +c.style.zIndex === o.z || c === selected?.el,
    );
    if (el) el.style.zIndex = o.z;
  });
  save();
}

/* ---------- KEYBOARD ---------- */
document.addEventListener("keydown", (e) => {
  if (!selected) return;
  const step = 5;

  if (e.key === "Delete") {
    canvas.removeChild(selected.el);
    elements = elements.filter((x) => x.id !== selected.obj.id);
    deselect();
    updateLayers();
    save();
  }

  if (e.key === "ArrowLeft")
    selected.obj.x = Math.max(0, selected.obj.x - step);
  if (e.key === "ArrowRight")
    selected.obj.x = Math.min(
      canvas.clientWidth - selected.obj.w,
      selected.obj.x + step,
    );
  if (e.key === "ArrowUp") selected.obj.y = Math.max(0, selected.obj.y - step);
  if (e.key === "ArrowDown")
    selected.obj.y = Math.min(
      canvas.clientHeight - selected.obj.h,
      selected.obj.y + step,
    );

  selected.el.style.left = selected.obj.x + "px";
  selected.el.style.top = selected.obj.y + "px";
});

/* ---------- BUTTONS ---------- */
addRect.onclick = () => createElement("rect");
addText.onclick = () => createElement("text");
deleteBtn.onclick = () =>
  selected &&
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete" }));

exportJSON.onclick = () => {
  download(
    new Blob([JSON.stringify(elements, null, 2)], { type: "application/json" }),
    "design.json",
  );
};

exportHTML.onclick = () => {
  let html = '<div style="position:relative;width:900px;height:600px">';
  elements.forEach((e) => {
    html += `<div style="position:absolute;left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px;background:${e.bg};transform:rotate(${e.rotate}deg)">${e.text || ""}</div>`;
  });
  html += "</div>";
  download(new Blob([html], { type: "text/html" }), "design.html");
};

function download(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}

load();
