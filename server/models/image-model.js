
const connectdb = require('../utils/connectdb ');
const fs = require('fs').promises;
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

class ImageModel {
  constructor() {
    this.tableName = 'images';
  }

  async insertImage(filePath, description) {
    const imageBuffer = await fs.readFile(filePath);
    const encodedImage = imageBuffer.toString('base64');

    const { data, error } = await supabase
      .from(this.tableName)
      .insert({ image_data: encodedImage, description })
      .select();

    if (error) throw error;
    return data;
  }

  async getImage(imageId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', imageId)
      .single();

    if (error) throw error;
    return data;
  }

  async listImages() {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('id, description');

    if (error) throw error;
    return data;
  }
}

module.exports = ImageModel;
