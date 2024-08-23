const { createCanvas, loadImage } = require('canvas');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { imageBase64 } = req.body;

      // Decode the base64 image
      const imageBuffer = Buffer.from(imageBase64, 'base64');

      // Load the image
      const image = await loadImage(imageBuffer);

      // Create a canvas and set the same dimensions as the image
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');

      // Draw the original image onto the canvas
      ctx.drawImage(image, 0, 0);

      // Set the overlay color and opacity
      ctx.fillStyle = 'rgba(128, 0, 128, 0.5)'; // Purple with 50% opacity
      ctx.fillRect(0, 0, image.width, image.height);

      // Get the modified image as base64
      const modifiedImageBase64 = canvas.toDataURL('image/png').split(',')[1];

      // Send the modified image back to the client
      res.status(200).json({ imageBase64: modifiedImageBase64 });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: 'Failed to process image' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
