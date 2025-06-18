# 🧾 Proyecto: Gestión de Comprobantes con IA

Este proyecto es una API desarrollada con **NestJS** sobre la plataforma **Encore**, que permite la gestión de comprobantes (recibos) y la generación de respuestas inteligentes mediante **OpenAI**.

## 🚀 Endpoints Principales

### 📄 `/receipt` – Gestión de Recibos
- `POST /receipt`: Crear nuevo recibo.
- `GET /receipt`: Listar con filtros (fecha, estado, tipo, etc.).
- `PUT /receipt/:id`: Actualizar estado del recibo.
- `GET /receipts/export`: Exportar CSV en Base64.

### 🤖 `/openai/receipts`
- `POST`: Enviar pregunta basada en comprobantes exportados (CSV).  
  **Body:** `{ "prompt": "¿Cuál fue el monto total validado en mayo?" }`

## Dashboard
Para realizar pruebas localmente, puedes utilizar el Dashboard de Encore para NestJS, el cual cuenta con tipado integrado para evitar errores comunes.
Accede a la siguiente URL una vez que el entorno esté corriendo:

http://127.0.0.1:9400/qompa-zhhi/envs/local/api/nest/aiQueryOpenAI
![alt text](image.png)

## 🛠️ Instalación y configuración

1. **Clonar el proyecto**
   ```bash
   git clone https://github.com/MarcosAlanya19/receipt-management-with-AI
   cd receipt-management-with-AI
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` basado en `.env.example`:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/mydb
   OPENAI_API_KEY=sk-xxx
   ```

4. **Inicializar base de datos**
   ```bash
   npm run prisma:migrate
   ```

5. **Correr seed**
   ```bash
   npm run prisma:seed
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🔐 Seguridad y buenas prácticas

- Control de errores con `try/catch` y excepciones HTTP.
- Sanitización de entrada para evitar prompts vacíos.
- Logs controlados de errores con trazabilidad.

## 🧑‍💻 Autor

**Marcos Alanya Pacheco**  
DesarrolladorFullstack  
📧 asesoralanya19@gmail.com
