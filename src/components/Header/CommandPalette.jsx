/**
 * CommandPalette
 * Search across the pages and quick actions available to the user's role.
 * Opens from the topbar search, Ctrl/⌘ K, or "/".
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { ArrowUpDown, CornerDownLeft, Search } from "lucide-react";
import {
  QUICK_ACTIONS,
  getNavigationByRole,
} from "../Sidebar/navigation.config";

const normalize = (text) => text.toLowerCase().trim();

const buildEntries = (role) => [
  ...(QUICK_ACTIONS[role] || []).map((a) => ({
    id: `action-${a.key}`,
    group: "Quick actions",
    label: a.label,
    hint: a.hint,
    path: a.path,
    icon: a.icon,
    tone: a.tone,
  })),
  ...getNavigationByRole(role).flatMap((section) =>
    section.items.map((item) => ({
      id: `page-${item.key}`,
      group: "Pages",
      label: item.label,
      hint: section.section,
      path: item.path,
      icon: item.icon,
      tone: item.tone,
    })),
  ),
];

const CommandPalette = ({ role, open, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const entries = useMemo(() => buildEntries(role), [role]);

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return entries;
    return entries.filter((e) =>
      normalize(`${e.label} ${e.hint} ${e.group}`).includes(q),
    );
  }, [entries, query]);

  const reset = () => {
    setQuery("");
    setActive(0);
  };

  const go = (entry) => {
    if (!entry) return;
    onClose();
    reset();
    navigate(entry.path);
  };

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        onClose();
        reset();
      }}
      footer={null}
      closable={false}
      width={580}
      centered={false}
      style={{ top: "12vh" }}
      className="ssd-palette"
      destroyOnHidden
      // antd moves focus to the dialog after opening; hand it to the input
      afterOpenChange={(isOpen) => isOpen && inputRef.current?.focus()}
      title={null}
      aria-label="Search pages and actions">
      <div className="ssd-palette__input">
        <Search size={18} aria-hidden="true" />
        <input
          ref={inputRef}
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search pages and actions…"
          aria-label="Search pages and actions"
          role="combobox"
          aria-expanded="true"
          aria-controls="ssd-palette-list"
          aria-activedescendant={
            results[active] ? `ssd-palette-${results[active].id}` : undefined
          }
        />
        <span className="ssd-kbd">Esc</span>
      </div>

      {results.length === 0 ? (
        <p className="ssd-palette__empty">
          No pages or actions match “{query}”.
        </p>
      ) : (
        <ul
          id="ssd-palette-list"
          className="ssd-palette__list"
          role="listbox"
          ref={listRef}>
          {results.flatMap((entry, index) => {
            const Icon = entry.icon;
            const startsGroup =
              index === 0 || results[index - 1].group !== entry.group;
            const row = (
              <li key={entry.id} role="presentation">
                <button
                  type="button"
                  id={`ssd-palette-${entry.id}`}
                  role="option"
                  aria-selected={index === active}
                  data-index={index}
                  data-active={index === active}
                  className="ssd-menu-row"
                  onMouseMove={() => setActive(index)}
                  onClick={() => go(entry)}>
                  <span
                    className={`ssd-ico ssd-ico--sm ssd-tone--${entry.tone}`}>
                    <Icon size={15} aria-hidden="true" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <b>{entry.label}</b>
                    <small>{entry.hint}</small>
                  </span>
                  {index === active && (
                    <CornerDownLeft
                      size={14}
                      className="text-slate-400"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            );
            return startsGroup
              ? [
                  <li
                    key={`group-${entry.group}`}
                    className="ssd-palette__group"
                    role="presentation">
                    {entry.group}
                  </li>,
                  row,
                ]
              : [row];
          })}
        </ul>
      )}

      <div className="ssd-palette__foot" aria-hidden="true">
        <span>
          <ArrowUpDown size={13} /> Navigate
        </span>
        <span>
          <CornerDownLeft size={13} /> Open
        </span>
        <span>
          <span className="ssd-kbd">Ctrl K</span> Toggle
        </span>
      </div>
    </Modal>
  );
};

export default CommandPalette;
