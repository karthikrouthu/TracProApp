# TracPro Multi-Device Sync - User Guide

## 🔄 How Multi-Device Sync Works

TracPro now supports **automatic synchronization across all your devices** using your Google account! Your expense types, payment types, users, and sheet configuration are saved to your Google Sheet and automatically loaded on any device where you sign in.

---

## ✨ Features

### 1. **Google Account-Based Sync**
- Sign in with your Google account on any device
- Your settings automatically sync across all devices
- Each Google account has its own personalized settings

### 2. **What Gets Synced**
- ✅ Expense Types (Groceries, Transport, etc.)
- ✅ Payment Types (Cash, UPI, Credit Card, etc.)
- ✅ Users (names of people who make payments)
- ✅ Google Sheet ID (your connected sheet)

### 3. **Where Data is Stored**
All your settings are stored in the `_config` sheet of your Google Sheet:
- **Rows 1-4**: Default configuration (shared)
- **Row 5+**: User-specific configurations (one row per Google account)

---

## 📱 How to Use on Multiple Devices

### First Device Setup

1. **Sign in with Google**
   - Open TracPro
   - Go to Settings
   - Click "Connect Google Account"
   - Grant permissions

2. **Connect Your Sheet**
   - Either create a new sheet OR
   - Paste your existing sheet ID/URL

3. **Configure Categories**
   - Go to "Manage Categories"
   - Add your expense types, payment types, and users
   - Click "Save Changes"
   - ✅ Your settings are now saved to the cloud!

### Additional Devices

1. **Sign in with the Same Google Account**
   - Open TracPro on your new device
   - Go to Settings
   - Click "Connect Google Account"
   - Sign in with the **same Google account**

2. **Connect the Same Sheet**
   - Paste the same Google Sheet ID/URL
   - Click "Connect"

3. **Settings Auto-Load!**
   - Your expense types, payment types, and users automatically load
   - No need to reconfigure anything!
   - Start adding expenses immediately

---

## 🔍 How It Works Technically

### Data Structure in `_config` Sheet

| Column A | Column B | Column C | Column D | Column E |
|----------|----------|----------|----------|----------|
| Email | Sheet ID | Expense Types (JSON) | Payment Types (JSON) | Users (JSON) |
| your@email.com | 1LA8sb... | ["Groceries","Transport",...] | ["Cash","UPI",...] | ["User 1","User 2"] |

### Sync Process

1. **When you save categories**:
   - App gets your Google email
   - Saves your settings to row 5+ in `_config` sheet
   - Settings are linked to your email address

2. **When you sign in on a new device**:
   - App gets your Google email
   - Searches for your email in `_config` sheet
   - Loads your personalized settings
   - Updates the app with your categories

---

## 🌟 Benefits

### 1. **Seamless Experience**
- Configure once, use everywhere
- No manual export/import needed
- Automatic synchronization

### 2. **Multi-User Support**
- Different Google accounts = different settings
- Perfect for shared devices
- Each user has their own preferences

### 3. **Always Up-to-Date**
- Changes sync immediately
- All devices stay in sync
- No conflicts or overwrites

---

## 💡 Tips & Best Practices

### Tip 1: Use the Same Google Account
Make sure you sign in with the **exact same Google account** on all devices for settings to sync.

### Tip 2: Use the Same Sheet
Connect to the **same Google Sheet ID** on all devices. You can find your sheet ID in Settings.

### Tip 3: Save After Changes
Always click "Save Changes" in Category Manager to sync your updates across devices.

### Tip 4: Check "Logged in as"
In Settings, verify you're logged in as the correct Google account. Your email will be displayed.

---

## 🔒 Privacy & Security

- ✅ Your data is stored in **your own Google Sheet**
- ✅ Only you have access (unless you share the sheet)
- ✅ No third-party servers involved
- ✅ Google OAuth 2.0 for secure authentication
- ✅ Each user's settings are isolated by email

---

## 🛠️ Troubleshooting

### Settings Not Syncing?

**Check:**
1. Are you signed in with the same Google account on both devices?
2. Are you connected to the same Google Sheet?
3. Did you click "Save Changes" after modifying categories?

**Solution:**
- Sign out and sign back in
- Reconnect to the same sheet
- Refresh the page

### Different Settings on Different Devices?

**Cause:** You're signed in with different Google accounts

**Solution:**
- Check "Logged in as" in Settings
- Sign out and sign in with the correct account

### Can't See My Email in Settings?

**Cause:** User profile hasn't loaded yet

**Solution:**
- Refresh the page
- Sign out and sign back in
- Check browser console for errors

---

## 📊 Example Scenario

### Scenario: Using TracPro on Phone and Laptop

**On Phone (First Time):**
1. Sign in: `john@gmail.com`
2. Create sheet: "John's Expenses"
3. Add categories: Groceries, Transport, Bills
4. Add users: John, Sarah
5. Save changes ✅

**On Laptop (Later):**
1. Sign in: `john@gmail.com` (same account!)
2. Connect sheet: Paste the same sheet ID
3. Categories auto-load: Groceries, Transport, Bills ✅
4. Users auto-load: John, Sarah ✅
5. Start tracking expenses immediately!

**On Phone (Next Day):**
1. Add new category: "Healthcare"
2. Save changes ✅

**On Laptop (Automatically):**
1. Refresh or reopen app
2. "Healthcare" appears automatically! ✅

---

## 🎯 Summary

TracPro's multi-device sync makes expense tracking effortless across all your devices:

- **One Google Account** = Consistent settings everywhere
- **One Google Sheet** = All your data in one place
- **Automatic Sync** = No manual work required

Just sign in, connect your sheet, and start tracking! 🚀

---

**Questions?** Check the main README.md or open an issue on GitHub.
