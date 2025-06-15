export async function fetchCharacterManifest() {
    const res = await fetch("/character_manifest.json");
    return res.json();
  }
  
  export function getCharacterImageUrl(manifest, charId, expression) {
    return (
      manifest?.[charId]?.expressions?.[expression] ??
      "/char/default.png" // fallback image
    );
  }
  