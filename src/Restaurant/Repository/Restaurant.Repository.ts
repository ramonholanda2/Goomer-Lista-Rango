import { Restaurant } from "@prisma/client";
import PrismaRestaurant from "../../prisma/PrismaClient";
import { CreateRestaurantDTO } from "../dto/CreateRestaurant.dto";

class RestaurantRepository {
  static async createRestaurant(
    restaurant: CreateRestaurantDTO
  ): Promise<Restaurant> {
    const { address, image, opening_hours, name } = restaurant;
    await PrismaRestaurant.$executeRaw`INSERT INTO 
                Restaurant(name, address, image, opening_hours)  
                VALUES 
                (${name}, ${address}, ${image}, ${opening_hours});`;

    const restaurantCreated = await PrismaRestaurant.$queryRaw<
      Restaurant[]
    >`SELECT * FROM Restaurant WHERE restaurant_id = (SELECT MAX(restaurant_id)  FROM Restaurant)`;
    return restaurantCreated[0];
  }

  static async findAllRestaurant(): Promise<Restaurant[]> {
    return await PrismaRestaurant.$queryRaw<
      Restaurant[]
    >`SELECT * FROM Restaurant`;
  }

  static async findRestaurantById(restaurant_id: string): Promise<Restaurant> {
    const restaurant = await PrismaRestaurant.$queryRaw<
      Restaurant[]
    >`SELECT * FROM Restaurant Where Restaurant.restaurant_id = ${restaurant_id}`;
    return restaurant[0];
  }

  static async updateRestaurantById(restaurant: Restaurant): Promise<void> {
    await PrismaRestaurant.$executeRaw`UPDATE Restaurant SET 
        name = ${restaurant.name}, 
        image = ${restaurant.image}, 
        address = ${restaurant.address}, 
        opening_hours = ${restaurant.opening_hours} 
      WHERE 
        restaurant_id = ${restaurant.restaurant_id}`;
  }

  static async deleteRestaurantById(restaurant_id: string): Promise<void> {
    await PrismaRestaurant.$executeRaw` DELETE FROM Restaurant as rt
      WHERE 
        rt.restaurant_id = ${restaurant_id}`;
  }
}

export default RestaurantRepository;
