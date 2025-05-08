// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  const startBalance = 100;
  const acc = getBankAccount(startBalance);
  const acc2 = getBankAccount(startBalance);

  test('should create account with initial balance', () => {
    expect(acc.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => acc.withdraw(200)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => acc.transfer(200, acc2)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => acc.transfer(99, acc)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    acc.deposit(100);
    expect(acc.getBalance()).toBe(200);
  });

  test('should withdraw money', () => {
    acc.withdraw(100);
    expect(acc.getBalance()).toBe(100);
  });

  test('should transfer money', () => {
    acc.transfer(100, acc2);
    expect(acc.getBalance()).toBe(0);
    expect(acc2.getBalance()).toBe(200);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const req = await acc.fetchBalance();
    if (req !== null) {
      expect(req).toEqual(expect.any(Number));
    } else {
      expect(req).toBeNull();
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(acc, 'fetchBalance').mockResolvedValue(150);
    await acc.synchronizeBalance();
    expect(acc.getBalance()).toBe(150);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(acc, 'fetchBalance').mockResolvedValue(null);
    await expect(acc.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
