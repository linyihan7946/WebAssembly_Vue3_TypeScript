// WebAssembly服务类
// 用于加载和管理WebAssembly模块

interface WasmExports {
  add: (a: number, b: number) => number;
  subtract: (a: number, b: number) => number;
  multiply: (a: number, b: number) => number;
  divide: (a: number, b: number) => number;
  factorial: (n: number) => number;
  fibonacci: (n: number) => number;
}

class WasmService {
  private static instance: WasmService;
  private wasmModule: WasmExports | null = null;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;

  private constructor() {}

  /**
   * 获取WasmService的单例实例
   */
  public static getInstance(): WasmService {
    if (!WasmService.instance) {
      WasmService.instance = new WasmService();
    }
    return WasmService.instance;
  }

  /**
   * 加载WebAssembly模块
   */
  public async loadWasmModule(): Promise<void> {
    if (this.wasmModule) {
      return Promise.resolve();
    }

    if (this.isLoading) {
      return this.loadPromise!;
    }

    this.isLoading = true;
    this.loadPromise = new Promise<void>(async (resolve, reject) => {
      try {
        // 导入编译好的WebAssembly模块
        const imports = {}; // 如果模块有导入，可以在这里配置
        const wasmModule = await WebAssembly.instantiateStreaming(
          fetch('/assembly/build/release.wasm'),
          imports
        );
        
        this.wasmModule = wasmModule.instance.exports as unknown as WasmExports;
        this.isLoading = false;
        console.log('WebAssembly模块加载成功');
        resolve();
      } catch (error) {
        this.isLoading = false;
        console.error('WebAssembly模块加载失败:', error);
        reject(error);
      }
    });

    return this.loadPromise;
  }

  /**
   * 检查WebAssembly模块是否已加载
   */
  public isModuleLoaded(): boolean {
    return !!this.wasmModule;
  }

  /**
   * 获取WebAssembly模块
   */
  public getModule(): WasmExports {
    if (!this.wasmModule) {
      throw new Error('WebAssembly模块尚未加载，请先调用loadWasmModule方法');
    }
    return this.wasmModule;
  }

  // 提供便捷方法调用WebAssembly函数

  /**
   * 两数相加
   */
  public add(a: number, b: number): number {
    return this.getModule().add(a, b);
  }

  /**
   * 两数相减
   */
  public subtract(a: number, b: number): number {
    return this.getModule().subtract(a, b);
  }

  /**
   * 两数相乘
   */
  public multiply(a: number, b: number): number {
    return this.getModule().multiply(a, b);
  }

  /**
   * 两数相除
   */
  public divide(a: number, b: number): number {
    return this.getModule().divide(a, b);
  }

  /**
   * 计算阶乘
   */
  public factorial(n: number): number {
    return this.getModule().factorial(n);
  }

  /**
   * 计算斐波那契数列的第n项
   */
  public fibonacci(n: number): number {
    return this.getModule().fibonacci(n);
  }
}

export default WasmService; 