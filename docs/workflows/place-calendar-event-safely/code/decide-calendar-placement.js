const proposed = $("Prepare Proposed Event").first().json;

const CATEGORY_DEFAULTS = {
  medicine: {
    movability: "fixed",
    eisenhower: "Q1",
    priority_score: 100,
    stackability: "limited",
    can_overlap_categories: ["morning_report", "tumor_board", "quick_research_meeting", "deadline_marker"],
    cannot_overlap_categories: ["uworld", "deep_work", "date", "gym", "travel_out_of_city"]
  },
  icu: {
    movability: "fixed",
    eisenhower: "Q1",
    priority_score: 100,
    stackability: "limited",
    can_overlap_categories: ["morning_report", "deadline_marker"],
    cannot_overlap_categories: ["uworld", "deep_work", "date", "gym", "travel_out_of_city", "research_meeting"]
  },
  night_call: {
    movability: "fixed",
    eisenhower: "Q1",
    priority_score: 100,
    stackability: "none",
    can_overlap_categories: ["deadline_marker"],
    cannot_overlap_categories: ["uworld", "deep_work", "date", "gym", "travel", "research_meeting"]
  },
  day_call: {
    movability: "fixed",
    eisenhower: "Q1",
    priority_score: 100,
    stackability: "none",
    can_overlap_categories: ["deadline_marker"],
    cannot_overlap_categories: ["uworld", "deep_work", "date", "gym", "travel", "research_meeting"]
  },
  uworld: {
    movability: "flexible",
    eisenhower: "Q2",
    priority_score: 70,
    stackability: "none",
    can_overlap_categories: [],
    cannot_overlap_categories: ["medicine", "icu", "night_call", "day_call", "travel", "date", "sleep"]
  },
  research_meeting: {
    movability: "semi_fixed",
    eisenhower: "Q2",
    priority_score: 70,
    stackability: "conditional",
    can_overlap_categories: ["medicine", "elective", "qapi", "admin_time"],
    cannot_overlap_categories: ["icu", "night_call", "day_call", "sleep", "date", "travel_out_of_city"]
  },
  quick_research_meeting: {
    movability: "semi_fixed",
    eisenhower: "Q2",
    priority_score: 65,
    stackability: "conditional",
    can_overlap_categories: ["medicine", "elective", "qapi", "admin_time"],
    cannot_overlap_categories: ["icu", "night_call", "day_call", "sleep", "date"]
  },
  travel: {
    movability: "fixed",
    eisenhower: "Q2",
    priority_score: 75,
    stackability: "limited",
    can_overlap_categories: ["podcast", "audio_lecture", "phone_call"],
    cannot_overlap_categories: ["uworld", "deep_work", "writing", "coding", "gym", "date"]
  },
  podcast: {
    movability: "flexible",
    eisenhower: "Q4",
    priority_score: 20,
    stackability: "allowed",
    can_overlap_categories: ["travel", "commute"],
    cannot_overlap_categories: []
  },
  deadline_marker: {
    movability: "fixed",
    eisenhower: "Q1",
    priority_score: 95,
    stackability: "allowed",
    can_overlap_categories: ["medicine", "icu", "night_call", "day_call", "travel", "uworld", "research_meeting", "date", "gym"],
    cannot_overlap_categories: []
  },
  date: {
    movability: "semi_fixed",
    eisenhower: "Q2",
    priority_score: 65,
    stackability: "none",
    can_overlap_categories: [],
    cannot_overlap_categories: ["medicine", "icu", "night_call", "day_call", "travel", "uworld", "sleep"]
  }
};

function getDefaults(category) {
  return CATEGORY_DEFAULTS[category] || {
    movability: "unknown",
    eisenhower: "unknown",
    priority_score: 50,
    stackability: "unknown",
    can_overlap_categories: [],
    cannot_overlap_categories: []
  };
}

function parseAutomateOSMetadata(event) {
  const description = event.description || "";
  const marker = "AUTOMATEOS_METADATA_JSON:";
  const idx = description.indexOf(marker);

  if (idx === -1) return null;

  const afterMarker = description.slice(idx + marker.length);
  const endIdx = afterMarker.indexOf("---");
  const jsonText = (endIdx === -1 ? afterMarker : afterMarker.slice(0, endIdx)).trim();

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    return null;
  }
}

function normalizeEvent(event) {
  const metadata = parseAutomateOSMetadata(event);
  const category = metadata?.category || "unknown_manual_event";
  const defaults = getDefaults(category);

  return {
    google_event_id: event.id || "",
    title: event.summary || "(untitled)",
    start_datetime: event.start?.dateTime || event.start?.date || "",
    end_datetime: event.end?.dateTime || event.end?.date || "",
    status: event.status || "",
    category,
    movability: metadata?.movability || defaults.movability,
    eisenhower: metadata?.eisenhower || defaults.eisenhower,
    priority_score: metadata?.priority_score ?? defaults.priority_score,
    stackability: metadata?.stackability || defaults.stackability,
    can_overlap_categories: metadata?.can_overlap_categories || defaults.can_overlap_categories,
    cannot_overlap_categories: metadata?.cannot_overlap_categories || defaults.cannot_overlap_categories,
    confidence: metadata ? "high" : "low"
  };
}

function asTime(value) {
  if (!value) return null;
  return new Date(value).getTime();
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  const s1 = asTime(aStart);
  const e1 = asTime(aEnd);
  const s2 = asTime(bStart);
  const e2 = asTime(bEnd);

  if (!s1 || !e1 || !s2 || !e2) return true;

  return s1 < e2 && s2 < e1;
}

function canStack(proposed, existing) {
  if (proposed.category === "deadline_marker" || existing.category === "deadline_marker") {
    return true;
  }

  if (proposed.stackability === "allowed") {
    return proposed.can_overlap_categories.includes(existing.category);
  }

  if (existing.stackability === "allowed") {
    return existing.can_overlap_categories.includes(proposed.category);
  }

  if (proposed.can_overlap_categories.includes(existing.category)) {
    return true;
  }

  if (existing.can_overlap_categories.includes(proposed.category)) {
    return true;
  }

  if (proposed.cannot_overlap_categories.includes(existing.category)) {
    return false;
  }

  if (existing.cannot_overlap_categories.includes(proposed.category)) {
    return false;
  }

  return false;
}

const existingRaw = $input.all()
  .map(item => item.json)
  .filter(event => event && event.id && event.status !== "cancelled");

const existing = existingRaw
  .map(normalizeEvent)
  .filter(event =>
    overlaps(
      proposed.start_datetime,
      proposed.end_datetime,
      event.start_datetime,
      event.end_datetime
    )
  );

const compatibleConflicts = [];
const incompatibleConflicts = [];

for (const event of existing) {
  if (canStack(proposed, event)) {
    compatibleConflicts.push(event);
  } else {
    incompatibleConflicts.push(event);
  }
}

let decision = "create";
let should_create = true;
let audit_status = "passed";
let created_status = "created";
let reason = "No overlapping events found.";

if (existing.length > 0 && incompatibleConflicts.length === 0) {
  decision = "create_stacked";
  should_create = true;
  audit_status = "passed";
  created_status = "created_stacked";
  reason = "Only compatible/stackable overlapping events found.";
}

if (incompatibleConflicts.length > 0) {
  const proposedFixed = proposed.movability === "fixed";
  const allExistingMovable = incompatibleConflicts.every(e =>
    ["flexible", "high", "semi_fixed"].includes(e.movability)
  );

  if (proposedFixed && allExistingMovable) {
    decision = "create_and_flag_existing_for_reschedule";
    should_create = true;
    audit_status = "passed_with_warning";
    created_status = "created_reschedule_existing_needed";
    reason = "Proposed fixed event conflicts with movable existing event(s). Create proposed event and flag existing event(s) for reschedule.";
  } else if (proposed.movability === "flexible") {
    decision = "needs_reschedule_new_event";
    should_create = false;
    audit_status = "blocked";
    created_status = "not_created";
    reason = "Proposed flexible event conflicts with existing non-stackable event(s). Do not create here; find another slot.";
  } else {
    decision = "needs_review";
    should_create = false;
    audit_status = "blocked";
    created_status = "not_created";
    reason = "Proposed event conflicts with existing non-stackable event(s). Manual review needed.";
  }
}

return [
  {
    json: {
      ...proposed,
      should_create,
      decision,
      audit_status,
      created_status,
      reason,
      conflict_count: existing.length,
      compatible_conflict_count: compatibleConflicts.length,
      incompatible_conflict_count: incompatibleConflicts.length,
      compatible_conflicts: compatibleConflicts,
      incompatible_conflicts: incompatibleConflicts
    }
  }
];
