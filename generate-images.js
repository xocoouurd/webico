const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = 'AIzaSyAGLE8ExmgNRJepuMp870K18aN4pYfBqG4';

async function generateImage(prompt, filename) {
  console.log(`\nGenerating: ${filename}`);
  console.log(`Prompt: ${prompt}\n`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"]
        }
      })
    }
  );

  const data = await response.json();

  if (data.error) {
    console.error(`Error: ${data.error.message}`);
    return null;
  }

  // Extract image data from response
  if (data.candidates && data.candidates[0]?.content?.parts) {
    for (const part of data.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        const ext = mimeType.split('/')[1] || 'png';
        const outputPath = path.join(__dirname, 'assets', `${filename}.${ext}`);

        // Ensure assets directory exists
        fs.mkdirSync(path.join(__dirname, 'assets'), { recursive: true });

        // Save the image
        fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
        console.log(`✓ Saved: ${outputPath}`);
        return outputPath;
      }
    }
  }

  console.log('No image data in response:', JSON.stringify(data, null, 2));
  return null;
}

async function main() {
  console.log('=== Webico Image Generator ===\n');

  // Logo
  await generateImage(
    "Create a minimal, modern logo for 'Webico' - a web development agency. The logo should be clean and simple, using a blue color (#2563eb). Design should work well on white backgrounds. No text, just an iconic symbol that suggests web/digital/connectivity. Flat design, no gradients or 3D effects.",
    'logo'
  );

  // Hero illustration
  await generateImage(
    "Create a modern, clean illustration for a web development agency hero section. Show abstract geometric shapes suggesting technology, connectivity, and growth. Use blue (#2563eb) as primary color with white and light gray. Minimal, spacious design with lots of white space. No people, no text. Flat design style, suitable for a professional business website.",
    'hero-illustration'
  );

  // Alternative hero - devices mockup
  await generateImage(
    "Create a clean, minimal illustration of a laptop and smartphone showing abstract website layouts. Blue (#2563eb) accent color on white background. Flat design, no shadows, modern and professional. No text or real content on screens, just abstract UI elements.",
    'hero-devices'
  );

  console.log('\n=== Done ===');
}

main().catch(console.error);
