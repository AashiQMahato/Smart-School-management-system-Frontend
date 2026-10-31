import { useCallback, useEffect, useState } from "react";
import {
  getEvents,
  getParentEvents,
  getStudentEvents,
  getTeacherEvents,
} from "../services/calendar.service";

/**
 * Published school-calendar events visible to the signed-in role, from two
 * weeks ago to two months ahead. Shared by the notification centre and the
 * dashboards; results are cached briefly so they don't fetch twice.
 */

const FETCHERS = {
  admin: getEvents,
  teacher: getTeacherEvents,
  student: getStudentEvents,
  parent: getParentEvents,
};

const TTL = 60 * 1000;
const cache = new Map(); // role -> { at, promise }

const toISODate = (d) => d.toISOString().split("T")[0];

const load = (role, force) => {
  const hit = cache.get(role);
  if (!force && hit && Date.now() - hit.at < TTL) return hit.promise;

  const start = new Date();
  start.setDate(start.getDate() - 14);
  const end = new Date();
  end.setDate(end.getDate() + 60);

  const fetcher = FETCHERS[role];
  const promise = fetcher
    ? fetcher({ startDate: toISODate(start), endDate: toISODate(end) })
        .then((res) => {
          const list = Array.isArray(res?.data) ? res.data : [];
          // admins also see drafts in their calendar; only notify published
          return list.filter((e) => e && e.isPublished !== false);
        })
        .catch((err) => {
          cache.delete(role);
          throw err;
        })
    : Promise.resolve([]);

  cache.set(role, { at: Date.now(), promise });
  return promise;
};

export const useRoleEvents = (role) => {
  const [state, setState] = useState({
    events: [],
    loading: Boolean(role),
    error: null,
  });

  const fetchEvents = useCallback(
    (force = false) => {
      if (!role) return;
      setState((s) => ({ ...s, loading: true, error: null }));
      load(role, force)
        .then((events) => setState({ events, loading: false, error: null }))
        .catch((error) =>
          setState({ events: [], loading: false, error: error.message }),
        );
    },
    [role],
  );

  useEffect(() => {
    if (!role) return undefined;
    let alive = true;
    load(role, false)
      .then(
        (events) => alive && setState({ events, loading: false, error: null }),
      )
      .catch(
        (error) =>
          alive &&
          setState({ events: [], loading: false, error: error.message }),
      );
    return () => {
      alive = false;
    };
  }, [role]);

  return { ...state, refresh: () => fetchEvents(true) };
};

/** Events whose start date is today or later, soonest first. */
export const upcomingEvents = (events, { types, limit } = {}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const list = events
    .filter((e) => new Date(e.endDate || e.startDate) >= today)
    .filter((e) => !types || types.includes(e.eventType))
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  return limit ? list.slice(0, limit) : list;
};

export default useRoleEvents;
