import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Product API (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();  
  });

  it('/products (POST) should create a product with translations', async () => {
    const translations = [
      { language: 'en', name: 'Product 1', description: 'Description 1' },
    ];

    const response = await request(app.getHttpServer())
      .post('/products')
      .send(translations)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.translations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          language: 'en',
          name: 'Product 1',
          description: 'Description 1',
        }),
      ])
    );
  });

  it('/products/search?language=en&name=Product&page=1&limit=10 (GET) should return matching products', async () => {
    const response = await request(app.getHttpServer())
      .get('/products/search')
      .query({ language: 'en', name: 'Product', page: 1, limit: 10 })
      .expect(200);

    expect(response.body.products).toBeDefined();
    expect(response.body.total).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await app.close();
  });
});
