# TracPro - Product Requirements Document

## 1. Executive Summary

### 1.1 Product Overview
TracPro is a lightweight, mobile-first expense tracking Progressive Web Application (PWA) designed for personal use by you and your spouse. The application integrates seamlessly with Google Sheets to store and organize expense data, eliminating the need for a traditional backend database while ensuring data accessibility and longevity.

### 1.2 Key Objectives
- Provide a simple, intuitive interface for tracking daily expenses
- Automatically organize expenses into monthly sheets within a single Google Spreadsheet
- Enable customization of expense categories and settings
- Deliver a completely free solution with zero deployment and maintenance costs
- Ensure optimal mobile experience for on-the-go expense entry

### 1.3 Target Users
- You and your spouse (2 users)
- Primary usage via smartphones
- Occasional desktop access for viewing/analysis

---

## 2. Product Scope

### 2.1 In Scope
- Expense entry and tracking
- Google Sheets integration
- Custom expense categories management
- Payment type management
- User (Paid by) management
- Monthly sheet auto-creation
- Mobile-responsive design
- Offline capability (PWA)
- Settings management

### 2.2 Out of Scope
- Multi-user authentication/authorization
- Budget planning and forecasting
- Advanced analytics and reporting
- Receipt scanning/OCR
- Multi-currency support
- Export to other formats
- Automated expense categorization
- Bank account integration
- Recurring expense automation

---

## 3. Technical Architecture

### 3.1 Technology Stack

#### Frontend
- **Framework**: React.js with Vite (for fast builds and optimal performance)
- **UI Library**: Material-UI (MUI) or Tailwind CSS
- **State Management**: React Context API + Local Storage
- **PWA**: Workbox for service worker management
- **Date Handling**: date-fns or Day.js

#### Backend/Data Layer
- **Database**: Google Sheets API v4
- **Authentication**: Google OAuth 2.0 (for Sheets access)
- **API Client**: Google APIs Client Library for JavaScript

#### Hosting
- **Platform**: Vercel (Free Tier)
- **Alternative**: Netlify or GitHub Pages
- **Domain**: Free subdomain (tracpro.vercel.app)

### 3.2 Architecture Diagram

```
┌─────────────────────────────────────┐
│     TracPro PWA (React App)         │
│  ┌───────────────────────────────┐  │
│  │   Expense Entry Screen        │  │
│  │   Category Management Screen  │  │
│  │   Settings Screen             │  │
│  └───────────────┬───────────────┘  │
│                  │                   │
│  ┌───────────────▼───────────────┐  │
│  │   Local State + LocalStorage  │  │
│  └───────────────┬───────────────┘  │
│                  │                   │
│  ┌───────────────▼───────────────┐  │
│  │   Google Sheets API Client    │  │
│  └───────────────┬───────────────┘  │
└──────────────────┼───────────────────┘
                   │
                   │ HTTPS
                   ▼
      ┌────────────────────────┐
      │   Google Sheets API    │
      └────────────┬───────────┘
                   │
                   ▼
      ┌────────────────────────┐
      │  Your Google Sheet     │
      │  ├─ November 2025      │
      │  ├─ December 2025      │
      │  └─ January 2026       │
      └────────────────────────┘
```

### 3.3 Google Sheets Structure

#### Main Sheet Structure
- **Sheet Name**: TracPro_Data (or user-defined)
- **Tabs**: Monthly sheets (e.g., "November 2025", "December 2025")

#### Monthly Sheet Columns
| Column | Field Name | Type | Description |
|--------|-----------|------|-------------|
| A | Date | Date | DD-MM-YYYY format |
| B | Expense Amount | Number | Amount in ₹ |
| C | Expense Type | String | Category (e.g., Groceries, Transport) |
| D | Payment Type | String | Payment method (e.g., Cash, UPI, Card) |
| E | Paid By | String | User name (You/Spouse name) |
| F | Remarks | String | Optional notes |
| G | Timestamp | Timestamp | Auto-generated entry time |

#### Configuration Sheet
- **Sheet Name**: "_config"
- **Purpose**: Store app configuration
- **Structure**:
  - Row 1: Expense Types (comma-separated)
  - Row 2: Payment Types (comma-separated)
  - Row 3: Paid By (comma-separated names)
  - Row 4: Last Updated timestamp

---

## 4. Feature Requirements

### 4.1 Expense Entry Screen (Home Screen)

#### 4.1.1 UI Components
```
┌────────────────────────────────────┐
│  TracPro                    ⚙️     │
├────────────────────────────────────┤
│                                    │
│  📅 Date                          │
│  [23-Nov-2025          ▼]        │
│                                    │
│  💰 Amount                        │
│  [₹ _____________]                │
│                                    │
│  🏷️ Expense Type                  │
│  [Groceries         ▼]           │
│                                    │
│  💳 Payment Type                  │
│  [UPI               ▼]           │
│                                    │
│  👤 Paid By                       │
│  [Karthik           ▼]           │
│                                    │
│  📝 Remarks (Optional)            │
│  [___________________]            │
│                                    │
│     [  Add Expense  ]             │
│                                    │
├────────────────────────────────────┤
│  Recent Expenses                   │
│  ┌──────────────────────────────┐ │
│  │ 23-Nov  Groceries    ₹850   │ │
│  │ UPI • Karthik                │ │
│  ├──────────────────────────────┤ │
│  │ 22-Nov  Transport    ₹200   │ │
│  │ Cash • Spouse Name           │ │
│  └──────────────────────────────┘ │
│                                    │
│  [🏠 Home] [📊 Stats] [⚙️ Settings]│
└────────────────────────────────────┘
```

#### 4.1.2 Functional Requirements

**FR-1.1: Date Selection**
- Default to current date
- Date picker for past/future dates
- Format: DD-MM-YYYY

**FR-1.2: Amount Entry**
- Numeric keyboard on mobile
- Currency symbol (₹) prefix
- Maximum 10 digits
- Required field validation

**FR-1.3: Expense Type Dropdown**
- Populated from configuration
- Alphabetically sorted
- If no types configured, show "Configure in Settings"

**FR-1.4: Payment Type Dropdown**
- Populated from configuration
- Shows all configured payment methods
- If no types configured, show "Configure in Settings"

**FR-1.5: Paid By Dropdown**
- Shows configured names
- Default to last selected user (stored in localStorage)

**FR-1.6: Remarks Field**
- Optional text field
- Maximum 200 characters
- Multiline support

**FR-1.7: Add Expense Button**
- Validates all required fields
- Shows loading state during API call
- Displays success/error messages
- Clears form after successful submission
- Retains last selected "Paid By" value

**FR-1.8: Recent Expenses List**
- Shows last 10 expenses from current month
- Display: Date, Type, Amount, Payment method, Paid by
- Tap to view/edit (optional enhancement)
- Pull to refresh

#### 4.1.3 Expense Submission Logic

```javascript
// Pseudocode for expense submission
async function submitExpense(expenseData) {
  // 1. Validate required fields
  if (!validateExpense(expenseData)) {
    showError("Please fill all required fields");
    return;
  }
  
  // 2. Determine target sheet name
  const sheetName = formatMonthYear(expenseData.date); // "November 2025"
  
  // 3. Check if sheet exists, create if not
  await ensureSheetExists(sheetName);
  
  // 4. Append row to sheet
  const row = [
    expenseData.date,
    expenseData.amount,
    expenseData.expenseType,
    expenseData.paymentType,
    expenseData.paidBy,
    expenseData.remarks || "",
    new Date().toISOString()
  ];
  
  await appendToSheet(sheetName, row);
  
  // 5. Update local recent expenses cache
  updateLocalCache(expenseData);
  
  // 6. Show success message
  showSuccess("Expense added successfully!");
}
```

### 4.2 Category Management Screen

#### 4.2.1 UI Components
```
┌────────────────────────────────────┐
│  ← Manage Categories               │
├────────────────────────────────────┤
│                                    │
│  📑 Expense Types                  │
│  ┌──────────────────────────────┐ │
│  │ Groceries              [×]   │ │
│  │ Transport              [×]   │ │
│  │ Bills & Utilities      [×]   │ │
│  │ Entertainment          [×]   │ │
│  │ Healthcare             [×]   │ │
│  │ Education              [×]   │ │
│  │ Shopping               [×]   │ │
│  │                              │ │
│  │ [+ Add Expense Type]         │ │
│  └──────────────────────────────┘ │
│                                    │
│  💳 Payment Types                  │
│  ┌──────────────────────────────┐ │
│  │ Cash                   [×]   │ │
│  │ UPI                    [×]   │ │
│  │ Credit Card            [×]   │ │
│  │ Debit Card             [×]   │ │
│  │ Net Banking            [×]   │ │
│  │                              │ │
│  │ [+ Add Payment Type]         │ │
│  └──────────────────────────────┘ │
│                                    │
│  👥 Paid By                        │
│  ┌──────────────────────────────┐ │
│  │ Karthik                [×]   │ │
│  │ [Spouse Name]          [×]   │ │
│  │                              │ │
│  │ [+ Add Person]               │ │
│  └──────────────────────────────┘ │
│                                    │
│       [  Save Changes  ]           │
│                                    │
└────────────────────────────────────┘
```

#### 4.2.2 Functional Requirements

**FR-2.1: View Categories**
- Display all expense types in scrollable list
- Display all payment types in scrollable list
- Display all users in list
- Each item has delete button (×)

**FR-2.2: Add New Category**
- Click "+ Add" button
- Modal/inline input appears
- Enter category name (max 30 characters)
- Validates for duplicates
- Adds to list immediately
- Updates Google Sheet configuration

**FR-2.3: Delete Category**
- Click × button next to item
- Confirmation dialog: "Delete [Category]? This cannot be undone."
- Removes from list
- Updates Google Sheet configuration
- Shows success message

**FR-2.4: Default Categories**
```javascript
const defaultExpenseTypes = [
  "Groceries",
  "Transport",
  "Bills & Utilities",
  "Entertainment",
  "Healthcare",
  "Education",
  "Shopping",
  "Food & Dining"
];

const defaultPaymentTypes = [
  "Cash",
  "UPI",
  "Credit Card",
  "Debit Card"
];

const defaultUsers = [
  "User 1",
  "User 2"
];
```

**FR-2.5: Save Changes**
- Batch update all changes
- Write to _config sheet in Google Sheets
- Show loading state
- Display success/error message
- Navigate back to home screen on success

### 4.3 Settings Screen

#### 4.3.1 UI Components
```
┌────────────────────────────────────┐
│  ← Settings                        │
├────────────────────────────────────┤
│                                    │
│  🔗 Google Sheets Connection       │
│  ┌──────────────────────────────┐ │
│  │ Status: ✅ Connected         │ │
│  │                              │ │
│  │ Sheet Name:                  │ │
│  │ TracPro_Expenses             │ │
│  │                              │ │
│  │ [Reconnect Google Account]   │ │
│  │ [Change Sheet]               │ │
│  └──────────────────────────────┘ │
│                                    │
│  📋 Manage Categories              │
│  ┌──────────────────────────────┐ │
│  │ [Manage Expense Types    >]  │ │
│  │ [Manage Payment Types    >]  │ │
│  │ [Manage Users            >]  │ │
│  └──────────────────────────────┘ │
│                                    │
│  🎨 Appearance                     │
│  ┌──────────────────────────────┐ │
│  │ Theme: [Light/Dark]          │ │
│  └──────────────────────────────┘ │
│                                    │
│  ℹ️ About                          │
│  ┌──────────────────────────────┐ │
│  │ Version: 1.0.0               │ │
│  │ Made for personal use        │ │
│  └──────────────────────────────┘ │
│                                    │
└────────────────────────────────────┘
```

#### 4.3.2 Functional Requirements

**FR-3.1: Google Account Connection**
- "Connect Google Account" button (first time)
- OAuth 2.0 flow with Google
- Request permissions:
  - View and manage Google Sheets
- Store access token securely in localStorage
- Display connection status

**FR-3.2: Sheet Selection/Creation**
- After authentication, show sheet picker
- Option to:
  - Select existing sheet
  - Create new sheet with template
- Display current connected sheet name
- Option to change sheet

**FR-3.3: Sheet Creation Flow**
```javascript
async function createNewSheet() {
  // 1. Create new Google Sheet
  const sheet = await createGoogleSheet("TracPro_Expenses");
  
  // 2. Create _config sheet
  await createConfigSheet(sheet.id);
  
  // 3. Add default categories to _config
  await initializeDefaultCategories(sheet.id);
  
  // 4. Create current month sheet with headers
  const currentMonth = formatMonthYear(new Date());
  await createMonthSheet(sheet.id, currentMonth);
  
  // 5. Save sheet ID to localStorage
  saveSheetConfig(sheet.id, sheet.name);
  
  return sheet;
}
```

**FR-3.4: Connection Status**
- Green checkmark if connected
- Red warning if disconnected/token expired
- "Reconnect" button if token expired
- Test connection on settings screen load

**FR-3.5: Navigate to Category Management**
- Links to manage expense types, payment types, users
- Opens Category Management Screen

**FR-3.6: Theme Toggle** (Optional Enhancement)
- Light/Dark mode switch
- Saves preference to localStorage
- Applies theme across app

**FR-3.7: App Information**
- Display app version
- Link to documentation (if applicable)

### 4.4 Auto-Sheet Creation Logic

#### 4.4.1 Monthly Sheet Creation
**FR-4.1: Sheet Naming Convention**
- Format: "MMMM YYYY" (e.g., "November 2025")
- Full month name, 4-digit year
- English locale

**FR-4.2: Auto-Creation Trigger**
- Check when adding expense
- If sheet for expense date doesn't exist, create it
- Add headers row automatically

**FR-4.3: Sheet Template**
```javascript
const createMonthlySheet = async (sheetId, monthYear) => {
  const headers = [
    "Date",
    "Amount",
    "Expense Type",
    "Payment Type",
    "Paid By",
    "Remarks",
    "Timestamp"
  ];
  
  // Create sheet tab
  await createSheetTab(sheetId, monthYear);
  
  // Add headers with formatting
  await addHeaders(sheetId, monthYear, headers);
  
  // Format columns
  await formatColumns(sheetId, monthYear, {
    dateColumn: "DD-MM-YYYY",
    amountColumn: "₹#,##0.00",
    timestampColumn: "DD-MM-YYYY HH:mm:ss"
  });
};
```

**FR-4.4: Sheet Ordering**
- Most recent month first (left to right)
- Older months move to the right
- _config sheet stays hidden or at the end

---

## 5. User Interface Design

### 5.1 Design Principles
- **Mobile-First**: Optimize for smartphone usage
- **Minimal Clicks**: Add expense in 4-5 taps
- **Clear Feedback**: Visual confirmation for all actions
- **Offline Support**: Work without internet, sync when online
- **Fast Loading**: PWA caching for instant load times

### 5.2 Color Scheme (Suggested)
```css
Primary: #4CAF50 (Green - financial growth)
Secondary: #2196F3 (Blue - trust)
Accent: #FF9800 (Orange - highlights)
Background: #FFFFFF (Light) / #121212 (Dark)
Text: #212121 (Light) / #FFFFFF (Dark)
Error: #F44336
Success: #4CAF50
```

### 5.3 Typography
- Font Family: Roboto or System UI
- Headers: 20-24px, Semi-bold
- Body: 16px, Regular
- Captions: 14px, Regular

### 5.4 Navigation
**Bottom Navigation Bar** (Mobile)
- Home (Expense Entry)
- Stats (Future: Monthly summary)
- Settings

**Top App Bar**
- Title: "TracPro"
- Settings icon (gear)

### 5.5 Responsive Breakpoints
- Mobile: < 768px (primary focus)
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 6. Data Flow & API Integration

### 6.1 Google Sheets API Integration

#### 6.1.1 Authentication Flow
```
1. User opens app
2. Check localStorage for access token
3. If no token:
   → Show "Connect Google Account" button
   → Initiate OAuth 2.0 flow
   → User grants permissions
   → Receive access token
   → Store in localStorage
4. If token exists:
   → Validate token
   → If expired, refresh or re-authenticate
   → Load app
```

#### 6.1.2 Required API Scopes
```
https://www.googleapis.com/auth/spreadsheets
```

#### 6.1.3 API Operations

**Read Operations**
```javascript
// Get configuration
GET /v4/spreadsheets/{sheetId}/values/_config!A1:C3

// Get recent expenses (last 10 from current month)
GET /v4/spreadsheets/{sheetId}/values/'November 2025'!A2:G11

// Check if sheet exists
GET /v4/spreadsheets/{sheetId}
```

**Write Operations**
```javascript
// Append expense
POST /v4/spreadsheets/{sheetId}/values/'November 2025'!A:G:append
Body: {
  values: [[date, amount, type, payment, paidBy, remarks, timestamp]]
}

// Update configuration
PUT /v4/spreadsheets/{sheetId}/values/_config!A1:C3
Body: {
  values: [
    [expenseTypes],
    [paymentTypes],
    [users]
  ]
}

// Create new sheet
POST /v4/spreadsheets/{sheetId}:batchUpdate
Body: {
  requests: [{
    addSheet: {
      properties: { title: "December 2025" }
    }
  }]
}
```

### 6.2 Local Storage Structure
```javascript
{
  "tracpro_google_token": "ya29.xxx...",
  "tracpro_sheet_id": "1ABC123xyz...",
  "tracpro_sheet_name": "TracPro_Expenses",
  "tracpro_last_paid_by": "Karthik",
  "tracpro_theme": "light",
  "tracpro_cache_expense_types": ["Groceries", "Transport", ...],
  "tracpro_cache_payment_types": ["Cash", "UPI", ...],
  "tracpro_cache_users": ["Karthik", "Spouse Name"],
  "tracpro_cache_recent": [{...}, {...}],
  "tracpro_cache_timestamp": "2025-11-23T10:30:00Z"
}
```

### 6.3 Offline Handling
- Cache configuration data in localStorage
- Queue expenses when offline
- Sync queue when connection restored
- Show offline indicator
- Prevent duplicate entries

---

## 7. Deployment Strategy (Free Hosting)

### 7.1 Recommended Platform: Vercel

#### Why Vercel?
- ✅ Completely free for personal projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments from Git
- ✅ Zero configuration
- ✅ Built-in PWA support
- ✅ Free subdomain: tracpro.vercel.app

#### Limitations
- 100GB bandwidth/month (more than sufficient)
- 100 deployments/day
- No credit card required

### 7.2 Alternative Platforms

| Platform | Free Tier | HTTPS | Custom Domain | Notes |
|----------|-----------|-------|---------------|-------|
| **Vercel** | Yes | Yes | Yes (1 free) | Recommended |
| **Netlify** | Yes | Yes | Yes (1 free) | Great alternative |
| **GitHub Pages** | Yes | Yes | Yes | Requires public repo |
| **Firebase Hosting** | Yes | Yes | Yes | Good option |
| **Cloudflare Pages** | Yes | Yes | Yes | Fastest CDN |

### 7.3 Deployment Steps (Vercel)

#### Step 1: Prepare Project
```bash
# 1. Create React app with Vite
npm create vite@latest tracpro -- --template react

# 2. Install dependencies
cd tracpro
npm install

# 3. Install required packages
npm install @mui/material @emotion/react @emotion/styled
npm install @google/generative-ai  # If using AI features
npm install date-fns
npm install workbox-precaching workbox-routing

# 4. Test locally
npm run dev
```

#### Step 2: Configure PWA
```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'TracPro - Expense Tracker',
        short_name: 'TracPro',
        description: 'Personal expense tracking app',
        theme_color: '#4CAF50',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
};
```

#### Step 3: Push to GitHub
```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository (via GitHub.com)
# Then push
git remote add origin https://github.com/yourusername/tracpro.git
git branch -M main
git push -u origin main
```

#### Step 4: Deploy to Vercel
1. Go to vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your tracpro repository
5. Framework Preset: Vite
6. Click "Deploy"
7. Your app will be live at: https://tracpro.vercel.app

#### Step 5: Configure Google OAuth
1. Go to Google Cloud Console (console.cloud.google.com)
2. Create new project: "TracPro"
3. Enable Google Sheets API
4. Create OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     - https://tracpro.vercel.app
     - http://localhost:5173 (for local dev)
5. Copy Client ID and add to app

### 7.4 Environment Variables
```bash
# .env file (not committed to git)
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

### 7.5 Mobile Access Setup

#### iOS (iPhone/iPad)
1. Open Safari
2. Navigate to https://tracpro.vercel.app
3. Tap Share button (square with arrow)
4. Scroll down, tap "Add to Home Screen"
5. Name: "TracPro"
6. Tap "Add"
7. App appears on home screen like native app

#### Android
1. Open Chrome
2. Navigate to https://tracpro.vercel.app
3. Tap three-dot menu
4. Tap "Add to Home screen"
5. Name: "TracPro"
6. Tap "Add"
7. Confirm by tapping "Add" again
8. App appears on home screen

### 7.6 Continuous Deployment
- Any push to `main` branch auto-deploys
- Preview deployments for pull requests
- Rollback to previous versions anytime
- View deployment logs in Vercel dashboard

---

## 8. Development Roadmap

### Phase 1: Core Development (Week 1-2)
**Milestone 1.1: Setup & Authentication**
- [ ] Initialize React + Vite project
- [ ] Setup Google Cloud project & OAuth
- [ ] Implement Google authentication flow
- [ ] Test token storage and validation

**Milestone 1.2: Basic Expense Entry**
- [ ] Create expense entry form UI
- [ ] Implement date picker
- [ ] Implement amount input with validation
- [ ] Create dropdowns (hardcoded initially)
- [ ] Submit expense to Google Sheets
- [ ] Show success/error messages

**Milestone 1.3: Google Sheets Integration**
- [ ] Create _config sheet structure
- [ ] Implement auto-sheet creation logic
- [ ] Test data append functionality
- [ ] Verify sheet naming and organization

### Phase 2: Category Management (Week 3)
**Milestone 2.1: Settings Screen**
- [ ] Create settings UI
- [ ] Display Google connection status
- [ ] Implement sheet selection
- [ ] Add reconnect functionality

**Milestone 2.2: Category Management**
- [ ] Create category management UI
- [ ] Implement add expense type
- [ ] Implement delete expense type
- [ ] Implement add payment type
- [ ] Implement delete payment type
- [ ] Implement add/delete users
- [ ] Save changes to _config sheet

**Milestone 2.3: Dynamic Dropdowns**
- [ ] Load categories from _config
- [ ] Populate dropdowns dynamically
- [ ] Handle empty configuration state
- [ ] Implement caching for performance

### Phase 3: Polish & PWA (Week 4)
**Milestone 3.1: UI/UX Refinement**
- [ ] Implement responsive design
- [ ] Add loading states
- [ ] Improve error handling
- [ ] Add animations and transitions
- [ ] Recent expenses list
- [ ] Theme toggle (optional)

**Milestone 3.2: PWA Implementation**
- [ ] Configure service worker
- [ ] Add app manifest
- [ ] Create app icons
- [ ] Test offline functionality
- [ ] Implement sync queue
- [ ] Test install on iOS/Android

**Milestone 3.3: Testing & Deployment**
- [ ] Test all user flows
- [ ] Test on multiple devices
- [ ] Fix bugs
- [ ] Deploy to Vercel
- [ ] Test live deployment
- [ ] Install on personal devices

### Phase 4: Optional Enhancements (Future)
- [ ] Monthly summary statistics
- [ ] Edit/delete existing expenses
- [ ] Search and filter expenses
- [ ] Export month data as CSV
- [ ] Expense charts and graphs
- [ ] Category-wise spending analysis
- [ ] Dark mode
- [ ] Backup/restore functionality

---

## 9. Testing Plan

### 9.1 Manual Testing Checklist

#### Authentication
- [ ] Connect Google account successfully
- [ ] Token persists after page refresh
- [ ] Reconnect after token expiry
- [ ] Handle denied permissions gracefully

#### Expense Entry
- [ ] Add expense with all fields
- [ ] Validate required fields
- [ ] Test date picker (past/future dates)
- [ ] Verify amount formatting
- [ ] Test dropdown selections
- [ ] Submit expense successfully
- [ ] Verify data in Google Sheet
- [ ] Test remarks (optional field)

#### Sheet Management
- [ ] New month sheet auto-created
- [ ] Headers added correctly
- [ ] Data goes to correct month sheet
- [ ] Sheet naming is correct
- [ ] Multiple expenses in same month

#### Category Management
- [ ] Add new expense type
- [ ] Delete expense type
- [ ] Add new payment type
- [ ] Delete payment type
- [ ] Add new user
- [ ] Delete user
- [ ] Changes reflect in dropdowns
- [ ] Changes saved to _config sheet

#### Mobile Experience
- [ ] Responsive on phone screen
- [ ] Touch targets adequate size
- [ ] Keyboard appears for inputs
- [ ] Dropdowns work properly
- [ ] Install as PWA (iOS)
- [ ] Install as PWA (Android)
- [ ] Offline functionality

#### Edge Cases
- [ ] No internet connection
- [ ] Sheet deleted externally
- [ ] Duplicate category names
- [ ] Special characters in fields
- [ ] Very long remarks
- [ ] Simultaneous entries from 2 devices

### 9.2 Browser Testing
- Chrome (Desktop & Mobile)
- Safari (Desktop & Mobile)
- Firefox (Desktop)
- Edge (Desktop)

### 9.3 Device Testing
- Android smartphone
- iPhone
- iPad
- Desktop browser

---

## 10. Security & Privacy

### 10.1 Data Security
- OAuth 2.0 for authentication
- HTTPS only (enforced by Vercel)
- Tokens stored in localStorage (not sessionStorage for persistence)
- No sensitive data in URL parameters
- No server-side storage (everything client-side + Google Sheets)

### 10.2 Privacy Considerations
- Only you and spouse have access
- Google Sheets owned by your account
- No third-party analytics (unless you add)
- No data collection
- No cookies except authentication

### 10.3 Google Sheet Permissions
- Keep sheet private (not shared publicly)
- Only share with spouse's Google account
- Review app permissions periodically
- Revoke access if needed

---

## 11. Maintenance & Support

### 11.1 Ongoing Costs
- **Hosting**: ₹0 (Vercel free tier)
- **Domain**: ₹0 (using .vercel.app subdomain)
- **Google Sheets**: ₹0 (included in Google account)
- **Total**: ₹0/month forever

### 11.2 Maintenance Tasks
- Review Google token expiry (refresh if needed)
- Monitor Vercel free tier limits (unlikely to exceed)
- Update dependencies occasionally (optional)
- Backup Google Sheet periodically (manual download)

### 11.3 Scaling Considerations
**If usage increases:**
- Google Sheets can handle 10 million cells (sufficient for years)
- Vercel free tier: 100GB bandwidth (thousands of users)
- No performance issues expected for 2 users

**Data Backup:**
- Google Sheets auto-saves
- Download monthly sheets as Excel backup
- Consider Google Drive versioning

---

## 12. Success Metrics

### 12.1 Launch Criteria (MVP)
✅ Can add expense with all fields  
✅ Data saves to Google Sheet correctly  
✅ Monthly sheets auto-created  
✅ Categories can be added/removed  
✅ Settings work correctly  
✅ PWA installable on phone  
✅ Works offline (queues expenses)  
✅ Zero deployment cost  

### 12.2 User Satisfaction
- Expense entry takes < 30 seconds
- App loads in < 2 seconds
- No bugs in critical flows
- Feels like native app on phone

---

## 13. Technical Specifications

### 13.1 Performance Requirements
- Initial load: < 3 seconds
- Expense submission: < 2 seconds
- Offline to online sync: < 5 seconds
- App size: < 5MB

### 13.2 Browser Compatibility
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

### 13.3 PWA Requirements
- Service Worker registered
- Manifest.json configured
- App installable
- Works offline
- Push notifications (future)

---

## 14. Code Structure

### 14.1 Project Structure
```
tracpro/
├── public/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ExpenseForm.jsx
│   │   ├── RecentExpenses.jsx
│   │   ├── CategoryManager.jsx
│   │   ├── SettingsScreen.jsx
│   │   └── Navigation.jsx
│   ├── services/
│   │   ├── googleSheets.js
│   │   ├── auth.js
│   │   └── storage.js
│   ├── utils/
│   │   ├── dateUtils.js
│   │   ├── validators.js
│   │   └── constants.js
│   ├── context/
│   │   └── AppContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

### 14.2 Key Components

#### ExpenseForm.jsx
```jsx
// Handles expense entry form
- Date picker
- Amount input
- Category dropdowns
- Submit logic
```

#### CategoryManager.jsx
```jsx
// Manages expense types, payment types, users
- Display lists
- Add new items
- Delete items
- Save to Google Sheets
```

#### googleSheets.js
```javascript
// All Google Sheets API interactions
- appendExpense()
- createMonthSheet()
- getConfig()
- updateConfig()
- ensureSheetExists()
```

#### auth.js
```javascript
// Google OAuth handling
- initAuth()
- getToken()
- refreshToken()
- revokeToken()
```

---

## 15. Error Handling

### 15.1 Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Not authenticated" | No Google token | Redirect to login |
| "Sheet not found" | Sheet ID invalid | Show sheet picker |
| "Failed to append" | Network error | Queue for retry |
| "Invalid date" | Date format issue | Show error, prevent submit |
| "Token expired" | OAuth token expired | Auto-refresh or re-login |

### 15.2 User-Facing Messages
- ✅ Success: "Expense added successfully!"
- ⚠️ Warning: "No internet connection. Expense will sync when online."
- ❌ Error: "Failed to add expense. Please try again."
- 🔄 Loading: "Adding expense..."

---

## 16. Future Enhancements (Post-MVP)

### Priority 1 (High Value)
1. **Monthly Summary Dashboard**
   - Total spent this month
   - Category-wise breakdown
   - Payment method distribution
   - Top 5 expenses

2. **Edit/Delete Expenses**
   - Tap expense to edit
   - Swipe to delete
   - Confirmation dialogs

3. **Search & Filter**
   - Search by remarks
   - Filter by expense type
   - Filter by payment type
   - Filter by date range

### Priority 2 (Nice to Have)
4. **Budget Alerts**
   - Set monthly budget
   - Category-wise budgets
   - Alert when nearing limit

5. **Charts & Graphs**
   - Pie chart by category
   - Line graph over time
   - Compare months

6. **Export Features**
   - Export month as PDF
   - Export as Excel
   - Email monthly report

### Priority 3 (Future)
7. **Recurring Expenses**
   - Add recurring expense template
   - Auto-add monthly bills
   - Subscription tracking

8. **Receipt Upload**
   - Attach photo to expense
   - OCR to extract amount
   - Store in Google Drive

9. **Multi-Currency**
   - Support other currencies
   - Auto-conversion rates

---

## 17. Conclusion

TracPro is designed to be a simple, effective, and completely free expense tracking solution for personal use. By leveraging Google Sheets as the backend and deploying on Vercel's free tier, the application achieves zero ongoing costs while providing a robust, mobile-first experience.

The MVP focuses on core functionality—adding expenses, organizing by month, and managing categories—while maintaining a clean, intuitive interface optimized for smartphone usage. The PWA architecture ensures the app feels native, works offline, and can be installed directly on your home screen.

---

## 18. Quick Start Guide (For Developers)

### One-Time Setup
```bash
# 1. Clone/create project
git clone <your-repo> tracpro
cd tracpro

# 2. Install dependencies
npm install

# 3. Create .env file
echo "VITE_GOOGLE_CLIENT_ID=your_client_id" > .env

# 4. Run development server
npm run dev

# 5. Open http://localhost:5173
```

### Deploy to Production
```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Import to Vercel
# - Go to vercel.com
# - Import repository
# - Add environment variable
# - Deploy

# 3. Install on phone
# - Open https://tracpro.vercel.app
# - Add to Home Screen
# - Done!
```

---

## 19. Support & Resources

### Documentation
- Google Sheets API: https://developers.google.com/sheets/api
- React: https://react.dev
- Vercel: https://vercel.com/docs
- PWA: https://web.dev/progressive-web-apps/

### Troubleshooting
- Check browser console for errors
- Verify Google OAuth configuration
- Test in incognito mode
- Clear cache and localStorage

### Contact
- Create GitHub issue for bugs
- Personal use only (no official support)

---

**Document Version**: 1.0  
**Last Updated**: November 23, 2025  
**Status**: Ready for Development  
**Estimated Development Time**: 3-4 weeks  
**Total Cost**: ₹0 (Free Forever)

---

