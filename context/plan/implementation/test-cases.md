# Deterministic Router POC Test Cases

## Scope
Use these to validate router-first behavior and correct tool selection.

## Test Cases (10)
1. Calendar Create
   - Utterance: "Schedule a meeting tomorrow at 3"
   - Expected: `calendar_create_meeting`

2. Calendar List
   - Utterance: "List my calendar events"
   - Expected: `calendar_list_event`

3. Email Send
   - Utterance: "Send email to my friend"
   - Expected: `email_send_message`

4. Email Draft Update
   - Utterance: "Update my email draft"
   - Expected: `email_update_draft`

5. CRM Create Lead
   - Utterance: "Add a new lead"
   - Expected: `crm_create_lead`

6. Docs Share
   - Utterance: "Share this document"
   - Expected: `docs_update_share`

7. Tickets Priority Update
   - Utterance: "Change ticket priority to high"
   - Expected: `tickets_update_priority`

8. Travel Flight Lookup
   - Utterance: "Find my flight details"
   - Expected: `travel_get_flight`

9. Weather Alert
   - Utterance: "Get weather alerts"
   - Expected: `weather_get_alert`

10. Device Settings
    - Utterance: "Turn down device brightness"
    - Expected: `device_update_brightness`
