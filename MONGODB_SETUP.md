# MongoDB Atlas Setup for Visual Canvas Presets

## ✅ What's Been Set Up

1. **MongoDB Driver**: Installed and configured
2. **API Routes**: Created for CRUD operations on presets
3. **TypeScript Types**: Defined for preset data structure
4. **Service Layer**: Created for database operations
5. **Client Utilities**: Created for frontend API calls
6. **Preset Manager Component**: Created for UI management

## 🔧 Final Setup Steps

### 1. Create Environment File
Create a `.env.local` file in your project root with:

```env
MONGODB_URI=mongodb+srv://brookdownton:prADzqCkoYcSDV1t@ralphcanvascluster1.tvq1xny.mongodb.net/visual-canvas?retryWrites=true&w=majority&appName=RalphCanvasCluster1
```

### 2. Add Preset Manager to Your UI
Add the PresetManager component to your main dashboard or wherever you want to manage presets:

```tsx
import { PresetManager } from '@/components/PresetManager';

// In your component:
<PresetManager />
```

### 3. Test the Integration
1. Start your development server
2. Navigate to your app
3. Try saving a preset with the "Save Current" button
4. Try loading a preset with the "Load" button

## 🚀 Features Available

- **Save Current State**: Save your current visual configuration as a preset
- **Load Presets**: Load any saved preset to restore that configuration
- **Delete Presets**: Remove presets you no longer need
- **Search & Filter**: Find presets by name, description, or tags
- **Categories**: Organize presets by category
- **Public/Private**: Mark presets as public or private

## 📊 Database Structure

The presets are stored in MongoDB Atlas with the following structure:

```json
{
  "_id": "ObjectId",
  "name": "Preset Name",
  "description": "Optional description",
  "category": "default",
  "tags": ["tag1", "tag2"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "data": {
    "camera": { /* camera settings */ },
    "particles": { /* particle settings */ },
    "geometric": { /* geometric shape settings */ },
    "globalEffects": { /* global effects settings */ },
    "backgroundConfig": { /* background configuration */ },
    "effects": { /* post-processing effects */ },
    "background": { /* background settings */ },
    "ui": { /* UI state */ },
    "globalAnimationSpeed": 1.0
  },
  "isPublic": false,
  "createdBy": "user",
  "version": "1.0.0"
}
```

## 🔒 Security Notes

- The current setup uses a simple user identification ("user")
- For production, you should implement proper user authentication
- Consider adding rate limiting for API endpoints
- The MongoDB connection string should be kept secure

## 🐛 Troubleshooting

If you encounter issues:

1. **Connection Errors**: Check your MongoDB Atlas network access settings
2. **Authentication Errors**: Verify your username and password in the connection string
3. **CORS Errors**: Make sure your API routes are properly configured
4. **Type Errors**: Ensure all TypeScript types are properly imported

## 🎯 Next Steps

1. Test the basic save/load functionality
2. Add the PresetManager to your UI
3. Consider adding preset categories and tags
4. Implement user authentication for production use
5. Add preset sharing features if needed 