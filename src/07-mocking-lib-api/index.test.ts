// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

const mockUrl = '/mock';
const mockData = 'Mock Data';

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: mockData });
    const mockCreate = jest.fn().mockReturnValue({
      get: mockGet,
    });

    (axios.create as jest.Mock).mockImplementation(mockCreate);

    await throttledGetDataFromApi(mockUrl);

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: mockData });
    const mockCreate = jest.fn().mockReturnValue({
      get: mockGet,
    });

    (axios.create as jest.Mock).mockImplementation(mockCreate);

    await throttledGetDataFromApi(mockUrl);

    expect(mockGet).toHaveBeenCalledWith(mockUrl);
  });

  test('should return response data', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: mockData });
    const mockCreate = jest.fn().mockReturnValue({
      get: mockGet,
    });

    (axios.create as jest.Mock).mockImplementation(mockCreate);

    const result = await throttledGetDataFromApi(mockUrl);
    expect(result).toBe(mockData);
  });
});
