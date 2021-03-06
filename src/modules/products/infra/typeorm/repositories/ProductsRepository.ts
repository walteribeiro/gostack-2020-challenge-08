import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProduct = await this.ormRepository.findOne({
      where: { name },
    });

    return findProduct;
  }

  public async findAllById(productsIds: IFindProducts[]): Promise<Product[]> {
    const products = await this.ormRepository.findByIds(productsIds);

    return products;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const idProducts = products.map(({ id }) => ({ id }));

    const allProducts = await this.findAllById(idProducts);

    const productsUpdate = allProducts.map(product => ({
      ...product,
      quantity:
        product.quantity -
        (products.find(({ id }) => product.id === id)?.quantity || 0),
    }));

    await this.ormRepository.save(productsUpdate);

    return allProducts;
  }
}

export default ProductsRepository;
