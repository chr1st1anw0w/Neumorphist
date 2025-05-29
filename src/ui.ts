// UI 互動邏輯 - TypeScript
interface NeumorphismPresets {
  [key: string]: {
    lightShadow: { x: number; y: number; blur: number; color: { r: number; g: number; b: number } };
    darkShadow: { x: number; y: number; blur: number; color: { r: number; g: number; b: number } };
    backgroundColor: { r: number; g: number; b: number };
    cornerRadius: number;
  };
}

// 預設樣式庫
const presets: NeumorphismPresets = {
  raised: {
    lightShadow: { x: -8, y: -8, blur: 16, color: { r: 1, g: 1, b: 1 } },
    darkShadow: { x: 8, y: 8, blur: 16, color: { r: 0.8, g: 0.8, b: 0.8 } },
    backgroundColor: { r: 0.93, g: 0.93, b: 0.93 },
    cornerRadius: 20
  },
  pressed: {
    lightShadow: { x: 8, y: 8, blur: 16, color: { r: 1, g: 1, b: 1 } },
    darkShadow: { x: -8, y: -8, blur: 16, color: { r: 0.8, g: 0.8, b: 0.8 } },
    backgroundColor: { r: 0.9, g: 0.9, b: 0.9 },
    cornerRadius: 20
  },
  flat: {
    lightShadow: { x: -4, y: -4, blur: 8, color: { r: 1, g: 1, b: 1 } },
    darkShadow: { x: 4, y: 4, blur: 8, color: { r: 0.85, g: 0.85, b: 0.85 } },
    backgroundColor: { r: 0.94, g: 0.94, b: 0.94 },
    cornerRadius: 12
  },
  soft: {
    lightShadow: { x: -12, y: -12, blur: 24, color: { r: 1, g: 1, b: 1 } },
    darkShadow: { x: 12, y: 12, blur: 24, color: { r: 0.75, g: 0.75, b: 0.75 } },
    backgroundColor: { r: 0.92, g: 0.92, b: 0.92 },
    cornerRadius: 25
  },
  hard: {
    lightShadow: { x: -6, y: -6, blur: 10, color: { r: 1, g: 1, b: 1 } },
    darkShadow: { x: 6, y: 6, blur: 10, color: { r: 0.7, g: 0.7, b: 0.7 } },
    backgroundColor: { r: 0.88, g: 0.88, b: 0.88 },
    cornerRadius: 15
  },
  light: {
    lightShadow: { x: -10, y: -10, blur: 20, color: { r: 1, g: 1, b: 1 } },
    darkShadow: { x: 10, y: 10, blur: 20, color: { r: 0.9, g: 0.9, b: 0.9 } },
    backgroundColor: { r: 0.96, g: 0.96, b: 0.96 },
    cornerRadius: 18
  },
  dark: {
    lightShadow: { x: -8, y: -8, blur: 16, color: { r: 0.4, g: 0.4, b: 0.4 } },
    darkShadow: { x: 8, y: 8, blur: 16, color: { r: 0.1, g: 0.1, b: 0.1 } },
    backgroundColor: { r: 0.2, g: 0.2, b: 0.2 },
    cornerRadius: 20
  }
};

// DOM 元素引用
const elements = {
  selectionInfo: document.getElementById('selection-info') as HTMLDivElement,
  presetBtns: document.querySelectorAll('.preset-btn') as NodeListOf<HTMLButtonElement>,
  intensitySlider: document.getElementById('intensity') as HTMLInputElement,
  intensityValue: document.getElementById('intensity-value') as HTMLSpanElement,
  radiusSlider: document.getElementById('radius') as HTMLInputElement,
  radiusValue: document.getElementById('radius-value') as HTMLSpanElement,
  bgColor: document.getElementById('bg-color') as HTMLInputElement,
  cssInput: document.getElementById('css-input') as HTMLTextAreaElement,
  parseCssBtn: document.getElementById('parse-css') as HTMLButtonElement,
  applyBtn: document.getElementById('apply-btn') as HTMLButtonElement,
  closeBtn: document.getElementById('close-btn') as HTMLButtonElement,
  message: document.getElementById('message') as HTMLDivElement
};

// 目前選中的預設樣式
let currentPreset = 'raised';

// 初始化事件監聽器
function initializeEventListeners() {
  // 預設樣式按鈕
  elements.presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.preset!;
      selectPreset(preset);
    });
  });

  // 滑桿事件
  elements.intensitySlider.addEventListener('input', (e) => {
    const value = (e.target as HTMLInputElement).value;
    elements.intensityValue.textContent = value;
    updatePreview();
  });

  elements.radiusSlider.addEventListener('input', (e) => {
    const value = (e.target as HTMLInputElement).value;
    elements.radiusValue.textContent = value;
    updatePreview();
  });

  // 顏色選擇器
  elements.bgColor.addEventListener('change', updatePreview);

  // CSS 解析按鈕
  elements.parseCssBtn.addEventListener('click', parseCSSInput);

  // 主要操作按鈕
  elements.applyBtn.addEventListener('click', applyEffect);
  elements.closeBtn.addEventListener('click', () => {
    parent.postMessage({ pluginMessage: { type: 'close' } }, '*');
  });
}

// 選擇預設樣式
function selectPreset(presetName: string) {
  currentPreset = presetName;
  
  // 更新按鈕狀態
  elements.presetBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === presetName);
  });

  // 如果不是自訂模式，載入預設參數
  if (presetName !== 'custom' && presets[presetName]) {
    const preset = presets[presetName];
    elements.intensitySlider.value = preset.lightShadow.blur.toString();
    elements.intensityValue.textContent = preset.lightShadow.blur.toString();
    elements.radiusSlider.value = preset.cornerRadius.toString();
    elements.radiusValue.textContent = preset.cornerRadius.toString();
    elements.bgColor.value = rgbToHex(preset.backgroundColor);
  }
}

// 更新預覽（目前僅更新 UI 顯示）
function updatePreview() {
  // 這裡可以加入即時預覽邏輯
  console.log('預覽更新');
}

// 解析 CSS 輸入
function parseCSSInput() {
  const cssText = elements.cssInput.value.trim();
  if (!cssText) {
    showMessage('請輸入 CSS 樣式', 'error');
    return;
  }

  try {
    // 簡單的 box-shadow 解析器
    const shadowMatch = cssText.match(/box-shadow:\s*([^;]+)/);
    if (shadowMatch) {
      const shadowValue = shadowMatch[1];
      console.log('解析 CSS:', shadowValue);
      showMessage('CSS 解析成功！', 'success');
      selectPreset('custom');
    } else {
      showMessage('未找到有效的 box-shadow 屬性', 'error');
    }
  } catch (error) {
    showMessage('CSS 解析失敗', 'error');
  }
}

// 新增效果应用逻辑
function applyEffect() {
  figma.ui.postMessage({
    type: 'APPLY_NEUMORPHISM',
    config: {
      shadows: currentShadows,
      borderRadius: sliderValues.radius,
      baseColor: colorPicker.value
    }
  })
}

// 獲取目前參數
function getCurrentParams() {
  const intensity = parseInt(elements.intensitySlider.value);
  const radius = parseInt(elements.radiusSlider.value);
  const bgColor = hexToRgb(elements.bgColor.value);

  if (currentPreset !== 'custom' && presets[currentPreset]) {
    const preset = presets[currentPreset];
    return {
      ...preset,
      lightShadow: { ...preset.lightShadow, blur: intensity },
      darkShadow: { ...preset.darkShadow, blur: intensity },
      backgroundColor: bgColor,
      cornerRadius: radius
    };
  }

  // 自訂參數
  return {
    lightShadow: { x: -intensity/2, y: -intensity/2, blur: intensity, color: { r: 1, g: 1, b: 1 } },
    darkShadow: { x: intensity/2, y: intensity/2, blur: intensity, color: { r: 0.8, g: 0.8, b: 0.8 } },
    backgroundColor: bgColor,
    cornerRadius: radius
  };
}

// 顯示訊息
function showMessage(text: string, type: 'success' | 'error') {
  elements.message.textContent = text;
  elements.message.className = `message ${type}`;
  
  setTimeout(() => {
    elements.message.classList.add('hidden');
  }, 3000);
}

// 工具函數
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0.93, g: 0.93, b: 0.93 };
}

function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

// 處理來自 Plugin 的訊息
window.onmessage = (event) => {
  const message = event.data.pluginMessage;
  
  switch (message.type) {
    case 'selection-update':
      const count = message.data.count;
      elements.selectionInfo.textContent = count > 0 
        ? `已選取 ${count} 個元素` 
        : '請選取元素';
      elements.applyBtn.disabled = count === 0;
      break;
      
    case 'success':
      showMessage(message.message, 'success');
      break;
      
    case 'error':
      showMessage(message.message, 'error');
      break;
  }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  selectPreset('raised'); // 預設選擇凸起效果
  
  // 請求目前選取狀態
  parent.postMessage({ pluginMessage: { type: 'get-selection' } }, '*');
});

// 在 presets 定义后添加
let currentShadows = {
  light: presets.raised.lightShadow,
  dark: presets.raised.darkShadow
};

// 在文件顶部添加状态接口
interface SliderState {
  radius: number;
  intensity: number;
}

const sliderValues: SliderState = {
  radius: 20, 
  intensity: 50
};
