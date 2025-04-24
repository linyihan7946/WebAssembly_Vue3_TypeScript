// The entry file of your WebAssembly module.

/**
 * 加法函数
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两数之和
 */
export function add(a: i32, b: i32): i32 {
  return a + b;
}

/**
 * 减法函数
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两数之差
 */
export function subtract(a: i32, b: i32): i32 {
  return a - b;
}

/**
 * 乘法函数
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两数之积
 */
export function multiply(a: i32, b: i32): i32 {
  return a * b;
}

/**
 * 除法函数
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两数之商
 */
export function divide(a: i32, b: i32): i32 {
  if (b === 0) {
    // AssemblyScript没有异常处理，返回一个特殊值表示错误
    return 0;
  }
  return a / b;
}

/**
 * 阶乘函数
 * @param n 要计算阶乘的数字
 * @returns n的阶乘
 */
export function factorial(n: i32): i32 {
  if (n <= 1) return 1;
  
  let result: i32 = 1;
  for (let i: i32 = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * 斐波那契数列
 * @param n 位置
 * @returns 斐波那契数列的第n个数
 */
export function fibonacci(n: i32): i32 {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  
  let a: i32 = 0;
  let b: i32 = 1;
  let result: i32 = 0;
  
  for (let i: i32 = 2; i <= n; i++) {
    result = a + b;
    a = b;
    b = result;
  }
  
  return result;
}
