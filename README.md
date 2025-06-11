# Non-Custodial Browser SDK Demo App

This demo application allows you to test the **Non-Custodial Browser SDK** functionality in a comprehensive web interface. It provides testing for SDK initialization, session management, and payout signing capabilities.

## 📦 What You Need

This demo uses the published Non-Custodial SDK package:
- ✅ `@muralpay/browser-sdk` - The Non-Custodial Browser SDK from npm
- ✅ This demo application

## ✅ Demo Features

- ✅ **Real Non-Custodial Browser SDK integration** 
- ✅ **Interactive browser testing interface**
- ✅ **Complete SDK functionality testing**
- ✅ **Session management capabilities**
- ✅ **Payout signing functionality**

## 🚀 Setup Instructions

### Prerequisites
- **Node.js v16+** and **npm** installed on your system

### Quick Setup

1. **Navigate to the demo directory**:
   ```bash
   cd /path/to/demo-directory
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the demo**:
   ```bash
   npm run build
   ```

4. **Start the demo**:
   ```bash
   npm run dev
   ```

🎉 **The demo will be available at: http://localhost:5174**

## 🎯 Testing the SDK

The demo provides a complete testing interface with these capabilities:

### 🚀 Basic SDK Operations
- **Initialize SDK**: Creates and initializes the Non-Custodial Browser SDK with authentication iframe
- **Get Public Key**: Retrieves the public key needed for email authentication flow
- **Get Status**: Shows comprehensive SDK status including session information

### 🔐 Session Management
- **Start Session**: Authenticate using email verification code and authenticator ID
- **Check Session**: Verify if session is active and check expiration status
- **Clear Session**: End the current authenticated session

### ✍️ Payout Signing
- **Sign Payout**: Sign payout payloads using the authenticated session
- **JSON Payload Support**: Test with real payout data structures

## 🌐 How to Use the Demo

1. **Open your browser** to http://localhost:5174
2. **Initialize SDK** - Click to set up the authentication iframe and SDK instance
3. **Get Public Key** - Copy this key for use in the email authentication flow
4. **Start Session** - Enter the authentication code and authenticator ID from your email
5. **Test Signing** - Use the interface to sign payout payloads with your authenticated session

## 📁 Project Structure

```
demo-app/
├── src/
│   └── index.ts          # SDK wrapper implementation
├── test/
│   ├── index.html        # Browser demo interface
│   └── manual-test.ts    # Node.js compatible tests
├── dist/                 # Built demo files (generated)
├── package.json          # Demo dependencies
├── vite.config.ts        # Build configuration
└── README.md            # This file
```

## 🛠 Available Commands

- `npm run dev` - Start the development server for browser testing
- `npm run build` - Build the demo project
- `npm run clean` - Clean the dist folder
- `npm run test:manual` - Run Node.js compatible tests
- `npm run preview` - Preview the built project

## 🔧 Technical Details

### SDK Integration
The demo integrates the Non-Custodial Browser SDK from npm:

```json
{
  "dependencies": {
    "@muralpay/browser-sdk": "^1.0.0"
  }
}
```

### Build Configuration
- Uses Vite for fast development and building
- Serves the demo from the `test/` directory
- Handles ES modules and TypeScript
- Runs on port 5174
- Includes proper SDK optimization

### Tested SDK Features
- ✅ SDK initialization with authentication iframe integration
- ✅ Public key retrieval for email authentication
- ✅ Session management (start/check/clear)
- ✅ Session expiry tracking and validation
- ✅ Payout payload signing with authenticated sessions
- ✅ Real-time logging and status updates
- ✅ Browser-based ES module imports
- ✅ TypeScript support and type safety

## 🐛 Troubleshooting

### SDK Installation Issues
- **Problem**: SDK installation fails
- **Solutions**: 
  - Ensure Node.js v16+ and npm are installed
  - Check that `npm install` completed successfully
  - Verify network access to npmjs.com

### Demo Integration Issues
- **Problem**: Demo can't find the SDK
- **Solutions**:
  - Verify the SDK is installed: `npm list @muralpay/browser-sdk`
  - Try reinstalling: `npm uninstall @muralpay/browser-sdk && npm install @muralpay/browser-sdk`
  - Check package.json has the correct dependency

### Runtime Issues
- **Problem**: SDK not initializing in browser
- **Solutions**:
  - Check browser console for error messages
  - Ensure the iframe container is created properly
  - Verify authentication iframe URL is accessible

- **Problem**: Session not starting
- **Solutions**:
  - Verify authentication code and authenticator ID are correct
  - Ensure the public key was used in the email authentication flow
  - Check that the session hasn't expired

- **Problem**: Payout signing fails
- **Solutions**:
  - Verify an active session exists
  - Check the payout payload format matches expected structure
  - Ensure all required fields are present in the payload

### Development Server Issues
- **Problem**: Server won't start or demo won't load
- **Solutions**:
  - Ensure you've run `npm run build` first
  - Check that port 5174 is available
  - Look for import errors in the browser console
  - Try `npm run clean && npm run build && npm run dev`
