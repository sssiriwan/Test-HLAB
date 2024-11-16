# 1. useCallback ใช้ทําอะไร 

useCallback เป็นหนึ่งใน React Hooks ที่ช่วยให้เรา ลดการสร้างฟังก์ชันใหม่ซ้ำๆ ในทุกครั้งที่ component render ใหม่ ซึ่งจะช่วยเพิ่มประสิทธิภาพในการทำงานของแอปพลิเคชัน โดยเฉพาะอย่างยิ่งเมื่อฟังก์ชันนั้นถูกส่งเป็น props ไปยัง component ลูก
- useCallback ป้องกันการ render ซ้ำที่ไม่จำเป็น: เมื่อฟังก์ชันที่ถูกส่งเป็น props เปลี่ยนไป แม้ว่าตัวฟังก์ชันนั้นจะเหมือนเดิม แต่ React ก็จะทำการ render component ลูกใหม่ ซึ่งอาจทำให้เกิดการ render ซ้ำที่ไม่จำเป็น ลดการสร้างฟังก์ชันใหม่ซ้ำๆ จะช่วยลดภาระของ JavaScript และทำให้แอปพลิเคชันทำงานได้เร็วขึ้น

### ตัวอย่างการใช้างาน
```JavaScript
import { useCallback } from 'react';

function MyComponent() {
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []);

  return <button onClick={handleClick}>Click me</button>;
}
```
ในตัวอย่างนี้ handleClick จะถูกสร้างเพียงครั้งเดียว และจะไม่ถูกสร้างใหม่ทุกครั้งที่ component render ใหม่ แม้ว่า component จะ render ซ้ำหลายครั้งก็ตาม

### สรุป

- useCallback คือตัวช่วยในการจำค่าฟังก์ชันไว้
- ใช้เมื่อ: ฟังก์ชันถูกส่งเป็น props และไม่ต้องการให้สร้างฟังก์ชันใหม่ทุกครั้งที่ render
- ผลลัพธ์: เพิ่มประสิทธิภาพ ลดการ render ซ้ำที่ไม่จำเป็น
- Dependency array: อาร์กิวเมนต์ที่สองของ useCallback คือ dependency array ซึ่งจะบอกให้ useCallback รู้ว่าเมื่อค่าใดเปลี่ยนแปลง ควรสร้างฟังก์ชันใหม่

เมื่อไหร่ควรใช้ useCallback:
- เมื่อฟังก์ชันที่สร้างซ้ำๆ มีการคำนวณที่ซับซ้อน
- เมื่อฟังก์ชันถูกส่งเป็น props ไปยัง component ลูกที่ render บ่อยครั้ง