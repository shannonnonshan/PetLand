import mongoose from 'mongoose';

class MongoConnection {
  constructor() {
    if (!MongoConnection.instance) {
      MongoConnection.instance = this;
      this._connect();
    }
    return MongoConnection.instance;
  }

  async _connect() {
    if (this.connection) return this.connection;

    try {
      this.connection = await mongoose.connect(
        'mongodb+srv://donnade:thanhvyneh@petland.lruap6s.mongodb.net/petland?retryWrites=true&w=majority&appName=Petland',
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      );
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
    }

    return this.connection;
  }
}

new MongoConnection();

export { mongoose };
