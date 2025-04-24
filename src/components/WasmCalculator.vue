<template>
  <div class="wasm-calculator">
    <h2>WebAssembly计算器</h2>
    
    <div v-if="!isWasmLoaded" class="loading">
      <p>正在加载WebAssembly模块...</p>
    </div>
    
    <div v-else class="calculator-content">
      <div class="calculator-section">
        <h3>基本运算</h3>
        <div class="input-group">
          <input type="number" v-model="num1" placeholder="第一个数字" />
          <select v-model="operation">
            <option value="add">+</option>
            <option value="subtract">-</option>
            <option value="multiply">×</option>
            <option value="divide">÷</option>
          </select>
          <input type="number" v-model="num2" placeholder="第二个数字" />
          <button @click="calculate" :disabled="!isInputValid">计算</button>
        </div>
        <p class="result">结果: {{ basicResult }}</p>
      </div>
      
      <div class="calculator-section">
        <h3>阶乘计算</h3>
        <div class="input-group">
          <input type="number" v-model="factorialInput" placeholder="输入一个数字" min="0" max="12" />
          <button @click="calculateFactorial" :disabled="!isFactorialInputValid">计算</button>
        </div>
        <p class="result">{{ factorialInput }}! = {{ factorialResult }}</p>
      </div>
      
      <div class="calculator-section">
        <h3>斐波那契数列</h3>
        <div class="input-group">
          <input type="number" v-model="fibonacciInput" placeholder="输入位置n" min="0" max="45" />
          <button @click="calculateFibonacci" :disabled="!isFibonacciInputValid">计算</button>
        </div>
        <p class="result">斐波那契数列的第 {{ fibonacciInput }} 项 = {{ fibonacciResult }}</p>
      </div>
      
      <div class="performance-section">
        <h3>性能测试</h3>
        <button @click="runPerformanceTest">运行性能测试</button>
        <div v-if="performanceResults.length > 0" class="performance-results">
          <h4>测试结果:</h4>
          <ul>
            <li v-for="(result, index) in performanceResults" :key="index">
              {{ result }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import WasmService from '../services/WasmService';

export default defineComponent({
  name: 'WasmCalculator',
  
  setup() {
    const wasmService = WasmService.getInstance();
    const isWasmLoaded = ref(false);
    
    // 基本运算
    const num1 = ref<number>(5);
    const num2 = ref<number>(3);
    const operation = ref<string>('add');
    const basicResult = ref<number | string>('');
    
    // 阶乘计算
    const factorialInput = ref<number>(5);
    const factorialResult = ref<number | string>('');
    
    // 斐波那契计算
    const fibonacciInput = ref<number>(10);
    const fibonacciResult = ref<number | string>('');
    
    // 性能测试结果
    const performanceResults = ref<string[]>([]);
    
    // 输入验证
    const isInputValid = computed(() => {
      return num1.value !== undefined && num2.value !== undefined &&
        (operation.value !== 'divide' || num2.value !== 0);
    });
    
    const isFactorialInputValid = computed(() => {
      return factorialInput.value !== undefined && 
        factorialInput.value >= 0 && 
        factorialInput.value <= 12; // 限制输入范围
    });
    
    const isFibonacciInputValid = computed(() => {
      return fibonacciInput.value !== undefined && 
        fibonacciInput.value >= 0 && 
        fibonacciInput.value <= 45; // 限制输入范围
    });
    
    // 加载WebAssembly模块
    onMounted(async () => {
      try {
        await wasmService.loadWasmModule();
        isWasmLoaded.value = true;
      } catch (error) {
        console.error('加载WebAssembly模块失败:', error);
      }
    });
    
    // 基本运算
    const calculate = () => {
      try {
        switch(operation.value) {
          case 'add':
            basicResult.value = wasmService.add(Number(num1.value), Number(num2.value));
            break;
          case 'subtract':
            basicResult.value = wasmService.subtract(Number(num1.value), Number(num2.value));
            break;
          case 'multiply':
            basicResult.value = wasmService.multiply(Number(num1.value), Number(num2.value));
            break;
          case 'divide':
            if (num2.value === 0) {
              basicResult.value = '除数不能为0';
              return;
            }
            basicResult.value = wasmService.divide(Number(num1.value), Number(num2.value));
            break;
        }
      } catch (error) {
        console.error('计算错误:', error);
        basicResult.value = '计算出错';
      }
    };
    
    // 计算阶乘
    const calculateFactorial = () => {
      try {
        factorialResult.value = wasmService.factorial(Number(factorialInput.value));
      } catch (error) {
        console.error('阶乘计算错误:', error);
        factorialResult.value = '计算出错';
      }
    };
    
    // 计算斐波那契数列
    const calculateFibonacci = () => {
      try {
        fibonacciResult.value = wasmService.fibonacci(Number(fibonacciInput.value));
      } catch (error) {
        console.error('斐波那契计算错误:', error);
        fibonacciResult.value = '计算出错';
      }
    };
    
    // 运行性能测试
    const runPerformanceTest = () => {
      performanceResults.value = [];
      
      // 测试阶乘计算性能
      const testFactorial = (n: number) => {
        const start = performance.now();
        wasmService.factorial(n);
        const end = performance.now();
        return end - start;
      };
      
      // 测试斐波那契计算性能
      const testFibonacci = (n: number) => {
        const start = performance.now();
        wasmService.fibonacci(n);
        const end = performance.now();
        return end - start;
      };
      
      // JavaScript实现的斐波那契函数
      const jsFibonacci = (n: number): number => {
        if (n <= 0) return 0;
        if (n === 1) return 1;
        return jsFibonacci(n - 1) + jsFibonacci(n - 2);
      };
      
      // 测试JS斐波那契计算性能
      const testJsFibonacci = (n: number) => {
        const start = performance.now();
        jsFibonacci(n);
        const end = performance.now();
        return end - start;
      };
      
      // 执行测试
      try {
        const factorialTime = testFactorial(10);
        performanceResults.value.push(`计算10的阶乘耗时: ${factorialTime.toFixed(3)}ms (WebAssembly)`);
        
        const fibonacciTime = testFibonacci(30);
        performanceResults.value.push(`计算斐波那契数列第30项耗时: ${fibonacciTime.toFixed(3)}ms (WebAssembly)`);
        
        // 对于较小的值，测试JS实现
        const jsFibonacciTime = testJsFibonacci(20);
        performanceResults.value.push(`计算斐波那契数列第20项耗时: ${jsFibonacciTime.toFixed(3)}ms (JavaScript)`);
      } catch (error) {
        console.error('性能测试错误:', error);
        performanceResults.value.push('性能测试失败');
      }
    };
    
    return {
      isWasmLoaded,
      num1,
      num2,
      operation,
      basicResult,
      factorialInput,
      factorialResult,
      fibonacciInput,
      fibonacciResult,
      performanceResults,
      isInputValid,
      isFactorialInputValid,
      isFibonacciInputValid,
      calculate,
      calculateFactorial,
      calculateFibonacci,
      runPerformanceTest
    };
  }
});
</script>

<style scoped>
.wasm-calculator {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

h3 {
  color: #555;
  margin-bottom: 10px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.calculator-section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

input[type="number"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100px;
}

select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.result {
  font-weight: bold;
  margin-top: 10px;
  padding: 8px;
  background-color: #e9e9e9;
  border-radius: 4px;
}

.performance-section {
  margin-top: 30px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.performance-results {
  margin-top: 15px;
}

.performance-results ul {
  list-style-type: none;
  padding: 0;
}

.performance-results li {
  margin-bottom: 5px;
  padding: 8px;
  background-color: #e9e9e9;
  border-radius: 4px;
}
</style> 