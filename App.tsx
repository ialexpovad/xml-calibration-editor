import * as React from "react";
import XmlEditor from "../lib/XmlEditor";
import * as Util from "../lib/Util";
import Builder from "../lib/Builder";
import { DocSpec, Xml } from "../lib/types";

export interface XmlEditorHandle {
  loadString: (xml: string) => void;
  getXml: () => Xml | undefined;
}

// ---- Type augmentations for XmlEditor ----
declare module "../lib/XmlEditor" {
  export default interface XmlEditor {
    loadString: (xml: string) => void;     // public method
    getXml(): Xml | undefined;      // returns a DOM Node or null
  }
}

type Theme = "light" | "dark";

const prettyNumber = (s: string) =>
  s.replace(/,/g, ".").replace(/\s+/g, "").trim();

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const cs137Template = `
<nuclide name="Cs-137" left="500" right="720" maxactivity="1000000">
  <density value="1" spectrum="" background="" activity="0">
    <vector w="1" n="1" value="0.004846"/>
    <vector w="2" n="1" value="0"/>
  </density>
</nuclide>`.trim();

const k40Template = `
<nuclide name="K-40" left="1330" right="1600" maxactivity="20000">
  <density value="1" spectrum="" background="" activity="0">
    <vector w="1" n="2" value="0.000179"/>
    <vector w="2" n="2" value="0.000226"/>
  </density>
</nuclide>`.trim();

const docSpec: DocSpec = {
  elements: {
    calibration: {
      menu: [
        {
          action: Util.newElementChild('<geometry name="Vessel" volume="0.0" />'),
          caption: "Добавить геометрию",
        },
      ],
    },
    geometry: {
      attributes: {
        name: { asker: Util.askString },
        volume: { asker: Util.askString },
      },
      menu: [
        { action: Util.newElementChild('<mix name="Cs+K" />'), caption: "Добавить состав" },
        { action: Util.deleteElement, caption: "Удалить геометрию" },
      ],
    },
    mix: {
      attributes: { name: { asker: Util.askString } },
      menu: [
        { action: Util.newElementChild('<nuclide name="NewNuclide" left="0" right="0" maxactivity="0" />'), caption: "Добавить нуклид" },
        { action: Util.newElementChild(cs137Template), caption: "Шаблон: Cs-137" },
        { action: Util.newElementChild(k40Template), caption: "Шаблон: K-40" },
        { action: Util.deleteElement, caption: "Удалить состав" },
      ],
    },
    nuclide: {
      attributes: {
        name: { asker: Util.askString },
        left: { asker: Util.askString },
        right: { asker: Util.askString },
        maxactivity: { asker: Util.askString },
      },
      menu: [
        { action: Util.newElementChild('<density value="0.0" spectrum="" background="" activity="0" />'), caption: "Добавить плотность" },
        { action: Util.deleteElement, caption: "Удалить нуклид" },
      ],
    },
    density: {
      attributes: {
        value: { asker: Util.askString },
        spectrum: { asker: Util.askString },
        background: { asker: Util.askString },
        activity: { asker: Util.askString },
      },
      menu: [
        { action: Util.newElementChild('<vector w="1" n="1" value="0.0" />'), caption: "Добавить вектор" },
        { action: Util.deleteElement, caption: "Удалить плотность" },
      ],
    },
    vector: {
      attributes: {
        w: { asker: Util.askString },
        n: { asker: Util.askString },
        value: { asker: Util.askString },
      },
      menu: [{ action: Util.deleteElement, caption: "Удалить вектор" }],
    },
  },
};

const initialXml = `<?xml version="1.0" encoding="utf-8"?>
<calibration>
  <geometry name="Vessel" volume="0.49">
    <mix name="Cs+K">
      <nuclide name="Cs-137" left="500" right="720" maxactivity="1e+006">
        <density value="0.2" spectrum="" background="" activity="0">
          <vector w="1" n="1" value="0.005076" />
          <vector w="2" n="1" value="0" />
        </density>
      </nuclide>
    </mix>
  </geometry>
</calibration>`;

export default function App() {
  const [theme, setTheme] = React.useState<Theme>("light");
  const [fileName, setFileName] = React.useState("calibration.xml");
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const [xmlPreview, setXmlPreview] = React.useState("");
  const ref = React.useRef<XmlEditor | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const helpText = [
    "⚙️ Быстрые команды:",
    "• Ctrl+O — Открыть XML",
    "• Ctrl+S — Сохранить XML",
    "• Ctrl+Enter — Собрать (обновить XML из редактора)",
    "• ? — Справка",
    "",
    // "Подсказка: вводите числа с запятой или точкой — система сама нормализует.",
  ].join("\n");

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "s") { e.preventDefault(); onSave(); }
      if (e.ctrlKey && e.key.toLowerCase() === "o") { e.preventDefault(); onOpenClick(); }
      if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); onHarvest(); }
      if (!e.ctrlKey && e.key === "?") { alert(helpText); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onHarvest = () => {
    if (!ref.current) return;
    const builder = new Builder({});
    const xml = ref.current.getXml();
    if (!xml) return;
    setXmlPreview(builder.buildObject(xml));
  };

  const onOpenClick = () => fileInputRef.current?.click();

  const onOpenFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (!ref.current) return;
        setFileName(f.name);
        const text = String(reader.result).replace(
          /(?<=["=])([0-9]+(?:,[0-9]+)+)/g,
          (m) => prettyNumber(m)
        );
        ref.current?.loadString(text);
        setXmlPreview(text);
      } catch (err) {
        alert("Ошибка при чтении файла: " + err);
      }
    };
    reader.readAsText(f, "utf-8");
    e.target.value = "";
  };

  const validateBeforeSave = (xmlStr: string): string[] => {
    const errs: string[] = [];
    const tests = [
      { rx: /volume="([^"]+)"/g, name: "volume", check: (v: string) => +prettyNumber(v) >= 0, msg: "volume должно быть неотрицательным числом" },
      { rx: /left="([^"]+)"/g, name: "left", check: (v: string) => Number.isFinite(+prettyNumber(v)), msg: "left должно быть числом" },
      { rx: /right="([^"]+)"/g, name: "right", check: (v: string) => Number.isFinite(+prettyNumber(v)), msg: "right должно быть числом" },
      { rx: /maxactivity="([^"]+)"/g, name: "maxactivity", check: (v: string) => +prettyNumber(v) >= 0, msg: "maxactivity должно быть ≥ 0" },
      { rx: /value="([^"]+)"/g, name: "value", check: (v: string) => Number.isFinite(+prettyNumber(v)), msg: "value должно быть числом" },
      { rx: /activity="([^"]+)"/g, name: "activity", check: (v: string) => +prettyNumber(v) >= 0, msg: "activity должно быть ≥ 0" },
      { rx: /w="([^"]+)"/g, name: "w", check: (v: string) => Number.isInteger(+prettyNumber(v)) && +prettyNumber(v) > 0, msg: "w должно быть целым > 0" },
      { rx: /n="([^"]+)"/g, name: "n", check: (v: string) => Number.isInteger(+prettyNumber(v)) && +prettyNumber(v) > 0, msg: "n должно быть целым > 0" },
    ];

    for (const t of tests) {
      xmlStr.replace(t.rx, (_m, g1) => {
        if (!t.check(g1)) errs.push(`${t.name}: ${t.msg} (найдено "${g1}")`);
        return _m;
      });
    }

    const rx = /left="([^"]+)"[^>]+right="([^"]+)"/g;
    let match;
    while ((match = rx.exec(xmlStr)) !== null) {
      const L = +prettyNumber(match[1]);
      const R = +prettyNumber(match[2]);
      if (!(L < R)) errs.push(`Интервал [left,right] некорректен: ${L} !< ${R}`);
    }

    return errs;
  };

  const onSave = () => {
    if (!ref.current) return;
    const builder = new Builder({});
    const xmlNode = ref.current.getXml();
    if (!xmlNode) return;
    const xmlStr = builder.buildObject(xmlNode);

    const errors = validateBeforeSave(xmlStr);
    if (errors.length) {
      alert("Проверьте данные:\n\n• " + errors.join("\n• "));
      return;
    }

    download(fileName || "calibration.xml", xmlStr);
    setLastSaved(new Date());
    setXmlPreview(xmlStr);
  };

  return (
    <div className="app" data-theme={theme}>
      <header className="app__bar">
        <div className="app__brand">☢️ Калибровка (XML)</div>
        <button
          className="btn"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Сменить тему"
        >
          Тема: {theme === "dark" ? "Тёмная" : "Светлая"}
        </button>
        <div className="app__spacer" />
        <button className="btn" title="Открыть XML (Ctrl+O)" onClick={onOpenClick} aria-label="Открыть XML">
          Открыть XML
        </button>
        <button className="btn" onClick={onHarvest} title="Собрать (Ctrl+Enter)" aria-label="Собрать XML">
          Собрать
        </button>
        <button className="btn btn--primary" onClick={onSave} title="Сохранить (Ctrl+S)" aria-label="Сохранить XML">
          Сохранить
        </button>
        <button className="btn" onClick={() => alert(helpText)} aria-label="Помощь">
          ?
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xml"
          style={{ display: "none" }}
          onChange={onOpenFile}
        />
      </header>

      <main className="app__main">
        <section className="panel">
          <XmlEditor docSpec={docSpec} ref={ref} xml={initialXml} />
        </section>

        <aside className="panel" style={{ overflow: "auto" }}>
          <h3 style={{ margin: "6px 6px 10px" }}>Справка / Подсказки</h3>
          <div className="kv">
            <b>Формат</b><span>calibration → geometry → mix → nuclide → density → vector</span>
            <b>Быстрые действия</b><span>ПКМ по элементам → меню (добавить/удалить).</span>
            {/* <b>Числа</b><span>Можно вводить с запятой, мы конвертируем → «.»</span> */}
            <b>Единицы</b><span>activity (Бк), volume (л), диапазоны энергий left/right.</span>
          </div>
          <div className="hr" />
          <h4 style={{ margin: "8px 0 6px" }}>XML предпросмотр</h4>
          <pre style={{ whiteSpace: "pre-wrap", color: "#9aa4b2" }}>
            {xmlPreview || "— пока пусто —"}
          </pre>
        </aside>
      </main>

      <footer className="app__status">
        <span>
          <img src="./css/atomtex.png" alt="ATOMTEX" style={{ height: 20, verticalAlign: "middle", marginRight: 6 }} />
          ATOMTEX
        </span>
        <span>•</span>
        <span>Файл: {fileName}</span>
        <span>•</span>
        <span>Сохранено: {lastSaved ? lastSaved.toLocaleTimeString() : "—"}</span>
        <span>•</span>
        <span>Горячие клавиши: Ctrl+O / Ctrl+S / Ctrl+Enter</span>
      </footer>

    </div>
  );
}
