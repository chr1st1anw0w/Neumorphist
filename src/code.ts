// Figma Plugin 主程式 - 處理選取元素和效果應用
figma.showUI(__html__, { width: 320, height: 480 });

// 訊息類型定義
interface UIMessage {
  type: 'apply-neumorphism' | 'get-selection' | 'close';
  data?: any;
}

// Neumorphism 參數介面
interface NeumorphismParams {
  lightShadow: { x: number; y: number; blur: number; color: RGB };
  darkShadow: { x: number; y: number; blur: number; color: RGB };
  backgroundColor: RGB;
  cornerRadius: number;
}

// 預設 Neumorphism 效果
const defaultNeumorphism: NeumorphismParams = {
  lightShadow: { x: -8, y: -8, blur: 16, color: { r: 1, g: 1, b: 1 } },
  darkShadow: { x: 8, y: 8, blur: 16, color: { r: 0.8, g: 0.8, b: 0.8 } },
  backgroundColor: { r: 0.93, g: 0.93, b: 0.93 },
  cornerRadius: 20
};

// 處理 UI 訊息
figma.ui.onmessage = (msg: UIMessage) => {
  switch (msg.type) {
    case 'apply-neumorphism':
      applyNeumorphismEffect(msg.data || defaultNeumorphism);
      break;
    
    case 'get-selection':
      sendSelectionInfo();
      break;
    
    case 'close':
      figma.closePlugin();
      break;
  }
};

// 應用 Neumorphism 效果到選取元素
function applyNeumorphismEffect(params: NeumorphismParams) {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.ui.postMessage({ 
      type: 'error', 
      message: '請先選取一個元素' 
    });
    return;
  }

  selection.forEach(node => {
    if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE' || node.type === 'FRAME') {
      try {
        // 設定背景色
        node.fills = [{
          type: 'SOLID',
          color: params.backgroundColor
        }];

        // 設定圓角 (僅限支援的元素)
        if ('cornerRadius' in node) {
          node.cornerRadius = params.cornerRadius;
        }

        // 設定陰影效果
        node.effects = [
          {
            type: 'DROP_SHADOW',
            color: { ...params.lightShadow.color, a: 0.3 },
            offset: { x: params.lightShadow.x, y: params.lightShadow.y },
            radius: params.lightShadow.blur,
            visible: true,
            blendMode: 'NORMAL'
          },
          {
            type: 'DROP_SHADOW',
            color: { ...params.darkShadow.color, a: 0.2 },
            offset: { x: params.darkShadow.x, y: params.darkShadow.y },
            radius: params.darkShadow.blur,
            visible: true,
            blendMode: 'NORMAL'
          }
        ];
        
      } catch (error) {
        console.error('應用效果時發生錯誤:', error);
        figma.ui.postMessage({ 
          type: 'error', 
          message: `無法應用效果到 ${node.name}` 
        });
      }
    }
  });

  figma.ui.postMessage({ 
    type: 'success', 
    message: `已應用 Neumorphism 效果到 ${selection.length} 個元素` 
  });
}

// 發送選取元素資訊到 UI
function sendSelectionInfo() {
  const selection = figma.currentPage.selection;
  figma.ui.postMessage({
    type: 'selection-update',
    data: {
      count: selection.length,
      elements: selection.map(node => ({
        name: node.name,
        type: node.type
      }))
    }
  });
}

// 監聽選取變更
figma.on('selectionchange', () => {
  sendSelectionInfo();
});

// 初始化
sendSelectionInfo();

export function handleOpenPlugin() {
  figma.showUI(__html__, { width: 480, height: 640 });
}

figma.on('run', ({ command }) => {
  switch(command) {
    case 'openPlugin': 
      handleOpenPlugin();
      break;
    case 'openPluginFromRelaunch':
      handleRelaunchScenario();
      break;
  }
});

export function handleRelaunchScenario() {
  const nodes = figma.currentPage.selection;
  
  if (nodes.length === 0) {
    figma.notify('请选择至少一个图层');
    return;
  }

  nodes.forEach(node => {
    if ('effects' in node) {
      applyNeumorphicEffect(node, 8, '#E0E0E0');
    }
  });
}
