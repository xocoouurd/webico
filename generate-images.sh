#!/bin/bash

API_KEY="${GEMINI_API_KEY:-YOUR_API_KEY_HERE}"
MODEL="gemini-2.5-flash-image"
ASSETS_DIR="./assets"

mkdir -p "$ASSETS_DIR"

generate_image() {
    local prompt="$1"
    local filename="$2"

    echo ""
    echo "=== Generating: $filename ==="
    echo "Prompt: $prompt"
    echo ""

    response=$(curl --max-time 120 -s \
        "https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}" \
        -H "Content-Type: application/json" \
        -d "{\"contents\":[{\"parts\":[{\"text\":\"$prompt\"}]}],\"generationConfig\":{\"responseModalities\":[\"IMAGE\",\"TEXT\"]}}")

    # Extract base64 image data using node
    echo "$response" | node -e "
        const data = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
        if (data.candidates && data.candidates[0]?.content?.parts) {
            for (const part of data.candidates[0].content.parts) {
                if (part.inlineData) {
                    console.log(part.inlineData.data);
                    process.exit(0);
                }
            }
        }
        console.error('No image data found');
        console.error(JSON.stringify(data, null, 2));
        process.exit(1);
    " > "${ASSETS_DIR}/${filename}.b64" 2>&1

    if [ -s "${ASSETS_DIR}/${filename}.b64" ] && ! grep -q "No image data" "${ASSETS_DIR}/${filename}.b64"; then
        base64 -D -i "${ASSETS_DIR}/${filename}.b64" -o "${ASSETS_DIR}/${filename}.png"
        rm "${ASSETS_DIR}/${filename}.b64"
        echo "✓ Saved: ${ASSETS_DIR}/${filename}.png"
    else
        echo "✗ Failed to generate ${filename}"
        cat "${ASSETS_DIR}/${filename}.b64"
        rm -f "${ASSETS_DIR}/${filename}.b64"
    fi
}

echo "=== Webico Image Generator ==="

# Generate logo
generate_image "Create a minimal, modern logo icon for Webico web development agency. Clean simple design using blue color #2563eb. White background. Symbol suggesting web connectivity. Flat design, no gradients, no text." "logo"

# Generate hero illustration
generate_image "Modern clean hero illustration for web development agency. Abstract geometric shapes in blue #2563eb on white background. Suggests technology growth connectivity. Minimal spacious design. Flat style, no people no text." "hero-illustration"

# Generate devices mockup
generate_image "Clean minimal illustration of laptop and smartphone showing abstract website layouts. Blue #2563eb accents on white background. Flat design modern professional. No text on screens just abstract UI elements." "hero-devices"

echo ""
echo "=== Done ==="
