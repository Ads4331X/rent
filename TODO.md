# TODO

## Step 1 ✅

- Update `services/floorServices.ts`:
  - Replace per-item `.update()` loop for `bill_items` with a single `.upsert()` of the standard rows: Rent, Water, Garbage, Electricity Units.
  - Use `onConflict: "bill_id,name"` so missing rows get inserted.

## Step 2 ✅
- Update `app/floor/[id].tsx`:
  - Fix `electricityRate` mapping to read `rate` from `billItems` where `name === "Electricity Units"` (not `"Electricity"`).


## Step 3

- Verify behavior:
  - Navigate to a floor where bill_items is missing `Garbage` (e.g. floor 5 / bill_id=4).
  - Edit fields and press Save.
  - Confirm totals update immediately and bill has Garbage row.
