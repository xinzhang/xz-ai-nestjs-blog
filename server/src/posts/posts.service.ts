import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, authorId: number) {
    const { categoryIds, ...postData } = createPostDto;
    
    // Generate slug from title
    const slug = this.generateSlug(createPostDto.title);
    
    const post = await this.prisma.post.create({
      data: {
        ...postData,
        slug,
        authorId,
        publishedAt: createPostDto.isPublished ? new Date() : null,
        categories: categoryIds ? {
          create: categoryIds.map(categoryId => ({
            category: { connect: { id: categoryId } }
          }))
        } : undefined,
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    // Transform the response to match expected format
    return {
      ...post,
      categories: post.categories.map(pc => pc.category),
    };
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { isPublished: true },
        include: {
          author: true,
          categories: {
            include: {
              category: true,
            },
          },
          comments: {
            include: {
              author: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.post.count({
        where: { isPublished: true },
      }),
    ]);

    // Transform the response
    const transformedPosts = posts.map(post => ({
      ...post,
      categories: post.categories.map(pc => pc.category),
    }));

    return { posts: transformedPosts, total };
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Increment views
    await this.prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    // Transform the response
    return {
      ...post,
      categories: post.categories.map(pc => pc.category),
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Increment views
    await this.prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    // Transform the response
    return {
      ...post,
      categories: post.categories.map(pc => pc.category),
    };
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const { categoryIds, ...updateData } = updatePostDto;

    // Create proper update data object
    const postUpdateData: any = { ...updateData };

    // Generate new slug if title is being updated
    if (updateData.title) {
      postUpdateData.slug = this.generateSlug(updateData.title);
    }

    // Set publishedAt if publishing for the first time
    if (updateData.isPublished && !post.isPublished) {
      postUpdateData.publishedAt = new Date();
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        ...postUpdateData,
        categories: categoryIds ? {
          deleteMany: {},
          create: categoryIds.map(categoryId => ({
            category: { connect: { id: categoryId } }
          }))
        } : undefined,
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    // Transform the response
    return {
      ...updatedPost,
      categories: updatedPost.categories.map(pc => pc.category),
    };
  }

  async remove(id: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({
      where: { id },
    });
  }

  async findByAuthor(authorId: number) {
    const posts = await this.prisma.post.findMany({
      where: { authorId },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform the response
    return posts.map(post => ({
      ...post,
      categories: post.categories.map(pc => pc.category),
    }));
  }

  async findByCategory(categoryId: number) {
    const posts = await this.prisma.post.findMany({
      where: {
        isPublished: true,
        categories: {
          some: {
            categoryId,
          },
        },
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform the response
    return posts.map(post => ({
      ...post,
      categories: post.categories.map(pc => pc.category),
    }));
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
