# Clearskin Clinic — Digital Queue Management System
### Project Explanation & Perspective Breakdown

---

## 1. The Problem

Right now, the clinic runs on a manual, paper-based queue:

- The clinic opens at 9 AM, but the doctor arrives at 11 AM.
- Patients must physically arrive early and register their name on a paper list, in person, with the fee collector — even though the doctor isn't there for another two hours.
- This creates a **rush of people crowding reception first thing in the morning**, just to secure a place in line.
- Once the doctor arrives, consultations take 10–15 minutes each, but the actual time varies patient to patient — so the list order is right, but the *timing* is unpredictable.
- Patients who arrive on time for their slot but miss being called (stepped out, in the restroom, etc.) have no fair way to be slotted back in.
- Returning patients get a discounted fee (₹200 instead of ₹400) if they show their previous prescription — but this is tracked manually.

**The goal isn't to replace this system — it's to digitize the waiting, not the visit itself.** The doctor's process, the fee structure, and in-person registration for those who prefer it all stay exactly the same. What changes is *how patients wait*.

---

## 2. The Core Idea

A single, shared digital queue that both online bookers and walk-in patients join — ordered by check-in time, exactly like today's paper list, just visible to everyone in real time.

Nobody is forced to use a phone. Reception keeps working exactly as before for anyone who wants to register in person. The only difference is that reception now taps a name into a screen instead of writing it in a register — and that name instantly appears in the same live queue that online patients can also join from home.

---

## 3. Perspective: The Patient (booking online)

**Before:** Wake up early, travel to the clinic, stand in line for a number, then wait around for hours until the doctor arrives and works through the list.

**After:**
- Get a **digital token** from home, at any time before the online cap fills up.
- See a **live tracker**: current token being served, how many people are ahead, and an estimated wait time that updates as the day progresses.
- Get **notified** when it's nearly their turn (e.g., "2 patients ahead of you — please head to the clinic now"), so they can run errands instead of sitting in a waiting room.
- If they're not around when called, they aren't punished with a trip to the back of the queue — they're recalled and reinserted after a short buffer.
- On a return visit, their previous diagnosis is already linked to their token, so the ₹200 fee is applied automatically instead of relying on them physically carrying and showing the old prescription.

## 4. Perspective: The Elderly / Non-Digital Patient

This group is explicitly *not* forced into the app.

- They walk in and register with reception exactly as they do today — same conversation, same fee collection, same paper option if the clinic wants to keep a physical backup.
- The only change behind the scenes is that reception enters their name into the same digital list, so they automatically benefit from the same live queue, doctor timing, and fair recall handling — without needing to touch a phone themselves.
- A portion of daily tokens (see Section 6) is always reserved for walk-ins specifically so this group is never crowded out by online bookings.

## 5. Perspective: Reception Staff

**Before:** Manually write down every name, collect fees, keep track of who's next, and verbally manage disputes about queue order.

**After:**
- A simple dashboard replaces the paper register — same job (collect fee, add name), but the entry is now timestamped and visible to everyone automatically, reducing arguments over "who was here first."
- They can see the full queue, mark patients who didn't show up when called, and manually reorder the list if there's ever a real-world exception (e.g., a genuine emergency).
- Less time spent answering "how long is the wait?" repeatedly — patients can just check their phone.

## 6. Perspective: The Doctor

**Before:** Works through a paper list with no visibility into pacing, and no easy way to know how their day is trending until they're deep into it.

**After:**
- A minimal "Now Serving" panel with two buttons: **Complete Consultation** and **Patient Didn't Show**.
- The system automatically times each consultation and recalculates a **rolling average** (e.g., last 8 patients), so the wait-time estimates shown to patients stay realistic even on a day when some visits run short and others run long.
- No extra admin work — the doctor's actual workflow (diagnose, prescribe, set next visit date) doesn't change at all.

## 7. Perspective: Clinic Owner / Admin

- Visibility into daily patterns: total patients, average consultation time, no-show rate, online vs. walk-in split.
- Reduced morning crowding at reception, since patients aren't all arriving at once just to grab a paper number.
- A foundation that can later support features like SMS reminders, digital prescription history, or basic revenue tracking — without changing the fee structure or in-person option the clinic already relies on.

---

## 8. Handling Variable Consultation Times

Because 10–15 minutes is an average, not a fixed slot, the system doesn't promise exact appointment times. Instead:

- Every patient sees their position **relative to the doctor's current pace**, not a fixed clock time.
- The estimate recalculates after every consultation using a rolling average, so if the doctor runs faster or slower than usual, everyone's estimate adjusts automatically instead of drifting out of sync.

## 9. Fairness Rule for a Missed Turn

If patient #10 is called and isn't available:

1. Reception (or the doctor's panel) marks them **"Didn't show."**
2. Patient #11 is called next immediately — the queue doesn't stall.
3. Patient #10 isn't sent to the very back of the whole line. They're automatically **reinserted after the next 2 patients**, so they keep most of their place without blocking everyone behind them.
4. This is visible to the recalled patient in their tracker, so the process feels transparent rather than arbitrary.

## 10. Keeping It Fair Between Online and Walk-In

To make sure online booking doesn't crowd out people who register in person:

- Online tokens are capped at roughly **60–70% of the doctor's expected daily capacity**.
- The remainder is always reserved for walk-ins, so someone who shows up at reception is never told "fully booked."
- Both groups land on the exact same ordered list — there's no separate "online queue" that jumps ahead of the "walk-in queue."

---

## 11. What Doesn't Change

- The doctor's arrival time, consultation style, and prescription process.
- The fee structure (₹400 new, ₹200 follow-up).
- The option to register entirely in person, with no app required.
- Reception's role as the front desk of the clinic.

## 12. What's Being Proposed for a First Version

- A live queue tracker (patient-facing).
- A reception + doctor dashboard (shared queue, call next, mark complete/no-show).
- Rolling-average wait time calculation.
- Fair recall logic for missed turns.
- Online booking cap to protect walk-in access.
- Automatic follow-up fee detection based on patient history.

*(Not yet decided: whether SMS notifications should be a real service like Twilio or in-app only for v1, and whether returning patients are identified by phone number or a printed QR code on their prescription.)*