# Notification_System_Design.md

## Stage 1

### Problem
Users lose track of important notifications due to high volume. We need a **Priority Inbox** that always surfaces the top `n` most important unread notifications first.

### Priority Rules
Priority is determined by a **combination of type weight and recency**:

| Type       | Weight |
|------------|--------|
| Placement  | 3      |
| Result     | 2      |
| Event      | 1      |

**Score formula:**
```
score = typeWeight × 10^12 + timestamp_ms
```

This ensures:
- Type dominates: a Placement notification always outranks a Result or Event, regardless of time.
- Among same-type notifications, newer ones rank higher.

### Algorithm — Maintaining Top N Efficiently

#### Current (Batch) Approach
1. Fetch all notifications from the external API.
2. Score each notification using the formula above.
3. Sort descending by score and take the top `n`.

**Time complexity:** O(k log k) where k = total notifications.

#### Streaming / Real-Time Approach (for continuously incoming notifications)
To maintain the top `n` efficiently as new notifications arrive, we use a **min-heap of size n**:

1. Initialize an empty min-heap (keyed by score).
2. For each new incoming notification:
   - Compute its score.
   - If heap size < n → push it.
   - Else if score > heap.min → pop the min, push the new notification.
   - Else discard.
3. The heap always contains the current top `n`.

**Time complexity per new notification:** O(log n) — far more efficient than re-sorting all notifications every time.

**Space complexity:** O(n) — only stores n notifications in memory.

### API Endpoints

| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| GET    | `/notifications`                | All notifications from external API |
| GET    | `/priority-notifications?n=10`  | Top n priority notifications        |

### Why This Approach?
- Decouples priority logic from the external API.
- No DB required — pure in-memory computation.
- Easily extendable: add more type weights, custom user preferences, or read/unread state.
- The min-heap approach ensures we scale well as notification volume grows.
