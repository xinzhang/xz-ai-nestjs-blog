import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Posts about technology and programming',
        color: '#007BFF',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'lifestyle' },
      update: {},
      create: {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Posts about lifestyle and personal experiences',
        color: '#28A745',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'travel' },
      update: {},
      create: {
        name: 'Travel',
        slug: 'travel',
        description: 'Posts about travel and adventures',
        color: '#FFC107',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'food' },
      update: {},
      create: {
        name: 'Food',
        slug: 'food',
        description: 'Posts about cooking and food reviews',
        color: '#DC3545',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'health' },
      update: {},
      create: {
        name: 'Health',
        slug: 'health',
        description: 'Posts about health and wellness',
        color: '#17A2B8',
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@blog.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        bio: 'Administrator of the blog',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { username: 'johndoe' },
      update: {},
      create: {
        username: 'johndoe',
        email: 'john@example.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Tech enthusiast and blogger',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { username: 'janedoe' },
      update: {},
      create: {
        username: 'janedoe',
        email: 'jane@example.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Doe',
        bio: 'Lifestyle blogger and content creator',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Users created');

  // Create Posts
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: 'getting-started-with-nestjs' },
      update: {},
      create: {
        title: 'Getting Started with NestJS',
        slug: 'getting-started-with-nestjs',
        content: `NestJS is a progressive Node.js framework for building efficient and scalable server-side applications. It uses modern JavaScript, is built with TypeScript and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

## Why Choose NestJS?

NestJS provides several advantages:

1. **TypeScript Support**: Built with TypeScript from the ground up
2. **Modular Architecture**: Organizes code into modules for better maintainability
3. **Dependency Injection**: Built-in DI container for better testability
4. **Decorators**: Extensive use of decorators for clean, readable code
5. **Testing**: Excellent testing capabilities out of the box

## Getting Started

To create a new NestJS project:

\`\`\`bash
npm i -g @nestjs/cli
nest new project-name
cd project-name
npm run start:dev
\`\`\`

## Building Your First Controller

\`\`\`typescript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
\`\`\`

This comprehensive guide will help you understand the fundamentals of NestJS and get you started building robust APIs.`,
        excerpt: 'Learn the basics of NestJS framework and how to build scalable server-side applications',
        isPublished: true,
        authorId: users[1].id, // johndoe
        publishedAt: new Date(),
      },
    }),
    prisma.post.upsert({
      where: { slug: '10-must-visit-places-2024' },
      update: {},
      create: {
        title: '10 Must-Visit Places in 2024',
        slug: '10-must-visit-places-2024',
        content: `Traveling is one of life's greatest pleasures, and 2024 offers incredible destinations for every type of traveler. From pristine beaches to bustling cities, here are the top 10 places you should consider visiting this year.

## 1. Tokyo, Japan 🇯🇵
The perfect blend of traditional culture and cutting-edge technology. Don't miss the cherry blossoms in spring!

## 2. Santorini, Greece 🇬🇷
Iconic white-washed buildings and stunning sunsets make this a photographer's paradise.

## 3. Patagonia, Chile 🇨🇱
For adventure seekers looking for dramatic landscapes and hiking opportunities.

## 4. Bali, Indonesia 🇮🇩
Tropical paradise with rich culture, beautiful temples, and amazing food.

## 5. Iceland 🇮🇸
Land of fire and ice, perfect for seeing the Northern Lights and unique geological features.

## 6. Morocco 🇲🇦
Vibrant markets, stunning architecture, and diverse landscapes from desert to mountains.

## 7. New Zealand 🇳🇿
Adventure capital of the world with breathtaking scenery and outdoor activities.

## 8. Costa Rica 🇨🇷
Eco-tourism paradise with incredible biodiversity and sustainable travel options.

## 9. Vietnam 🇻🇳
Rich history, delicious cuisine, and stunning natural beauty from Ha Long Bay to the Mekong Delta.

## 10. Portugal 🇵🇹
Charming cities, beautiful coastlines, and excellent value for money.

Each destination offers unique experiences and memories that will last a lifetime. Start planning your 2024 adventures today!`,
        excerpt: 'Discover the most amazing travel destinations for your 2024 adventures',
        isPublished: true,
        authorId: users[2].id, // janedoe
        publishedAt: new Date(),
      },
    }),
    prisma.post.upsert({
      where: { slug: 'healthy-meal-prep-ideas' },
      update: {},
      create: {
        title: 'Healthy Meal Prep Ideas for Busy Professionals',
        slug: 'healthy-meal-prep-ideas',
        content: `Meal prepping is a game-changer for maintaining a healthy diet while saving time and money. Here are some delicious and nutritious meal prep ideas that will keep you energized throughout the week.

## Benefits of Meal Prepping

- **Time Saving**: Cook once, eat multiple times
- **Money Saving**: Buy ingredients in bulk and reduce food waste
- **Health Benefits**: Control portions and ingredients
- **Stress Reduction**: No more "what's for dinner?" decisions

## Breakfast Options

### Overnight Oats with Berries
\`\`\`
Ingredients:
- 1/2 cup rolled oats
- 1/2 cup milk of choice
- 1 tbsp chia seeds
- 1 tbsp maple syrup
- 1/4 cup mixed berries
\`\`\`

### Egg Muffins with Vegetables
Perfect grab-and-go breakfast packed with protein and veggies.

### Greek Yogurt Parfaits
Layer Greek yogurt with granola and fresh fruits.

## Lunch Options

### Quinoa Buddha Bowls
- Base: Quinoa or brown rice
- Protein: Grilled chicken, tofu, or chickpeas
- Vegetables: Roasted sweet potato, broccoli, bell peppers
- Sauce: Tahini or pesto

### Mediterranean Chickpea Salad
A refreshing and filling salad that gets better with time.

### Chicken and Vegetable Stir-fry
Quick to prepare and full of nutrients.

## Dinner Options

### Sheet Pan Salmon with Vegetables
One-pan meals are perfect for busy weeknights.

### Slow Cooker Chili
Make a big batch and freeze portions for later.

### Zucchini Noodles with Turkey Meatballs
A healthy twist on a classic comfort food.

## Meal Prep Tips

1. **Start Small**: Begin with prepping just one meal
2. **Invest in Good Containers**: Glass containers work best
3. **Prep Ingredients**: Wash, chop, and portion ingredients
4. **Use a Timer**: Set specific times for meal prep sessions
5. **Keep It Simple**: Don't overcomplicate recipes

Remember, the key to successful meal prepping is consistency. Start with simple recipes and gradually add variety as you become more comfortable with the process.`,
        excerpt: 'Simple and nutritious meal prep recipes for a healthier lifestyle',
        isPublished: true,
        authorId: users[2].id, // janedoe
        publishedAt: new Date(),
      },
    }),
  ]);

  console.log('✅ Posts created');

  // Create Post-Category relationships
  await Promise.all([
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[0].id,
          categoryId: categories[0].id, // Technology
        },
      },
      update: {},
      create: {
        postId: posts[0].id,
        categoryId: categories[0].id,
      },
    }),
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[1].id,
          categoryId: categories[2].id, // Travel
        },
      },
      update: {},
      create: {
        postId: posts[1].id,
        categoryId: categories[2].id,
      },
    }),
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[2].id,
          categoryId: categories[3].id, // Food
        },
      },
      update: {},
      create: {
        postId: posts[2].id,
        categoryId: categories[3].id,
      },
    }),
    prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: posts[2].id,
          categoryId: categories[4].id, // Health
        },
      },
      update: {},
      create: {
        postId: posts[2].id,
        categoryId: categories[4].id,
      },
    }),
  ]);

  console.log('✅ Post-Category relationships created');

  // Create Comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great article! Very helpful for beginners getting started with NestJS.',
        authorId: users[2].id, // janedoe
        postId: posts[0].id,
        isApproved: true,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'I love NestJS! Thanks for sharing this comprehensive guide.',
        authorId: users[0].id, // admin
        postId: posts[0].id,
        isApproved: true,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Amazing travel list! I\'ve been to Santorini and it\'s absolutely incredible. The sunsets are breathtaking!',
        authorId: users[1].id, // johndoe
        postId: posts[1].id,
        isApproved: true,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'These meal prep ideas are exactly what I needed. Thank you for the detailed recipes!',
        authorId: users[0].id, // admin
        postId: posts[2].id,
        isApproved: true,
      },
    }),
  ]);

  console.log('✅ Comments created');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
