const body = $json.body ?? $json;

if (!body || body.action !== "place_calendar_event_safely") {
  throw new Error("Invalid payload: expected action = place_calendar_event_safely");
}

if (!body.start_datetime || !body.end_datetime) {
  throw new Error("Invalid payload: start_datetime and end_datetime are required");
}

const generatedUid = body.generated_event_uid || `event_${Date.now()}`;

const metadata = {
  generated_event_uid: generatedUid,
  source_assignment_id: body.source_assignment_id || "manual_event",
  category: body.category || "uncategorized",
  movability: body.movability || "flexible",
  eisenhower: body.eisenhower || "Q2",
  priority_score: body.priority_score ?? 50,
  stackability: body.stackability || "none",
  attention_requirement: body.attention_requirement || "unknown",
  location_requirement: body.location_requirement || "unknown",
  can_overlap_categories: body.can_overlap_categories || [],
  cannot_overlap_categories: body.cannot_overlap_categories || [],
  requires_review_if_overlap: body.requires_review_if_overlap ?? false
};

const userDescription = body.description || `AutomateOS generated event. UID: ${generatedUid}`;

const calendarDescription =
`${userDescription}

---
AUTOMATEOS_METADATA_JSON:
${JSON.stringify(metadata)}
---`;

return [
  {
    json: {
      action: body.action,
      generated_event_uid: generatedUid,
      source_assignment_id: metadata.source_assignment_id,
      title: body.title || "AutomateOS Event",
      start_datetime: body.start_datetime,
      end_datetime: body.end_datetime,
      timezone: body.timezone || "America/Chicago",
      description: userDescription,
      calendar_description: calendarDescription,
      ...metadata
    }
  }
];
