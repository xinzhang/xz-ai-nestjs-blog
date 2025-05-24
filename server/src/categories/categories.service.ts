import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, description?: string, color?: string) {
    const slug = this.generateSlug(name);
    
    // Check if category already exists
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existingCategory) {
      throw new ConflictException('Category name already exists');
    }

    return this.prisma.category.create({
      data: {
        name,
        slug,
        description,
        color,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        posts: {
          include: {
            post: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            post: {
              include: {
                author: true,
                categories: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Transform the response to match expected format
    return {
      ...category,
      posts: category.posts.map(pc => ({
        ...pc.post,
        categories: pc.post.categories.map(pcc => pcc.category),
      })),
    };
  }

  async update(id: number, name?: string, description?: string, color?: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updateData: any = {};

    if (name && name !== category.name) {
      const slug = this.generateSlug(name);
      
      // Check if new name/slug conflicts
      const existingCategory = await this.prisma.category.findFirst({
        where: {
          OR: [{ name }, { slug }],
          NOT: { id },
        },
      });

      if (existingCategory) {
        throw new ConflictException('Category name already exists');
      }

      updateData.name = name;
      updateData.slug = slug;
    }

    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;

    return this.prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.prisma.category.delete({
      where: { id },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
