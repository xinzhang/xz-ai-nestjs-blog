import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(registerDto: RegisterDto) {
    const { username, email, password, ...userData } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        ...userData,
      },
    });

    // Return user without password
    const { password: _, ...result } = user;
    return result;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            categories: {
              include: {
                category: true,
              },
            },
          },
        },
        comments: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Transform the response to match the expected format
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      posts: user.posts.map(post => ({
        ...post,
        categories: post.categories.map(pc => pc.category),
      })),
    };
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        posts: {
          include: {
            categories: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    // Remove passwords and transform posts
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        posts: user.posts.map(post => ({
          ...post,
          categories: post.categories.map(pc => pc.category),
        })),
      };
    });
  }

  async update(id: number, updateData: any) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, ...result } = updatedUser;
    return result;
  }
}
