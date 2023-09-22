import { Controller, NotFoundException, ParseIntPipe} from '@nestjs/common';
import {AppService} from './app.service';
import {ProductDto} from "./data/product.dto";
import {plainToInstance} from "class-transformer";
import {EventPattern, MessagePattern, Payload, RpcException} from "@nestjs/microservices";


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('product.create')
  async createProduct(@Payload() productDto:ProductDto){
    const productEntity = await this.appService.createProduct(productDto);

    if(!productEntity) {
      throw new RpcException("not able to add product")
    }
  }

  @MessagePattern('product.order-get')
  async getOrderProducts(@Payload("productIds") productIds:number[]): Promise<string> {
    console.log(productIds)
    const products = await this.appService.findByIds(productIds)
    if (products.length != productIds.length){
      throw new RpcException("invalid product information")
    }
    return JSON.stringify(plainToInstance(ProductDto, products))
  }


  @MessagePattern('product.get')
  async getProducts(): Promise<string> {
    const products = await this.appService.findAll()
    return JSON.stringify(plainToInstance(ProductDto, products))
  }

  @MessagePattern('product.retrieve')
  async getProduct(@Payload('productId', ParseIntPipe) productId:number): Promise<RpcException|string> {
    const product = await this.appService.findById(productId)
    if(!product) {
      throw new RpcException(new NotFoundException("Product was not found!"))
    }
    return JSON.stringify(plainToInstance(ProductDto, product))
  }
  @MessagePattern('product.update')
  async updateProduct(@Payload() {productId, productDto}){
    const updateResult = await this.appService.update(parseInt(productId), productDto)
    if (updateResult.affected){
      return "updated successfully"
    }
    throw new RpcException(new NotFoundException("Product was not found!"))
  }

}
