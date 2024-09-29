const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const getCardImagePath = (bank, cardName) => {
  const formattedCardName = cardName.replace(/\s+/g, "_").toLowerCase();
  return `/card-images/${bank}/${bank.toLowerCase()}_${formattedCardName}.webp`;
};

const isImageHorizontal = async (imagePath) => {
  try {
    const fullPath = path.join(__dirname, '..', 'public', imagePath);
    const metadata = await sharp(fullPath).metadata();
    return metadata.width > metadata.height;
  } catch (error) {
    console.error(`Error processing image ${imagePath}:`, error.message);
    return false;
  }
};

const generateHorizontalCardList = async (bankData) => {
  const horizontalCards = [];

  for (const [bank, cards] of Object.entries(bankData)) {
    for (const card of cards) {
      if (
        (bank === "HDFC" && card === "Pixel Go") ||
        (bank === "HDFC" && card === "Regalia Gold") ||
        (bank === "KOTAK" && card === "811 #DreamDifferent")
      ) {
        continue;
      }

      const imagePath = getCardImagePath(bank, card);
      try {
        if (await isImageHorizontal(imagePath)) {
          horizontalCards.push({ bank, cardName: card, imagePath });
        }
      } catch (error) {
        console.error(`Skipping ${bank} ${card}: ${error.message}`);
      }
    }
  }

  return horizontalCards;
};

const saveHorizontalCardList = async (horizontalCards) => {
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'horizontalCardImages.json');
  await fs.writeFile(outputPath, JSON.stringify(horizontalCards, null, 2));
  console.log(`Horizontal card list saved to ${outputPath}`);
};

async function main() {
  try {
    const bankDataPath = path.join(__dirname, '..', 'src', 'data', 'bankData.js');
    const bankDataContent = await fs.readFile(bankDataPath, 'utf8');
    const bankDataMatch = bankDataContent.match(/export const bankData = ({[\s\S]*?});/);
    if (!bankDataMatch) {
      throw new Error('Could not find bankData in the file');
    }
    const bankData = eval(`(${bankDataMatch[1]})`);

    const horizontalCards = await generateHorizontalCardList(bankData);
    await saveHorizontalCardList(horizontalCards);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();