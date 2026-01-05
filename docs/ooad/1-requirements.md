# Requirements Analysis - DatumFlow

## Functional Requirements

### 1: Automatic Expiry Date Calculation

The system shall automatically calculate remaining days until product expiry.

### 2: Dynamic Price Suggestion

The system shall generate price suggestions based on remaining shelf life:

-   3-4 days: 85% (-15% discount)
-   2-3 days: 75% (-25% discount)
-   0-2 days: 50% (-50% discount)

### 3: Product Display with Sorting

The system shall display products sorted by urgency (expiry date).

### 4: Visual Color Coding

The system shall color-code products based on urgency:

-   Green: >4 days
-   Yellow: 3-4 days
-   Orange: 2-3 days
-   Red: 0-2 days

### 5: Price History Tracking

The system shall save all price changes with timestamp and reason.

### 6: Dashboard Statistics

The system shall display:

-   Number of products per urgency level
-   Applied discounts
-   **Frequent expiring products:**
    -   Products that repeatedly reach urgent status
    -   Number of times each product required discount
    -   Visual indicator for problematic products

### 7: Manual Price Handling & Status Update

The system shall allow staff to manually adjust product prices with real-time preview:

**Price Adjustment Interface:**

-   Input field for manual price entry
-   Quick action buttons: -15%, -25%, -50%
-   Real-time calculation display showing:
    -   New price in SEK
    -   Discount amount in SEK
    -   Discount percentage
    -   Profit margin:
        -   Display "Margin data not available"
        -   Note: DatumFlow focuses on expiry date management and price suggestions, not replacing existing margin calculation systems
-   "Preview" mode before confirmation
-   "Confirm" button to apply price change
-   "Cancel" button to discard changes

**After Confirmation:**

-   Price is updated in the system
-   Product status changes to "Handled"
-   Color coding is updated/removed
-   Price change is logged in price history
-   Product moves to "Handled" section

---

## Non-Functional Requirements

### 1: Real-time Updates

Price suggestions shall update automatically when expiry dates change.

### 2: User Experience

The interface shall be intuitive for store staff with minimal training.

### 3: Performance

-   API response time shall be under 200ms for product listing
-   Price preview calculations shall be instant (<50ms)

### 4: Scalability

The system shall handle 10,000+ products without performance degradation.

### 5: Data Integrity

All price changes shall be logged with complete audit trail (timestamp, old price, new price, reason, staff member).
