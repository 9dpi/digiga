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
 * Logic quay Gacha dựa trên tỉ lệ mới:
 * C (Common): 95%
 * R (Rare): 4%
 * SR (Super Rare): 1%
 */
function pullGacha(count = 1) {
    const cards = getCards();
    if (cards.length === 0) return null;

    const results = [];

    for (let i = 0; i < count; i++) {
        const rand = Math.random() * 100;
        let rarityPool = [];
        let targetRarity = 'C';

        if (rand < 1) targetRarity = 'SR';
        else if (rand < 5) targetRarity = 'R'; // 1 + 4 = 5
        else targetRarity = 'C';

        rarityPool = cards.filter(c => {
            const cardRarity = (c.rarity || "").toString().toUpperCase();
            return cardRarity === targetRarity;
        });

        // Fallback nếu không có thẻ thuộc độ hiếm đó trong Sheet
        if (rarityPool.length === 0) {
            rarityPool = cards;
        }

        const result = rarityPool[Math.floor(Math.random() * rarityPool.length)];
        results.push(result);
    }

    return count === 1 ? results[0] : results;
}

/**
 * Hàm hỗ trợ index.html gọi code server
 */
function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
