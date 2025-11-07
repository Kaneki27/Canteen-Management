# Firebase Setup Guide for ServeSmart

## Quick Setup (Optional - for full functionality)

Currently, the app works perfectly without Firebase, but if you want to enable:
- ✅ Persistent order storage
- ✅ Real-time admin dashboard
- ✅ Live menu management
- ✅ Image uploads

Follow these steps:

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `servesmart-canteen`
4. Enable Google Analytics (optional)
5. Create project

## 2. Enable Firestore Database

1. In your Firebase project, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to you)
5. Click **Done**

## 3. Enable Storage

1. Go to **Storage** in your Firebase project
2. Click **Get started**
3. Choose **Start in test mode**
4. Select same location as Firestore
5. Click **Done**

## 4. Get Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web app** icon (`</>`)
4. Register app name: `ServeSmart Web`
5. Copy the configuration object

## 5. Update Environment Variables

Add these to your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 6. Set Firestore Security Rules

In Firebase Console → Firestore → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents (for development)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 7. Set Storage Security Rules

In Firebase Console → Storage → Rules, replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## 8. Restart Development Server

```bash
npm run dev
```

## What This Enables

- **Admin Dashboard**: Real-time order tracking
- **Menu Management**: Add/edit/delete menu items
- **Image Uploads**: Upload food images
- **Order Persistence**: Orders saved permanently
- **Real-time Updates**: Live synchronization

## Current Status

Without Firebase (current):
- ✅ Payment processing works
- ✅ Order ID generation works
- ✅ Mock menu data
- ❌ Orders not saved permanently
- ❌ Admin can't see real orders
- ❌ No image uploads

With Firebase (after setup):
- ✅ All of the above, PLUS:
- ✅ Persistent order storage
- ✅ Real-time admin dashboard
- ✅ Live menu management
- ✅ Image uploads for menu items
- ✅ Multi-user synchronization

## Troubleshooting

If you see Firebase errors after setup:
1. Check environment variables are correct
2. Verify Firestore/Storage rules allow read/write
3. Ensure project ID matches exactly
4. Restart development server

The app will work in both modes - with or without Firebase!
