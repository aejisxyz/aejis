# Telegram Account Linking API Documentation

## Overview
This document describes the backend API endpoints needed to implement Telegram account linking for the Aejis platform.

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,  -- Firebase UID
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    telegram_id BIGINT UNIQUE,  -- Telegram user ID
    telegram_username VARCHAR(255),  -- @username
    telegram_first_name VARCHAR(255),
    telegram_last_name VARCHAR(255),
    account_tier VARCHAR(50) DEFAULT 'free',  -- 'free', 'premium', etc.
    scans_today INT DEFAULT 0,
    last_scan_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    telegram_linked_at TIMESTAMP
);
```

### Link Tokens Table
```sql
CREATE TABLE link_tokens (
    token VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## API Endpoints

### 1. Generate Link Token
**POST** `/api/generate-link-token`

Generate a unique token for linking Telegram account.

#### Request Body:
```json
{
  "userId": "firebase_uid_here"
}
```

#### Response:
```json
{
  "success": true,
  "token": "abc123def456ghi789",
  "expiresAt": "2025-10-14T12:00:00Z",
  "deepLink": "https://t.me/Aejis_Bot?start=link_abc123def456ghi789"
}
```

#### Implementation Notes:
- Token should be unique and random (minimum 32 characters)
- Set expiration time (recommended: 10 minutes)
- Store token in database with user_id
- Return Telegram deep link

---

### 2. Verify and Link Telegram Account
**POST** `/api/link-telegram`

Called by Telegram bot when user sends the link token.

#### Request Body:
```json
{
  "token": "abc123def456ghi789",
  "telegramId": 123456789,
  "telegramUsername": "johndoe",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Response:
```json
{
  "success": true,
  "message": "Telegram account linked successfully",
  "user": {
    "id": "firebase_uid_here",
    "email": "user@example.com",
    "telegramUsername": "johndoe"
  }
}
```

#### Implementation Notes:
- Verify token exists and not expired
- Check if token hasn't been used
- Verify Telegram ID not already linked to another account
- Update user record with Telegram info
- Mark token as used
- Return success with user details

#### Error Responses:
```json
// Token expired
{
  "success": false,
  "error": "TOKEN_EXPIRED",
  "message": "Link token has expired. Please generate a new one."
}

// Token already used
{
  "success": false,
  "error": "TOKEN_USED",
  "message": "This token has already been used."
}

// Telegram already linked
{
  "success": false,
  "error": "TELEGRAM_ALREADY_LINKED",
  "message": "This Telegram account is already linked to another Aejis account."
}
```

---

### 3. Check Telegram Link Status
**GET** `/api/check-telegram-link/:userId`

Check if user's Telegram account is linked.

#### Response:
```json
{
  "success": true,
  "linked": true,
  "telegram": {
    "id": 123456789,
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "linkedAt": "2025-10-14T10:00:00Z"
  }
}
```

#### If Not Linked:
```json
{
  "success": true,
  "linked": false
}
```

---

### 4. Unlink Telegram Account
**POST** `/api/unlink-telegram`

Remove Telegram account link from user.

#### Request Body:
```json
{
  "userId": "firebase_uid_here"
}
```

#### Response:
```json
{
  "success": true,
  "message": "Telegram account unlinked successfully"
}
```

---

### 5. Get User by Telegram ID
**GET** `/api/user/telegram/:telegramId`

Get user information by Telegram ID (used by bot).

#### Response:
```json
{
  "success": true,
  "user": {
    "id": "firebase_uid_here",
    "email": "user@example.com",
    "displayName": "John Doe",
    "accountTier": "free",
    "scansToday": 3,
    "maxScansPerDay": 10
  }
}
```

#### If Not Found:
```json
{
  "success": false,
  "error": "USER_NOT_FOUND",
  "message": "No Aejis account linked to this Telegram ID. Please visit https://aejis.com/dashboard to link your account."
}
```

---

## Telegram Bot Integration

### Bot Commands

#### `/start`
Handle regular start command.

#### `/start link_<token>`
Handle account linking:
1. Extract token from command
2. Get Telegram user info (ID, username, name)
3. Call `/api/link-telegram` endpoint
4. Send success/error message to user

### Example Bot Code (Python)
```python
from telegram import Update
from telegram.ext import ContextTypes
import requests

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    args = context.args
    
    if args and args[0].startswith('link_'):
        token = args[0].replace('link_', '')
        telegram_id = update.effective_user.id
        telegram_username = update.effective_user.username
        first_name = update.effective_user.first_name
        last_name = update.effective_user.last_name
        
        # Call your API
        response = requests.post('YOUR_API_URL/api/link-telegram', json={
            'token': token,
            'telegramId': telegram_id,
            'telegramUsername': telegram_username,
            'firstName': first_name,
            'lastName': last_name
        })
        
        data = response.json()
        
        if data['success']:
            await update.message.reply_text(
                "✅ Your Telegram account has been successfully linked to your Aejis account!\n\n"
                "You can now use me to scan files and URLs."
            )
        else:
            await update.message.reply_text(
                f"❌ Failed to link account: {data['message']}\n\n"
                "Please try generating a new link from your dashboard."
            )
    else:
        await update.message.reply_text(
            "Welcome to Aejis Security Bot!\n\n"
            "To use this bot, please link your Telegram account from:\n"
            "https://aejis.com/dashboard"
        )
```

---

## Security Considerations

1. **Token Security**
   - Use cryptographically secure random tokens
   - Set short expiration time (5-10 minutes)
   - One-time use only
   - Store hashed if possible

2. **Rate Limiting**
   - Limit token generation requests (e.g., 5 per hour per user)
   - Prevent brute force token guessing

3. **Validation**
   - Validate all input data
   - Verify Firebase authentication tokens
   - Check user permissions

4. **HTTPS Only**
   - All API endpoints must use HTTPS
   - Secure webhook for Telegram bot

---

## Usage Limits by Tier

### Free Tier
- 10 scans per day
- Basic malware detection
- File size limit: 50MB

### Premium Tier
- Unlimited scans
- Advanced analysis
- File size limit: 500MB
- Priority support

### Implementation in Bot:
```python
async def check_scan_limit(telegram_id):
    response = requests.get(f'YOUR_API_URL/api/user/telegram/{telegram_id}')
    data = response.json()
    
    if not data['success']:
        return False, "Please link your Aejis account first."
    
    user = data['user']
    
    if user['accountTier'] == 'free':
        if user['scansToday'] >= 10:
            return False, "Daily scan limit reached. Upgrade to premium for unlimited scans!"
    
    return True, None
```

---

## Frontend Integration

The frontend implementation is already complete in:
- `src/pages/Dashboard.jsx` - UI and linking logic
- `src/pages/Dashboard.css` - Styling

### To Connect Backend:

1. Replace commented API calls in Dashboard.jsx:
```javascript
// In handleLinkTelegram():
const response = await axios.post('/api/generate-link-token', {
  userId: currentUser.uid
});
setLinkToken(response.data.token);

// In useEffect():
const response = await axios.get(`/api/check-telegram-link/${currentUser.uid}`);
if (response.data.linked) {
  setTelegramLinked(true);
  setTelegramUsername(response.data.telegram.username);
}

// In handleUnlinkTelegram():
await axios.post('/api/unlink-telegram', {
  userId: currentUser.uid
});
```

2. Configure axios base URL in your app

---

## Testing Checklist

- [ ] Generate link token
- [ ] Token expires after 10 minutes
- [ ] Link Telegram account via bot
- [ ] Check link status in dashboard
- [ ] Unlink account
- [ ] Try to use already-used token
- [ ] Try to link already-linked Telegram account
- [ ] Test scan limits for free tier
- [ ] Test bot refuses unlinked users

---

## Support

For questions or issues, contact your development team or refer to:
- Telegram Bot API: https://core.telegram.org/bots/api
- Firebase Auth: https://firebase.google.com/docs/auth

