import { RedisConnect } from './connect/connection';

export const initializeRedis = async (): Promise<void> => {
  try {
    await RedisConnect.getClient();
    
    const client = await RedisConnect.getClient();
    await client.ping();
    console.log('Redis initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    throw error;
  }
};

export const getRedisClient = async () => {
  return await RedisConnect.getClient();
};

export const shutdownRedis = async () => {
  try {
    await RedisConnect.disconnectRedis();
    console.log('Redis shutdown successfully');
  } catch (error) {
    console.error('Failed to shutdown Redis:', error);
    throw error;
  }
};