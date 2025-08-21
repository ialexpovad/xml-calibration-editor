import * as React from "react";
import XmlEditor from "../lib/XmlEditor";
import * as Util from "../lib/Util";
import Builder from "../lib/Builder";
import { DocSpec, Xml } from "../lib/types";
import {
  Moon,
  Sun,
  Save,
  FileUp,
  FileDown,
  HelpCircle,
  Code2,
  Zap,
  Ruler,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // for animation

// -----------------------------
// Module augmentation (XmlEditor public API)
// -----------------------------
export interface XmlEditorHandle {
  loadString: (xml: string) => void;
  getXml: () => Xml | undefined;
}

declare module "../lib/XmlEditor" {
  // augment whatever XmlEditor exports so TS knows about these methods
  export default interface XmlEditor {
    loadString: (xml: string) => void;
    getXml(): Xml | undefined;
  }
}

// -----------------------------
// Types & helpers
// -----------------------------
type Theme = "light" | "dark";

const LS_KEYS = {
  theme: "atomtex:theme",
  toolbarExpanded: "atomtex:toolbarExpanded",
  accordionStates: "atomtex:accordionStates",
  xml: "atomtex:editorXml",
};

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn("readLS parse error", key, err);
    return fallback;
  }
}

function writeLS(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("writeLS error", key, err);
  }
}

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

// -----------------------------
// Templates & docSpec (kept from original, cleaned up)
// -----------------------------
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

// -----------------------------
// AccordionSection (forwardRef) — controlled enough and accessible
// -----------------------------
type AccordionHandle = { setOpen: (value: boolean) => void };
type AccordionProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  initialOpen?: boolean;
  onToggle?: (open: boolean) => void;
};

// use a small, safe fallback if React.useId is not available in the runtime/types
const useStableId = (prefix = "id") => {
  const reactId = (React as any).useId ? (React as any).useId() : undefined;
  const ref = React.useRef<string | undefined>(reactId);
  if (!ref.current) {
    // generate simple unique id
    ref.current = `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }
  return ref.current!;
};

const AccordionSection = React.forwardRef<AccordionHandle, AccordionProps>(
  ({ title, icon, children, initialOpen = false, onToggle }, ref) => {
    const [open, setOpen] = React.useState<boolean>(initialOpen);
    const contentId = useStableId("accordion");

    // react to parent changes to initialOpen (useful when restoring state)
    React.useEffect(() => {
      setOpen(initialOpen);
    }, [initialOpen]);

    React.useImperativeHandle(
      ref,
      () => ({
        setOpen: (value: boolean) => setOpen(value),
      }),
      []
    );

    const handleToggle = React.useCallback(() => {
      setOpen((prev) => {
        const next = !prev;
        onToggle?.(next);
        return next;
      });
    }, [onToggle]);

    return (
      <div style={{ marginBottom: 8 }}>
      <button
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls={contentId}
        className="accordion-button"
      >
        {icon}
        <span style={{ flex: 1 }}>{title}</span>
        <span style={{ fontSize: 12, opacity: 0.6 }}>{open ? "▼" : "▲"}</span>
      </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: "hidden" }}
              id={contentId}
              role="region"
            >
              <div style={{ padding: "6px 8px", fontSize: 13 }}>{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

// -----------------------------
// App component (main)
// -----------------------------
export default function App(): React.ReactElement {
  // --- persisted UI states (read once on init) ---
  const persistedXml = React.useMemo(
    () => readLS<string | null>(LS_KEYS.xml, null) ?? initialXml,
    []
  );

  const [theme, setTheme] = React.useState<Theme>(() =>
    (readLS<Theme | null>(LS_KEYS.theme, null) as Theme) ?? "light"
  );

  const [toolbarExpanded, setToolbarExpanded] = React.useState<boolean>(() =>
    readLS<boolean>(LS_KEYS.toolbarExpanded, true)
  );

  // accordion states: one boolean per section
  const ACC_COUNT = 4;
  const [accordionStates, setAccordionStates] = React.useState<boolean[]>(
    () => readLS<boolean[]>(LS_KEYS.accordionStates, new Array(ACC_COUNT).fill(false))
  );

  // We'll compute allOpen derived state, but keep it as state so UI responds immediately.
  const [allOpen, setAllOpen] = React.useState<boolean>(() =>
    accordionStates.every(Boolean)
  );

  // --- non-persisted / semi-persisted states ---
const [fileName, setFileName] = React.useState(() => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  return `calibration_${timestamp}.xml`;
});
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const [xmlPreview, setXmlPreview] = React.useState<string>("");
  // editorXml is persisted (last loaded/generated XML)
  const [editorXml, setEditorXml] = React.useState<string>(persistedXml);

  // refs
  const xmlEditorRef = React.useRef<XmlEditor | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // accordion refs (imperative control)
  const accordionRefs = React.useMemo(
    () =>
      Array.from({ length: ACC_COUNT }, () => React.createRef<AccordionHandle>()),
    []
  );

  // ensure persisted accordion states are saved when changed
  React.useEffect(() => {
    writeLS(LS_KEYS.accordionStates, accordionStates);
    setAllOpen(accordionStates.every(Boolean));
  }, [accordionStates]);

  // persist theme & toolbarExpanded
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    writeLS(LS_KEYS.theme, theme);
  }, [theme]);

  React.useEffect(() => {
    writeLS(LS_KEYS.toolbarExpanded, toolbarExpanded);
  }, [toolbarExpanded]);

  React.useEffect(() => {
    writeLS(LS_KEYS.xml, editorXml);
  }, [editorXml]);

  // Keep the XmlEditor instance in xmlEditorRef and ensure it receives the persisted xml on mount
  const setXmlEditorInstance = React.useCallback(
    (instance: XmlEditor | null) => {
      xmlEditorRef.current = instance;
      if (instance && editorXml) {
        try {
          // try to load persisted xml into the editor
          instance.loadString(editorXml);
          // also update preview to reflect the loaded string (non-destructive)
          setXmlPreview((prev) => prev || editorXml);
        } catch (err) {
          console.warn("Failed to load persisted XML into editor", err);
        }
      }
    },
    [editorXml]
  );

  // helper to update a single accordion state
  const setAccordionStateAt = React.useCallback((index: number, value: boolean) => {
    setAccordionStates((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  }, []);

  // Toggle all sections
  const toggleAllSections = React.useCallback(() => {
    const newState = !allOpen;
    setAllOpen(newState);
    const newStates = accordionStates.map(() => newState);
    setAccordionStates(newStates);
    // Imperatively notify sections to animate (if they support setOpen)
    accordionRefs.forEach((r) => r.current?.setOpen(newState));
  }, [allOpen, accordionStates, accordionRefs]);

  // ----- Keyboard shortcuts -----
  const helpText = React.useMemo(
    () =>
      [
        "⚙️ Быстрые команды:",
        "• Ctrl+O — Открыть XML",
        "• Ctrl+S — Сохранить XML",
        "• Ctrl+Enter — Собрать (обновить XML из редактора)",
        "• ? — Справка",
      ].join("\n"),
    []
  );

  // ---- validation (kept from original, unchanged logic) ----
  const validateBeforeSave = React.useCallback((xmlStr: string): string[] => {
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
  }, []);

  // ----- Handlers (stable via useCallback) -----
  const onHarvest = React.useCallback(() => {
    const editor = xmlEditorRef.current;
    if (!editor) return;
    try {
      const builder = new Builder({});
      const xmlNode = editor.getXml();
      if (!xmlNode) return;
      const result = builder.buildObject(xmlNode);
      setXmlPreview(result);
      setEditorXml(result); // persist the harvested XML
    } catch (err) {
      console.warn("onHarvest error", err);
    }
  }, []);

  const onOpenClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onOpenFile = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result).replace(
          /(?<=["=])([0-9]+(?:,[0-9]+)+)/g,
          (m) => prettyNumber(m)
        );
        // load into editor and persist
        if (xmlEditorRef.current) xmlEditorRef.current.loadString(text);
        setEditorXml(text);
        setXmlPreview(text);
        setFileName(f.name);
      } catch (err) {
        alert("Ошибка при чтении файла: " + err);
      }
    };
    reader.readAsText(f, "utf-8");
    // reset the input so same file can be opened again
    e.target.value = "";
  }, []);

  const onSave = React.useCallback(async () => {
    const editor = xmlEditorRef.current;
    if (!editor) return;

    try {
      const builder = new Builder({});
      const xmlNode = editor.getXml();
      if (!xmlNode) {
        alert("Редактор пуст или недоступен.");
        return;
      }

      const xmlStr = builder.buildObject(xmlNode);
      const errors = validateBeforeSave(xmlStr);
      if (errors.length) {
        alert("Проверьте данные:\n\n• " + errors.join("\n• "));
        return;
      }

      // Ask user for a filename
      let saveName = fileName || "calibration.xml";
      if ('showSaveFilePicker' in window) {
        // Modern browsers: file save dialog
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: saveName,
          types: [
            {
              description: "XML Files",
              accept: { "application/xml": [".xml"] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(xmlStr);
        await writable.close();
        saveName = handle.name;
      } else {
        // Fallback: prompt for filename
        const customName = prompt("Введите имя файла для сохранения", saveName);
        if (!customName) return; // canceled
        saveName = customName.endsWith(".xml") ? customName : customName + ".xml";
        download(saveName, xmlStr); // existing helper function
      }

      setFileName(saveName);          // update current filename
      setLastSaved(new Date());       // timestamp last save
      setXmlPreview(xmlStr);          // update preview
      setEditorXml(xmlStr);           // persist saved XML

    } catch (err) {
      console.error("save error", err);
      alert("Ошибка при сохранении: " + String(err));
    }
  }, [fileName, validateBeforeSave]);

  // keyboard shortcuts
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // normalize key (some browsers give "s" or "S")
      const key = e.key;
      if (e.ctrlKey && key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      } else if (e.ctrlKey && key.toLowerCase() === "o") {
        e.preventDefault();
        onOpenClick();
      } else if (e.ctrlKey && key === "Enter") {
        e.preventDefault();
        onHarvest();
      } else if (!e.ctrlKey && key === "?") {
        alert(helpText);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSave, onOpenClick, onHarvest, helpText]);

  // --- Toolbar button helper (compact when toolbarExpanded === false) ---
  const ToolbarButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    title?: string;
    primary?: boolean;
  }> = ({ icon, label, onClick, title, primary }) => (
    <button
      className={`btn ${primary ? "btn--primary" : ""}`}
      onClick={onClick}
      title={title ?? label}
      aria-label={label}
      style={{ display: "flex", alignItems: "center", gap: 8 }}
    >
      {icon}
      {toolbarExpanded && <span className="btn__label">{label}</span>}
    </button>
  );

  // ----- Render -----
  return (
    <div className="app" data-theme={theme}>
      {/* HEADER */}
      <header className="app__bar">
        <div className="app__brand">☢️ Калибровка (XML)</div>

        <button
          className="btn"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          aria-label="Сменить тему"
          title="Сменить тему"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {toolbarExpanded && <span className="btn__label">Тема</span>}
        </button>

        <div style={{ width: 8 }} />

        {/* toolbar expand/collapse toggle */}
        <button
          className="btn"
          onClick={() => setToolbarExpanded((p) => !p)}
          aria-pressed={toolbarExpanded}
          title={toolbarExpanded ? "Свернуть панель" : "Развернуть панель"}
        >
          {toolbarExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          {toolbarExpanded && <span className="btn__label">Панель</span>}
        </button>

        <div className="app__spacer" />

        <ToolbarButton
          icon={<FileUp size={18} />}
          label="Открыть"
          onClick={onOpenClick}
          title="Открыть XML (Ctrl+O)"
        />

        <ToolbarButton
          icon={<FileDown size={18} />}
          label="Собрать"
          onClick={onHarvest}
          title="Собрать (Ctrl+Enter)"
        />

        <ToolbarButton
          icon={<Save size={18} />}
          label="Сохранить"
          onClick={onSave}
          title="Сохранить (Ctrl+S)"
          primary
        />

        <ToolbarButton
          icon={<HelpCircle size={18} />}
          label="Справка"
          onClick={() => alert(helpText)}
          title="Помощь"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".xml"
          style={{ display: "none" }}
          onChange={onOpenFile}
        />
      </header>

      <main className="app__main">
        {/* XML editor section */}
        <section className="panel editor-panel">
          <XmlEditor
            docSpec={docSpec}
            ref={setXmlEditorInstance as any}
            xml={editorXml}
          />
        </section>

        {/* Sidebar / Accordion */}
        <aside className={`panel sidebar-panel ${toolbarExpanded ? "expanded" : ""}`}>
          <div className="toolbar-actions">
            <button
              onClick={toggleAllSections}
              title={allOpen ? "Свернуть всё" : "Развернуть всё"}
              className="btn btn-toggle-all"
            >
              {allOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {toolbarExpanded && (allOpen ? "Свернуть всё" : "Развернуть всё")}
            </button>
          </div>

          <AccordionSection
            ref={accordionRefs[0]}
            initialOpen={accordionStates[0]}
            onToggle={(open) => setAccordionStateAt(0, open)}
            title="Формат XML"
            icon={<Code2 size={16} />}
          >
            <div className="kv">
              <b>Формат</b>
              <span>calibration → geometry → mix → nuclide → density → vector</span>
            </div>
          </AccordionSection>

          <AccordionSection
            ref={accordionRefs[1]}
            initialOpen={accordionStates[1]}
            onToggle={(open) => setAccordionStateAt(1, open)}
            title="Быстрые действия"
            icon={<Zap size={16} />}
          >
            <div className="kv">
              <b>Действия</b>
              <span>ПКМ по элементам → меню (добавить/удалить).</span>
            </div>
          </AccordionSection>

          <AccordionSection
            ref={accordionRefs[2]}
            initialOpen={accordionStates[2]}
            onToggle={(open) => setAccordionStateAt(2, open)}
            title="Единицы измерений"
            icon={<Ruler size={16} />}
          >
            <div className="kv">
              <b>Единицы</b>
              <span>activity (Бк), volume (л), диапазоны энергий left/right.</span>
            </div>
          </AccordionSection>

          <AccordionSection
            ref={accordionRefs[3]}
            initialOpen={accordionStates[3]}
            onToggle={(open) => setAccordionStateAt(3, open)}
            title="XML предпросмотр"
            icon={<FileDown size={16} />}
          >
            <pre className="xml-preview">{xmlPreview || "— пока пусто —"}</pre>
          </AccordionSection>
        </aside>
      </main>


      {/* FOOTER */}
      <footer className="app__status" style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 10px" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <img src="./css/atomtex.png" alt="ATOMTEX" style={{ height: 20, verticalAlign: "middle" }} />
          <span>ATOMTEX</span>
        </span>

        <span>•</span>
        <span>Файл: {fileName}</span>
        <span>•</span>
        <span>Сохранено: {lastSaved ? lastSaved.toLocaleString() : "—"}</span>
        <span>•</span>
        <span style={{ marginLeft: "auto" }}>Горячие клавиши: Ctrl+O / Ctrl+S / Ctrl+Enter</span>
      </footer>
    </div>
  );
}
