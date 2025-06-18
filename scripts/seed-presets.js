const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://brookdownton:prADzqCkoYcSDV1t@ralphcanvascluster1.tvq1xny.mongodb.net/visual-canvas?retryWrites=true&w=majority&appName=RalphCanvasCluster1';

const samplePresets = [
  {
    name: 'Sunset Glow',
    description: 'A warm sunset-inspired visual preset with orange and red tones',
    category: 'nature',
    tags: ['sunset', 'warm', 'orange', 'red'],
    data: {
      camera: {
        distance: 15,
        height: 3,
        fov: 60,
        position: [0, 3, 15],
        target: [0, 0, 0],
        rotation: { x: 0, y: 0, z: 0 },
        autoRotate: true,
        autoRotateSpeed: 0.3
      },
      visual: {
        vignette: 0.2,
        glow: 0.8,
        contrast: 1.3,
        saturation: 1.6,
        brightness: 1.2,
        bloom: true
      },
      performance: {
        targetFPS: 60,
        maxParticles: 800
      }
    },
    isPublic: true,
    createdBy: 'system',
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Ocean Waves',
    description: 'Cool blue ocean-inspired preset with calming wave effects',
    category: 'nature',
    tags: ['ocean', 'blue', 'calm', 'waves'],
    data: {
      camera: {
        distance: 20,
        height: 5,
        fov: 45,
        position: [0, 5, 20],
        target: [0, 0, 0],
        rotation: { x: 0, y: 0, z: 0 },
        autoRotate: false
      },
      visual: {
        vignette: 0.1,
        glow: 0.4,
        contrast: 1.1,
        saturation: 1.3,
        brightness: 0.9,
        bloom: true
      },
      performance: {
        targetFPS: 60,
        maxParticles: 1200
      }
    },
    isPublic: true,
    createdBy: 'system',
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Neon City',
    description: 'Cyberpunk-inspired preset with neon colors and urban vibes',
    category: 'urban',
    tags: ['neon', 'cyberpunk', 'urban', 'purple'],
    data: {
      camera: {
        distance: 12,
        height: 2,
        fov: 70,
        position: [0, 2, 12],
        target: [0, 0, 0],
        rotation: { x: 0, y: 0, z: 0 },
        autoRotate: true,
        autoRotateSpeed: 0.5
      },
      visual: {
        vignette: 0.3,
        glow: 1.0,
        contrast: 1.5,
        saturation: 1.8,
        brightness: 0.8,
        bloom: true,
        chromaticAberration: 0.1
      },
      performance: {
        targetFPS: 60,
        maxParticles: 1500
      }
    },
    isPublic: true,
    createdBy: 'system',
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedPresets() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('visual-canvas');
    const collection = db.collection('presets');
    
    // Clear existing presets (optional)
    // await collection.deleteMany({});
    
    // Insert sample presets
    const result = await collection.insertMany(samplePresets);
    console.log(`Inserted ${result.insertedCount} presets`);
    
    // List all presets
    const allPresets = await collection.find({}).toArray();
    console.log('All presets:', allPresets.map(p => ({ id: p._id, name: p.name })));
    
  } catch (error) {
    console.error('Error seeding presets:', error);
  } finally {
    await client.close();
  }
}

seedPresets(); 