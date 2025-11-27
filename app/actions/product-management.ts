'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schemas
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  inventory: z.number().int().min(0, 'Inventory must be non-negative'),
  imageUrl: z.string().url().optional().nullable(),
  published: z.boolean().default(false),
})

export async function getProducts(filters?: {
  published?: boolean
  search?: string
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const where: any = {}

    if (filters?.published !== undefined) {
      where.published = filters.published
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: products }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { success: false, error: 'Failed to fetch products' }
  }
}

export async function getProduct(id: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            order: {
              select: {
                id: true,
                email: true,
                status: true,
                createdAt: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    return { success: true, data: product }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { success: false, error: 'Failed to fetch product' }
  }
}

export async function createProduct(data: z.infer<typeof productSchema>) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate data
    const validatedData = productSchema.parse(data)

    // Create Stripe product if published
    let stripeProductId: string | undefined
    let stripePriceId: string | undefined

    if (validatedData.published) {
      const stripeProduct = await stripe.products.create({
        name: validatedData.name,
        description: validatedData.description,
        images: validatedData.imageUrl ? [validatedData.imageUrl] : [],
      })

      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: validatedData.price,
        currency: 'usd',
      })

      stripeProductId = stripeProduct.id
      stripePriceId = stripePrice.id
    }

    // Create product in database
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        inventory: validatedData.inventory,
        imageUrl: validatedData.imageUrl,
        published: validatedData.published,
        stripeProductId,
        stripePriceId,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'PRODUCT_CREATED',
        resource: 'Product',
        details: {
          productId: product.id,
          name: product.name,
        },
      },
    })

    revalidatePath('/admin/products')
    revalidatePath('/shop')

    return { success: true, data: product }
  } catch (error) {
    console.error('Error creating product:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Failed to create product' }
  }
}

export async function updateProduct(
  id: string,
  data: Partial<z.infer<typeof productSchema>>
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Get existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return { success: false, error: 'Product not found' }
    }

    // Validate data
    const validatedData = productSchema.partial().parse(data)

    let stripeProductId = existingProduct.stripeProductId
    let stripePriceId = existingProduct.stripePriceId

    // Update Stripe product if needed
    if (validatedData.published && !existingProduct.stripeProductId) {
      // Create Stripe product
      const stripeProduct = await stripe.products.create({
        name: validatedData.name || existingProduct.name,
        description: validatedData.description || existingProduct.description,
        images: validatedData.imageUrl ? [validatedData.imageUrl] : existingProduct.imageUrl ? [existingProduct.imageUrl] : [],
      })

      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: validatedData.price || existingProduct.price,
        currency: 'usd',
      })

      stripeProductId = stripeProduct.id
      stripePriceId = stripePrice.id
    } else if (existingProduct.stripeProductId) {
      // Update existing Stripe product
      await stripe.products.update(existingProduct.stripeProductId, {
        name: validatedData.name || existingProduct.name,
        description: validatedData.description || existingProduct.description,
        images: validatedData.imageUrl ? [validatedData.imageUrl] : existingProduct.imageUrl ? [existingProduct.imageUrl] : [],
      })

      // If price changed, create new price (Stripe prices are immutable)
      if (validatedData.price && validatedData.price !== existingProduct.price) {
        const stripePrice = await stripe.prices.create({
          product: existingProduct.stripeProductId,
          unit_amount: validatedData.price,
          currency: 'usd',
        })

        stripePriceId = stripePrice.id
      }
    }

    // Update product in database
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...validatedData,
        stripeProductId,
        stripePriceId,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'PRODUCT_UPDATED',
        resource: 'Product',
        details: {
          productId: product.id,
          name: product.name,
          changes: validatedData,
        },
      },
    })

    revalidatePath('/admin/products')
    revalidatePath('/shop')

    return { success: true, data: product }
  } catch (error) {
    console.error('Error updating product:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Failed to update product' }
  }
}

export async function deleteProduct(id: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    // Get existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    })

    if (!existingProduct) {
      return { success: false, error: 'Product not found' }
    }

    // Check if product has orders
    if (existingProduct.orderItems.length > 0) {
      return {
        success: false,
        error: 'Cannot delete product with existing orders. Consider unpublishing instead.',
      }
    }

    // Archive Stripe product if exists
    if (existingProduct.stripeProductId) {
      await stripe.products.update(existingProduct.stripeProductId, {
        active: false,
      })
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'PRODUCT_DELETED',
        resource: 'Product',
        details: {
          productId: id,
          name: existingProduct.name,
        },
      },
    })

    revalidatePath('/admin/products')
    revalidatePath('/shop')

    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}

export async function updateInventory(id: string, quantity: number) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    if (quantity < 0) {
      return { success: false, error: 'Inventory cannot be negative' }
    }

    const product = await prisma.product.update({
      where: { id },
      data: { inventory: quantity },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'INVENTORY_UPDATED',
        resource: 'Product',
        details: {
          productId: product.id,
          name: product.name,
          newInventory: quantity,
        },
      },
    })

    revalidatePath('/admin/products')

    return { success: true, data: product }
  } catch (error) {
    console.error('Error updating inventory:', error)
    return { success: false, error: 'Failed to update inventory' }
  }
}
