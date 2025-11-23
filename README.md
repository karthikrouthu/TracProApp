# TracPro - Personal Expense Tracker

A lightweight, mobile-first expense tracking Progressive Web Application (PWA) with Google Sheets integration. Track your expenses seamlessly with a modern, minimalist interface.

## ✨ Features

- 📱 **Mobile-First Design** - Optimized for smartphones with responsive layout
- 💾 **Google Sheets Integration** - All data stored in your personal Google Sheet
- 🎨 **Modern UI** - Beautiful minimalist design with smooth animations
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📊 **Auto-Organization** - Expenses automatically organized into monthly sheets
- 🔧 **Customizable** - Manage your own expense types, payment methods, and users
- 💰 **Indian Rupee (₹)** - Built specifically for INR currency
- 📴 **Offline Support** - PWA capabilities for offline functionality
- 🆓 **100% Free** - Zero deployment and maintenance costs

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- Google account
- Google Cloud project with Sheets API enabled

### Installation

1. **Clone the repository**
   ```bash
   cd TracPro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google OAuth**
   
   a. Go to [Google Cloud Console](https://console.cloud.google.com)
   
   b. Create a new project or select existing one
   
   c. Enable Google Sheets API:
      - Navigate to "APIs & Services" > "Library"
      - Search for "Google Sheets API"
      - Click "Enable"
   
   d. Create OAuth 2.0 credentials:
      - Go to "APIs & Services" > "Credentials"
      - Click "Create Credentials" > "OAuth client ID"
      - Application type: "Web application"
      - Add authorized redirect URIs:
        - `http://localhost:5173` (for development)
        - Your production URL (e.g., `https://tracpro.vercel.app`)
      - Copy the Client ID
   
   e. Create `.env` file:
      ```bash
      cp .env.example .env
      ```
   
   f. Add your Client ID to `.env`:
      ```
      VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
      ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173`
   - Connect your Google account
   - Start tracking expenses!

## 📖 Usage

### First Time Setup

1. **Connect Google Account**
   - Click "Connect Google Account" in Settings
   - Grant permissions for Google Sheets access
   - A new sheet "TracPro_Expenses" will be created automatically

2. **Configure Categories**
   - Go to Settings > Manage Categories
   - Add/remove expense types (e.g., Groceries, Transport)
   - Add/remove payment types (e.g., UPI, Cash)
   - Add/remove users (e.g., your name and spouse's name)

3. **Add Your First Expense**
   - Fill in the date, amount, expense type, payment type, and who paid
   - Optionally add remarks
   - Click "Add Expense"

### Daily Use

- **Add Expense**: Fill the form on the home screen and submit
- **View Recent**: Scroll down to see your last 10 expenses
- **Manage Categories**: Settings > Manage Categories
- **Toggle Theme**: Settings > Appearance > Dark Mode

## 🏗️ Project Structure

```
TracPro/
├── public/
│   ├── icon-192.png          # PWA icon (192x192)
│   └── icon-512.png          # PWA icon (512x512)
├── src/
│   ├── components/
│   │   ├── ExpenseForm.jsx
│   │   ├── RecentExpenses.jsx
│   │   ├── CategoryManager.jsx
│   │   ├── SettingsScreen.jsx
│   │   └── Navigation.jsx
│   ├── services/
│   │   ├── auth.js           # Google OAuth
│   │   ├── googleSheets.js   # Sheets API
│   │   └── storage.js        # LocalStorage
│   ├── utils/
│   │   ├── constants.js
│   │   ├── dateUtils.js
│   │   └── validators.js
│   ├── context/
│   │   └── AppContext.jsx    # Global state
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/tracpro.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your TracPro repository
   - Add environment variable:
     - Name: `VITE_GOOGLE_CLIENT_ID`
     - Value: Your Google Client ID
   - Click "Deploy"

3. **Update Google OAuth**
   - Add your Vercel URL to authorized redirect URIs in Google Cloud Console
   - Example: `https://tracpro.vercel.app`

4. **Install on Mobile**
   - **iOS**: Open in Safari > Share > Add to Home Screen
   - **Android**: Open in Chrome > Menu > Add to Home Screen

## 📊 Google Sheets Structure

### Monthly Sheets (e.g., "November 2025")
| Date | Amount | Expense Type | Payment Type | Paid By | Remarks | Timestamp |
|------|--------|--------------|--------------|---------|---------|-----------|
| 23-11-2025 | 850 | Groceries | UPI | Karthik | Weekly shopping | 23-11-2025 14:30:00 |

### Configuration Sheet (_config)
- Row 1: Expense Types (comma-separated)
- Row 2: Payment Types (comma-separated)
- Row 3: Users (comma-separated)
- Row 4: Last Updated timestamp

## 🎨 Design Philosophy

- **Minimalist**: Clean, uncluttered interface
- **Modern**: Gradient colors, smooth animations, glassmorphism effects
- **Mobile-First**: Optimized for touch interactions
- **Accessible**: High contrast, clear labels, keyboard navigation

## 🔒 Security & Privacy

- OAuth 2.0 for secure authentication
- HTTPS only (enforced by Vercel)
- No server-side storage - all data in your Google Sheet
- No third-party analytics or tracking
- You own and control all your data

## 💡 Tips

- **Backup**: Periodically download your Google Sheet as Excel backup
- **Sharing**: Share the Google Sheet with your spouse for collaborative tracking
- **Categories**: Keep expense types specific but not too granular
- **Offline**: The app caches data for offline viewing

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context API
- **Data Storage**: Google Sheets API v4
- **Authentication**: Google OAuth 2.0
- **Hosting**: Vercel (Free Tier)
- **PWA**: Vite PWA Plugin

## 📝 License

This project is for personal use. Feel free to fork and customize for your needs.

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome! Feel free to open an issue or submit a pull request.

## 📧 Support

For issues or questions, please open a GitHub issue.

---

**Made with ❤️ for personal expense tracking**

**Version**: 1.0.0  
**Cost**: ₹0 (Free Forever)
