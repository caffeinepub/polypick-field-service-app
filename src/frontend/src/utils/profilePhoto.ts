const KEY_PREFIX = "profile_photo_";

/**
 * Compress an image file to max 200x200px and return as a base64 data URL.
 */
export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 200;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) {
            height = Math.round((height * MAX) / width);
            width = MAX;
          } else {
            width = Math.round((width * MAX) / height);
            height = MAX;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Save a base64 profile photo in localStorage keyed by principal ID. */
export function saveProfilePhoto(principalId: string, base64: string): void {
  if (!principalId) return;
  try {
    localStorage.setItem(`${KEY_PREFIX}${principalId}`, base64);
  } catch {
    // localStorage quota may be exceeded — fail silently
  }
}

/** Retrieve the base64 profile photo for a given principal ID, or null if not set. */
export function getProfilePhoto(principalId: string): string | null {
  if (!principalId) return null;
  return localStorage.getItem(`${KEY_PREFIX}${principalId}`);
}
