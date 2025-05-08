// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  const mockCb = jest.fn();
  const mockTimeOut = 100;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(mockCb, mockTimeOut);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(mockCb, mockTimeOut);
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(mockCb, mockTimeOut);

    expect(mockCb).not.toHaveBeenCalled();
    jest.advanceTimersByTime(mockTimeOut);
    expect(mockCb).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockCb = jest.fn();
    const mockInterval = 100;

    jest.spyOn(global, 'setInterval');

    doStuffByInterval(mockCb, mockInterval);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(mockCb, mockInterval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const mockCb = jest.fn();
    const mockInterval = 100;

    doStuffByInterval(mockCb, mockInterval);

    expect(mockCb).not.toHaveBeenCalled();
    jest.advanceTimersByTime(mockInterval);
    expect(mockCb).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(mockInterval);
    expect(mockCb).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(mockInterval);
    expect(mockCb).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = './file.txt';
  const content = 'This is content!';

  test('should call join with pathToFile', async () => {
    await readFileAsynchronously(pathToFile);
    expect(join).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    await expect(readFileAsynchronously(pathToFile)).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockReturnValue(Buffer.from(content));

    await expect(readFileAsynchronously(pathToFile)).resolves.toBe(content);
  });
});
