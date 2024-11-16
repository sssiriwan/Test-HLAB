## คำแนะนำในการรันโปรเจคและทดสอบ

## การตั้งค่าระบบ
### 1. Clone โปรเจคจาก Git Repository
### 2. ติดตั้ง Dependencies
```bash
  npm install
```
### 3. ตั้งค่าฐานข้อมูล
- ใช้ PostgreSQL ดาวน์โหลดและติดตั้ง PostgreSQL หลังติดตั้งเสร็จ ให้สร้างฐานข้อมูล:
```sql
CREATE DATABASE multilingual_products;
```
- ตั้งค่าการเชื่อมต่อในไฟล์ src/app.module.ts:
```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_username', 
  password: 'your_password', 
  database: 'multilingual_products',
  autoLoadEntities: true, 
  synchronize: true, 
}),
```
### 4. รันโปรเจค

```bash
npm run start
```
## การรัน Test
- Unit Test
ทดสอบเฉพาะฟังก์ชันและบริการ:

```bash
npm run test
```

- Integration Test
ทดสอบการทำงานร่วมกันระหว่าง Controller และ Service:

```bash
npm run test:e2e
```

## การออกแบบฐานข้อมูล
### 1. ตาราง products: เก็บข้อมูลสินค้าแต่ละรายการ
      - id (Primary Key)
      - ความสัมพันธ์แบบ One-to-Many กับ product_translations
### 2. ตาราง product_translations: เก็บข้อมูลคำแปลของสินค้า
      - id (Primary Key)
      - language: ภาษา (เช่น en, th)
      - name: ชื่อสินค้าในภาษานั้น ๆ
      - description: คำอธิบายสินค้า
      - ความสัมพันธ์แบบ Many-to-One กับ products
*ใช้ TypeORM: เพื่อช่วยจัดการ Entity และความสัมพันธ์ในฐานข้อมูลอย่างมีประสิทธิภาพ
### Multilingual Support
การแยกข้อมูลคำแปลออกมาในตาราง product_translations ช่วยให้สามารถรองรับหลายภาษาได้โดยไม่ทำให้โครงสร้างของ products ซับซ้อน และช่วยลดการจัดเก็บข้อมูลที่ซ้ำซ้อน

## การ Validate ข้อมูล: Validation ใน API

### 1.API: Create a Multilingual Product
- ตรวจสอบว่าข้อมูล translations มีอย่างน้อย 1 รายการ
- ตรวจสอบว่า language และ name ในแต่ละ translation ไม่เป็นค่าว่าง
- ตรวจสอบว่า description มีความยาวอยู่ระหว่าง 5 ถึง 255 ตัวอักษร หากมีการกรอก

### 2.API: Multilingual Product Search
- ตรวจสอบว่าชื่อ (name) และภาษาที่ใช้ค้นหา (language) ถูกต้อง
- ตรวจสอบค่าของ page และ limit ว่าเป็นตัวเลขบวก

### 3.การจัดการ Error
-หากข้อมูลไม่ผ่านการตรวจสอบ จะส่ง BadRequestException พร้อมข้อความแสดงข้อผิดพลาดที่ชัดเจนกลับไปยังผู้ใช้งาน


## Testing Strategy
ใช้ Jest สำหรับการทดสอบ
Jest ช่วยให้สามารถเขียนและจัดการ Unit Test และ Integration Test ได้อย่างมีประสิทธิภาพ

### 1. Unit Test

- ทดสอบแต่ละฟังก์ชันใน ProductService เพื่อให้มั่นใจว่าการทำงานถูกต้อง
- ใช้ Mock Repository ในการจำลองการทำงานของฐานข้อมูล

### 2. Integration Test

- ทดสอบการทำงานระหว่าง ProductController และ ProductService
- ทดสอบ API Endpoint ว่าสามารถส่งข้อมูลและรับค่ากลับมาได้ถูกต้อง

### 3. End-to-End Test

- ทดสอบการทำงานของระบบทั้งหมดตั้งแต่การรับข้อมูลจาก API ไปจนถึงการจัดเก็บในฐานข้อมูล
- ใช้ฐานข้อมูลชั่วคราวสำหรับการทดสอบ เพื่อให้มั่นใจว่าการทดสอบไม่กระทบข้อมูลจริง


## ตัวอย่างคำสั่งในการทดสอบ
ทดสอบ API ด้วย Postman
- Create a Multilingual Product API
```json
POST http://localhost:3000/products
Body: 
[
  {
    "language": "en",
    "name": "Laptop",
    "description": "High performance laptop"
  },
  {
    "language": "th",
    "name": "แล็ปท็อป",
    "description": "แล็ปท็อปประสิทธิภาพสูง"
  }
]
```
- Multilingual Product Search API

```json
GET http://localhost:3000/products/search?name=Laptop&page=1&limit=10
```
response
```json
{
    "products": [
        {
            "productId": 3,
            "translations": [
                {
                    "id": 25,
                    "language": "en",
                    "name": "Laptop",
                    "description": "High performance laptop"
                },
                {
                    "id": 26,
                    "language": "th",
                    "name": "แล็ปท็อป",
                    "description": "แล็ปท็อปประสิทธิภาพสูง"
                }
            ]
        }
    ],
    "total": 1
}
```