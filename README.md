# Ralph Visual Canvas

An interactive 3D visual canvas built with Next.js, React Three Fiber, and Zustand. Create and customize stunning visual compositions with geometric shapes, particles, and post-processing effects.

## Features

- 🎨 Interactive 3D canvas with real-time updates
- 🌟 Multiple geometric shapes (spheres, cubes, toruses)
- ✨ Dynamic particle system
- 🎭 Customizable background and effects
- 💾 Save and load visual presets
- 📱 Responsive design with proper viewport handling
- 🚀 Built with modern web technologies

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - React renderer for Three.js
- [@react-three/drei](https://github.com/pmndrs/drei) - Useful helpers for React Three Fiber
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/br00kd0wnt0n/ralph-visual-canvas.git
   cd ralph-visual-canvas
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

This project uses environment variables for API keys and database configuration. Create a `.env.local` file in the root directory with the following variables:

### Required Variables

- `MONGODB_URI` - MongoDB connection string for preset storage
- `OPENAI_API_KEY` - OpenAI API key for AI analysis features (starts with `sk-`)
- `OPENWEATHER_API_KEY` - OpenWeather API key for weather-based visual effects

### Development vs Production

- **Development**: API keys can be stored in localStorage for convenience
- **Production**: API keys must be set as environment variables in Railway

### Example `.env.local`

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENWEATHER_API_KEY=your-openweather-api-key-here
```

### Railway Deployment

For production deployment on Railway, add these environment variables in your Railway project settings:

1. Go to your Railway project dashboard
2. Navigate to the "Variables" tab
3. Add each environment variable with its corresponding value
4. Redeploy your application

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

This project is configured for deployment on [Railway.app](https://railway.app/). The deployment process is automated through GitHub integration.

## License

MIT License - feel free to use this project for your own purposes.

## Author

[br00kd0wnt0n](https://github.com/br00kd0wnt0n)

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run clean-restart` - Kill processes, clear cache, and restart
- `npm run check-styling` - Validate Tailwind configuration
- `npm run validate-config` - Test PostCSS and Tailwind setup

### Troubleshooting

#### Styling Not Updating

If Tailwind styles aren't applying:

1. **Check PostCSS config**: Ensure `postcss.config.js` uses CommonJS format:
   ```js
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

2. **Verify Tailwind directives**: Check `src/app/globals.css` has:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. **Clear cache and restart**:
   ```bash
   npm run clean-restart
   ```

4. **Check browser cache**: Hard refresh (`Cmd+Shift+R` on Mac, `Ctrl+Shift+R` on Windows)

#### Port Conflicts

If you see `EADDRINUSE: address already in use :::3000`:

```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

#### Configuration Validation

Run validation before starting development:

```bash
npm run check-styling
```

## 🏗️ Architecture

- **Frontend**: Next.js 14 with React Three Fiber
- **Styling**: Tailwind CSS with PostCSS
- **State Management**: Zustand
- **AI Integration**: OpenAI Vision API
- **Weather Data**: OpenWeatherMap API
- **Parameter Mapping**: Custom engine with real-time updates

## 📁 Project Structure

```
src/
├── ai-system/          # AI analysis and integration
├── components/         # React components
├── store/             # Zustand state management
├── app/               # Next.js app router
└── utils/             # Utility functions
```
