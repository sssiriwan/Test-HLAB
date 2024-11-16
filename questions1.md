# 1. Assuming the system currently has three microservices: Customer API, Master Data API,  and Transaction Data API, there is a new feature that requires data from all three  microservices to be displayed in near real-time. The current technology stack includes  REST APIs and an RDBMS database. How would you design a new API for this feature? 

## แนวคิดหลัก

### 1. Event-Driven Architecture
- ไมโครเซอร์วิสแต่ละตัวจะส่งสัญญาณ (event) เมื่อมีการเปลี่ยนแปลงข้อมูล
- ระบบกลางจะรับฟังสัญญาณเหล่านี้และรวมข้อมูลจากทั้ง 3 ไมโครเซอร์วิส

### 2. Real-Time Data Processing
- ใช้เทคโนโลยีการประมวลผลข้อมูลแบบเรียลไทม์ เช่น Apache Kafka เพื่อประมวลผลสัญญาณและอัพเดทข้อมูลแบบทันที

### 3. Caching
- ใช้ระบบแคช เช่น Redis เพื่อเก็บข้อมูลที่รวมแล้ว เพื่อให้สามารถเรียกดูได้อย่างรวดเร็ว


## การออกแบบ API

### REST API
- สร้าง endpoint ใหม่ เช่น `/aggregated-data` เพื่อรับคำขอ
- Endpoint นี้จะดึงข้อมูลจากระบบกลางที่รวมข้อมูลทั้ง 3 ไมโครเซอร์วิส

### API Design
#### 3.1 Endpoint Structure
GET /aggregated-data
#### 3.2 Request Example
GET /aggregated-data?customerId=123&from=2023-01-01&to=2023-12-31
#### 3.3 Response Example
```json
{
  "customer": {
    // ข้อมูลจาก Customer API
  },
  "masterData": {
    // ข้อมูลจาก Master Data API
  },
  "transactionData": {
    // ข้อมูลจาก Transaction Data API
  }
}
```
## เทคโนโลยีที่อาจใช้:

- Message Broker: Kafka สำหรับการส่งรับสัญญาณระหว่างไมโครเซอร์วิส
- Data Stream Processing: Kafka Streams สำหรับประมวลผลสัญญาณแบบเรียลไทม์
- Caching: Redis สำหรับเก็บข้อมูลที่รวมแล้ว

## สรุป:

โดยสรุป เราจะสร้างระบบกลางเพื่อรวมข้อมูลจากทั้ง 3 ไมโครเซอร์วิส และออกแบบ API ใหม่เพื่อให้ผู้ใช้งานสามารถดึงข้อมูลที่รวมแล้วได้แบบเรียลไทม์ โดยใช้เทคโนโลยี Event-Driven Architecture และ Real-Time Data Processing