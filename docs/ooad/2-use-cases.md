## Actors

### 1. Store Staff

-   Primary user of the system
-   Views expiring products
-   Applies manual price adjustments
-   Marks products as handled

### 2. Store Manager

-   Views dashboard statistics
-   Analyzes frequently expiring products
-   Makes decisions on ordering and shelf placement

### 3. System (Automated Process)

-   Calculates expiry dates automatically
-   Generates price suggestions
-   Updates product status in real-time

### 4. Product Data Simulator (External System)

-   Simulates data flow from manufacturer/supplier
-   Adds new products with expiry dates to the system

## Use Cases

### Use case 1: View Expiring Products

**Actor:** Store Staff

**Precondition:** Products exist in the database with expiry dates

**Main Flow:**

1. Staff opens the dashboard
2. System retrieves all products from database
3. System calculates days remaining for each product
4. System applies color coding based on urgency
5. System sorts products by urgency (most urgent first)
6. System displays product list with color indicators

**Postcondition:** Staff sees prioritized list of products with visual urgency indicators

**Alternative Flow:**

-   3a: No products expire within 4 days = System displays "All products OK" message.

---

### Use case 2: Apply Manual Price Adjustment

**Actor:** Store Staff

**Precondition:** Product is displayed with price suggestion

**Main Flow:**

1. Staff clicks "Adjust Price" on a product
2. System opens price adjustment modal
3. Staff clicks quick action button (e.g -25%) or enters custom price
4. System calculates and displays preview:
    - New price
    - Discount amount
    - Discount percentage
    - Profit margin (if cost available)
5. Staff reviews preview and clicks "Confirm"
6. System validates input
7. System updates product price
8. System creates price history entry
9. System sets product status to "Handled"
10. System updates product display (grey/strikethrough)
11. System closes modal
12. Dashboard refreshes automatically

**Postcondition:** Product price is updated, change is logged, product is marked as handled.

**Alternative Flow:**

-   5a: Staff clicks "Cancel" = System closes modal without saving.
-   6a: Price < 0.01 SEK = System shows error "Invalid price".
-   6b: Price < cost = System shows warning but allows confirmation

---

### Use case 3: View Dashboard Statistics

**Actor:** Store Manager

**Precondition:** System has product data and price history

**Main Flow:**

1. Manager opens dashboard statistics view
2. System calculates statistics:
    - Count products per urgency level
    - Sum of applied discounts
    - Identify frequently expiring products
3. System displays statistics with visual indicators
4. System highlights products with >5 expiry incidents per month
5. System shows actionable insights (order adjustments, shelf placement)

**Postcondition:** Manager has overview of waste prevention status and problem areas

**Alternative Flow:**

-   2a: No price changes in timeframe = Display "No data for selected period"

---

### Use case 4: Automatic Price Suggestion Generation

**Actor:** System (Automated)

**Precondition:** Products exist with expiry dates

**Main Flow:**

1. System runs scheduled job (e.g once a day)
2. System retrieves all products
3. For each product:
    - Calculate days until expiry
    - Apply discount rules based on days remaining
    - Generate price suggestion
    - Update product status if changed
4. System saves updated price suggestions
5. System triggers real-time update to frontend

**Postcondition:** All products have current price suggestions based on latest expiry calculations

**Alternative Flow:**

-   3a: Product already handled = Skip price suggestion update

---

### Use case 5: Product Data Simulator

**Actor:** Product Data Simulator

**Precondition:** Simulator is configured with product templates

**Main Flow:**

1. Simulator generates new product data:
    - Product name, EAN, category
    - Manufacturing date
    - Expiry date
    - Original price
    - Cost price
2. Simulator sends POST request to API
3. System validates product data
4. System saves product to database
5. System triggers price suggestion calculation (Use case 4)
6. System updates dashboard display

**Postcondition:** New product is added to system with initial price suggestion

**Alternative Flow:**

-   3a. Invalid data = System returns error, simulator logs failure
-   3b. Duplicate EAN = System updates existing product instead of creating new
