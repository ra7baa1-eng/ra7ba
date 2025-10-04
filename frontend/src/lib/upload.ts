export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_IMGBB_KEY environment variable');
  }

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data?.data?.url) {
    throw new Error(data?.error?.message || 'Image upload failed');
  }

  return data.data.url as string;
}
