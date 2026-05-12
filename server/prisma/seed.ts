import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.menuItem.createMany({
    data: [
      { name: "Bruschetta", description: "Rostat bröd med tomat och basilika", category: "Förrätter", price: 89 },
      { name: "Caesarsallad", description: "Romansallad med krutonger och parmesan", category: "Förrätter", price: 109 },
      { name: "Grillad lax", description: "Med citronsmör och grönsaker", category: "Varmrätter", price: 189 },
      { name: "Pasta Carbonara", description: "Klassisk carbonara med pancetta", category: "Varmrätter", price: 159 },
      { name: "Hamburgare", description: "Angus med cheddar och pommes", category: "Varmrätter", price: 169 },
      { name: "Chokladfondant", description: "Med vaniljglass", category: "Desserter", price: 99 },
      { name: "Coca-Cola", description: "33cl", category: "Drycker", price: 35 },
      { name: "Loka Citron", description: "33cl", category: "Drycker", price: 29 },
    ],
  });

  console.log("Seed-data tillagd!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());