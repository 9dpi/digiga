const SPREADSHEET_ID = '1F2-hZ3f6Qle2ErJgKOxOkt8A8Bh2jvWUdQnwRDvwcwI';

/**
 * Hàm phục vụ giao diện Web App
 */
function doGet(e) {
  // Đọc nội dung file index.html từ repo hoặc dán trực tiếp vào đây
  // Ở đây tôi sẽ tạo một Template từ file HTML
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Digiga - Gacha Card Game')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Hàm lấy danh sách thẻ bài từ Google Sheet
 */
function getCards() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Cards'); // Đảm bảo tên sheet là 'Cards'
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  return data.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h.toString().toLowerCase()] = row[i]);
    return obj;
  });
}

/**
 * Logic quay Gacha dựa trên tỉ lệ
 */
function pullGacha() {
  const cards = getCards();
  if (cards.length === 0) return null;

  // Ví dụ logic tỉ lệ: SSR (5%), SR (15%), R (80%)
  const rand = Math.random() * 100;
  let rarityPool = [];
  
  if (rand < 5) rarityPool = cards.filter(c => c.rarity === 'SSR');
  else if (rand < 20) rarityPool = cards.filter(c => c.rarity === 'SR');
  else rarityPool = cards.filter(c => c.rarity === 'R');

  // Nếu pool rỗng thì lấy đại 1 thẻ trong toàn bộ list
  const finalPool = rarityPool.length > 0 ? rarityPool : cards;
  const result = finalPool[Math.floor(Math.random() * finalPool.length)];
  
  return result;
}

/**
 * Hàm hỗ trợ index.html gọi code server
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
