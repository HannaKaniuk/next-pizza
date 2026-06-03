import { hashSync } from "bcrypt";

import { prisma } from "./prisma-client";
import { categories, ingredients, products } from "./constants";
import { Prisma } from "@/lib/generated/prisma";

const randomDecimalNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
};

const CROISSANT_SIZE = {
  M: 30,
  L: 40,
  XL: 50,
} as const;

const generateProductItem = ({
  productId,
  productType,
  size,
  price,
}: {
  productId: number;
  productType?: number;
  size?: number;
  price?: number;
}) => {
  return {
    productId,
    price: price ?? Math.floor(randomDecimalNumber(190, 600)),
    productType,
    size,
  } satisfies Prisma.ProductItemCreateManyInput;
};

async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: "User",
        email: "user@example.com",
        password: hashSync("11111111", 10),
        verified: new Date(),
        role: "USER",
      },
      {
        fullName: "Admin",
        email: "admin@example.com",
        password: hashSync("11111111", 10),
        verified: new Date(),
        role: "ADMIN",
      },
    ],
  });

  await prisma.category.createMany({
    data: categories,
  });

  await prisma.ingredient.createMany({
    data: ingredients,
  });
  await prisma.product.createMany({
    data: products,
  });
  const croissants1 = await prisma.product.create({
    data: {
      name: "Цезар з куркою",
      imageUrl:
        "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/czezar-z-kurkoyu.webp",
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(0, 6),
      },
    },
  });
  const croissants2 = await prisma.product.create({
    data: {
      name: "Круасан BBQ Pork and cheese",
      imageUrl:
        "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/bbq-pork-cheese.webp",
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(2, 7),
      },
    },
  });
  const croissants3 = await prisma.product.create({
    data: {
      name: "Філадельфія з овочами",
      imageUrl:
        "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/filadelfiya-z-ovochamy.webp",
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(3, 9),
      },
    },
  });

  const assignIngredientIds = (productId: number, totalIngredients = 4) => {
    const result: number[] = [];
    for (let i = 0; i < totalIngredients; i++) {
      result.push(((productId + i) % ingredients.length) + 1);
    }
    return result;
  };

  // Ensure every product has at least one price option.
  const productsWithoutItems = await prisma.product.findMany({
    where: {
      items: {
        none: {},
      },
    },
    select: {
      id: true,
    },
  });

  if (productsWithoutItems.length > 0) {
    await prisma.productItem.createMany({
      data: productsWithoutItems.map(({ id }) =>
        generateProductItem({
          productId: id,
        }),
      ),
    });
  }

  // Ensure all croissants (categoryId = 1) have ingredients.
  const croissantsWithoutIngredients = await prisma.product.findMany({
    where: {
      categoryId: 1,
      ingredients: {
        none: {},
      },
    },
    select: {
      id: true,
    },
  });

  for (const { id } of croissantsWithoutIngredients) {
    await prisma.product.update({
      where: { id },
      data: {
        ingredients: {
          connect: assignIngredientIds(id).map((ingredientId) => ({
            id: ingredientId,
          })),
        },
      },
    });
  }

  await prisma.productItem.createMany({
    data: [
      // Цезар з куркою
      generateProductItem({
        productId: croissants1.id,
        productType: 2,
        size: CROISSANT_SIZE.M,
        price: 250,
      }),
      generateProductItem({
        productId: croissants1.id,
        productType: 2,
        size: CROISSANT_SIZE.L,
        price: 320,
      }),
      generateProductItem({
        productId: croissants1.id,
        productType: 2,
        size: CROISSANT_SIZE.XL,
        price: 390,
      }),
      // Круасан BBQ Pork and cheese
      generateProductItem({
        productId: croissants2.id,
        productType: 2,
        size: CROISSANT_SIZE.M,
        price: 280,
      }),
      generateProductItem({
        productId: croissants2.id,
        productType: 2,
        size: CROISSANT_SIZE.L,
        price: 350,
      }),
      generateProductItem({
        productId: croissants2.id,
        productType: 2,
        size: CROISSANT_SIZE.XL,
        price: 420,
      }),
      // Філадельфія з овочами
      generateProductItem({
        productId: croissants3.id,
        productType: 2,
        size: CROISSANT_SIZE.M,
        price: 270,
      }),
      generateProductItem({
        productId: croissants3.id,
        productType: 2,
        size: CROISSANT_SIZE.L,
        price: 340,
      }),
      generateProductItem({
        productId: croissants3.id,
        productType: 2,
        size: CROISSANT_SIZE.XL,
        price: 410,
      }),
    ],
  });

  await prisma.cart.create({
    data: {
      userId: 1,
      totalAmount: 500,
      token: "11111111",
      cartItems: {
        create: {
          productItemId: 1,
          quantity: 2,
          ingredients: {
            connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
          },
        },
      },
    },
  });

  await prisma.cart.create({
    data: {
      userId: 2,
      totalAmount: 0,
      token: "22222222",
    },
  });
}

async function down() {
  await prisma.$executeRaw`
    TRUNCATE TABLE
      "VerificationCode",
      "CartItem",
      "Cart",
      "_CartItemToIngredient",
      "Order",
      "ProductItem",
      "_IngredientToProduct",
      "Product",
      "Ingredient",
      "Category",
      "User"
    RESTART IDENTITY CASCADE
  `;
}

async function main() {
  await down();
  await up();
  const [productItems, carts, cartItems] = await Promise.all([
    prisma.productItem.count(),
    prisma.cart.count(),
    prisma.cartItem.count(),
  ]);
  console.log(
    `Seed OK: ${productItems} product items, ${carts} carts, ${cartItems} cart items`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
