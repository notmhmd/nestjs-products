import {Inject, Injectable} from '@nestjs/common';
import {Repository, UpdateResult} from 'typeorm';
import {ProductEntity} from './data/product.entity';
import {CreateProductDto} from "./data/product.dto";

@Injectable()
export class AppService {
  constructor(
      @Inject('PRODUCT_REPOSITORY')
      private productsProviders: Repository<ProductEntity>,
  ) {
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.productsProviders.find();
  }
  async findByIds(productIds:number[]): Promise<ProductEntity[]> {
    return this.productsProviders.createQueryBuilder()
        .select()
        .where('id IN (:...productIds)', {productIds})
        .getMany()
  }

  async findById(productId: number): Promise<ProductEntity> {
    return this.productsProviders.findOneBy({id: productId});
  }

  async createProduct(product: CreateProductDto): Promise<ProductEntity> {
    return this.productsProviders.save(product);
  }

  async update(productId:number, createProductDto: CreateProductDto): Promise<UpdateResult> {
    return await this.productsProviders.update(productId, createProductDto);
  }

  async remove(productId: number): Promise<void> {
    await this.productsProviders.delete(productId);
  }


}
