/**
 * NotificationCenter
 * Bell + dropdown listing school-calendar events for the signed-in role,
 * grouped by type. "Unread" means published since the user last marked
 * notifications as read (remembered per user in this browser).
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Skeleton } from "antd";
import { Bell, BellRing, CalendarDays } from "lucide-react";
import { useRoleEvents } from "../../hooks/useRoleEvents";
import { EVENT_TYPE_UI, eventTypeUI, relativeDay } from "../UI/eventTypes";

const seenKey = (userId) => `ssms_notifications_seen_${userId || "me"}`;

const readSeen = (userId) => {
  try {
    return Number(localStorage.getItem(seenKey(userId))) || 0;
  } catch {
    return 0;
  }
};

const publishedAt = (event) =>
  new Date(event.createdAt || event.updatedAt || event.startDate).getTime();

const NotificationCenter = ({ role, userId }) => {
  const { events, loading, error, refresh } = useRoleEvents(role);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [seenAt, setSeenAt] = useState(() => readSeen(userId));

  const sorted = useMemo(
    () => [...events].sort((a, b) => publishedAt(b) - publishedAt(a)),
    [events],
  );
  const unread = sorted.filter((e) => publishedAt(e) > seenAt);
  const counts = sorted.reduce((acc, e) => {
    acc[e.eventType] = (acc[e.eventType] || 0) + 1;
    return acc;
  }, {});
  const shown =
    filter === "all" ? sorted : sorted.filter((e) => e.eventType === filter);

  const markAllRead = () => {
    const now = Date.now();
    setSeenAt(now);
    try {
      localStorage.setItem(seenKey(userId), String(now));
    } catch {
      /* storage unavailable: unread state resets on reload */
    }
  };

  const panel = (
    <div className="ssd-pop" role="dialog" aria-label="Notifications">
      <div className="ssd-pop__head">
        <div>
          <h2>Notifications</h2>
          <p>
            {unread.length
              ? `${unread.length} new from the school calendar`
              : "You're all caught up"}
          </p>
        </div>
        <button
          type="button"
          className="ssd-pop__link"
          onClick={markAllRead}
          disabled={!unread.length}>
          Mark all read
        </button>
      </div>

      <div
        className="ssd-pop__tabs"
        role="group"
        aria-label="Filter notifications">
        <button
          type="button"
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}>
          All <small>{sorted.length}</small>
        </button>
        {Object.entries(EVENT_TYPE_UI)
          .filter(([type]) => counts[type])
          .map(([type, ui]) => (
            <button
              key={type}
              type="button"
              aria-pressed={filter === type}
              onClick={() => setFilter(type)}>
              {ui.label} <small>{counts[type]}</small>
            </button>
          ))}
      </div>

      {loading ? (
        <div className="p-4">
          <Skeleton active avatar paragraph={{ rows: 2 }} />
        </div>
      ) : error ? (
        <div className="ssd-empty">
          <b>Couldn't load notifications</b>
          <button type="button" className="ssd-pop__link" onClick={refresh}>
            Try again
          </button>
        </div>
      ) : shown.length === 0 ? (
        <div className="ssd-empty">
          <span className="ssd-empty__icon">
            <Bell size={20} aria-hidden="true" />
          </span>
          <b>No notifications</b>
          <p>Exams, announcements and deadlines will show up here.</p>
        </div>
      ) : (
        <ul className="ssd-pop__list">
          {shown.slice(0, 30).map((event) => {
            const ui = eventTypeUI(event.eventType);
            const Icon = ui.icon;
            const isNew = publishedAt(event) > seenAt;
            return (
              <li key={event._id}>
                <Link
                  to={`/${role}/calendar`}
                  className="ssd-notif"
                  onClick={() => setOpen(false)}>
                  <span className={`ssd-ico ssd-tone--${ui.tone}`}>
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="ssd-notif__main">
                    <b>{event.title}</b>
                    <small>
                      {ui.single} · {relativeDay(event.startDate)}
                    </small>
                  </span>
                  {isNew && (
                    <span className="ssd-notif__dot" aria-label="New" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="ssd-pop__foot">
        <Link
          to={`/${role}/calendar`}
          className="ssd-panel__link"
          onClick={() => setOpen(false)}>
          <CalendarDays size={14} aria-hidden="true" />
          Open school calendar
        </Link>
      </div>
    </div>
  );

  const BellIcon = unread.length ? BellRing : Bell;

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      trigger={["click"]}
      placement="bottomRight"
      popupRender={() => panel}>
      <button
        type="button"
        className="ssd-icon-btn"
        aria-label={
          unread.length
            ? `Notifications, ${unread.length} unread`
            : "Notifications"
        }
        aria-haspopup="dialog"
        aria-expanded={open}>
        <BellIcon size={18} aria-hidden="true" />
        {unread.length > 0 && (
          <span className="ssd-badge" aria-hidden="true">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>
    </Dropdown>
  );
};

export default NotificationCenter;
