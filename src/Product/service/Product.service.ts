import { Product } from "@prisma/client";
import { ProductRepository } from "../repository/Product.Repository";
import RestaurantService from "../../Restaurant/Services/Restaurant.Service";
import { CreateProductDTO } from "../dto/CreateProductDTO";
import NotFoundException from "../../Exceptions/NotFoundException";

export class ProductService {
  static async createProductForRestaurant(
    product: CreateProductDTO
  ): Promise<Product> {
    await RestaurantService.findRestaurantById(String(product.restaurant_id));
    return await ProductRepository.createProductForRestaurant(product);
  }

  static async findProductByRestaurant(
    restaurant_id: string
  ): Promise<Product[]> {
    await RestaurantService.findRestaurantById(restaurant_id);
    return await ProductRepository.findProductByRestaurant(restaurant_id);
  }

  static async updateProductByRestaurant(
    product_id: string,
    product: CreateProductDTO
  ): Promise<void> {
    await RestaurantService.findRestaurantById(String(product.restaurant_id));
    await this.findProductById(product_id);
    await ProductRepository.updateProductByRestaurant(product_id, product);
  }

  static async deleteProductByRestaurant(
    product_id: string,
    restaurant_id: number
  ): Promise<void> {
    await RestaurantService.findRestaurantById(String(restaurant_id));
    await this.findProductById(product_id);
    await ProductRepository.deleteProductByRestaurant(product_id);
  }

  static async findProductById(product_id: string): Promise<Product> {
    const product = await ProductRepository.findProductById(product_id);
    if (!product) {
      throw new NotFoundException(
        `produto com o id ${product_id} não encontrado`
      );
    }
    return product;
  }
}
