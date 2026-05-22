const uploadImage = async (file) => {
  const cloudName = 'dv7cus6xy';
  const uploadPreset = 'ml_default2';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error('Cloudinary error details:', data.error);
    throw new Error(data.error?.message || 'Upload failed');
  }

  return {
    url:      data.secure_url,
    publicId: data.public_id,
  };
};

export default uploadImage;