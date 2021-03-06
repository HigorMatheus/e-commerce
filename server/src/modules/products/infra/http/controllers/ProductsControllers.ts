import CreateProductService from '@modules/products/services/CreateProductService';
import ListProductService from '@modules/products/services/ListProductsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProducts = container.resolve(ListProductService);

    const products = await listProducts.execute();
    return response.json(products);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { cost, quantity, title } = request.body;
    const createProduct = container.resolve(CreateProductService);

    const product = await createProduct.execute({ cost, quantity, title });

    return response.json(product);
  }
}

export default ProductsController;
