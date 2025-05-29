export function getColor(colorName: string): string {
  const colors: Record<string, string> = {
    'PLUGIN_43_SOURCE': '#007AFF',
    'PLUGIN_43_SOURCE_DARK': '#0051D5',
    // 添加其他需要的顏色
  };
  return colors[colorName] || '#000000';
}

export const errorHandler = (error: Error) => {
  if (error.message.includes('ShadowSpread')) {
    console.error('陰影擴散值異常', error);
    figma.notify('請檢查陰影參數範圍');
  }
  // ...其他錯誤類型
};
