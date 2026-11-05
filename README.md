# 📦 StockFlow – Inventory Management System

**A modern, web-based inventory management system built to simplify product tracking, stock management, and inventory operations.**

StockFlow is a full-stack inventory management application designed to help businesses manage products, monitor stock levels, and maintain inventory transactions through a centralized dashboard.

---

## 🚀 Live Demo

🌐 **Live Application:** [StockFlow – Open Website](https://stockflow-mvp-4yi6.vercel.app)

📂 **GitHub Repository:** [StockFlow – Source Code](https://github.com/vamsee2004/stockflow-mvp)

---

## 📌 Project Overview

Managing inventory manually can lead to errors, inaccurate stock records, and inefficient business operations.

StockFlow provides a centralized platform to manage inventory efficiently. Users can authenticate themselves, manage products, track stock movements, and maintain inventory records.

The application uses a modern full-stack architecture with Next.js, TypeScript, Prisma ORM, and PostgreSQL.

---

## ✨ Key Features

- **User Authentication:** User registration and login functionality.
- **Product Management:** Create and manage product records.
- **Inventory Management:** Track inventory and stock quantities.
- **Stock In / Stock Out:** Record incoming and outgoing stock transactions.
- **Inventory Transactions:** Maintain records of inventory movements.
- **Settings:** Access application settings.
- **Database Integration:** Store application data using PostgreSQL.
- **Responsive Interface:** Access the application through a modern web interface.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Full-stack web framework |
| React | User interface |
| TypeScript | Type-safe development |
| Prisma ORM 6 | Database management |
| PostgreSQL | Relational database |
| Node.js | JavaScript runtime |
| CSS | Application styling |
| Vercel | Application deployment |
| Neon | Cloud PostgreSQL hosting |
| Git & GitHub | Version control |

---

## 📂 Project Structure

```text
stockflow-mvp/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── logout/
│   │   ├── products/
│   │   ├── inventory/
│   │   └── settings/
│   │
│   ├── dashboard/
│   ├── login/
│   ├── signup/
│   ├── layout.tsx
│   └── page.tsx
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── public/
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

*Note: This is a high-level representation of the project structure.*

---

## ⚙️ Installation and Setup

Follow these steps to run StockFlow locally.

### 1. Clone the Repository

```bash
git clone https://github.com/vamsee2004/stockflow-mvp.git
```

### 2. Navigate to the Project Directory

```bash
cd stockflow-mvp
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

Add the following variables:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secure_secret"
```

Replace the placeholder values with your actual database connection string and a secure JWT secret.

**Important:** Never commit your `.env` file or expose database credentials and authentication secrets.

### 5. Configure Prisma

Apply database migrations:

```bash
npx prisma migrate deploy
```

Generate Prisma Client:

```bash
npx prisma generate
```

### 6. Start the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

---

## 🗄️ Database

StockFlow uses PostgreSQL as its relational database and Prisma ORM for database access and schema management.

**Database hosting:** Neon PostgreSQL

**ORM:** Prisma

To check migration status:

```bash
npx prisma migrate status
```

To apply pending migrations:

```bash
npx prisma migrate deploy
```

---

## 🌐 Deployment

The application is deployed using:

- **Frontend and backend hosting:** Vercel
- **Cloud database:** Neon PostgreSQL

### Deployment Steps

1. Push the project source code to GitHub.
2. Import the GitHub repository into Vercel.
3. Configure the required environment variables.
4. Connect the Neon PostgreSQL database.
5. Deploy the application.
6. Apply the Prisma migrations to the production database.

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL database connection URL |
| `JWT_SECRET` | Secret used for JWT authentication |

Keep these values private and configure them through your local environment or hosting provider's environment variable settings.

---

## 🎯 Project Objectives

- Build a full-stack inventory management application.
- Understand REST API development using Next.js.
- Implement database operations using Prisma ORM.
- Integrate PostgreSQL into a real-world application.
- Implement user authentication.
- Understand cloud database configuration and deployment.
- Gain practical experience with GitHub and Vercel.

---

## 🔮 Future Enhancements

- Low-stock alerts and notifications.
- Advanced inventory analytics.
- Sales and purchase management.
- Export inventory reports to Excel and PDF.
- Role-based access control.
- Barcode and QR code scanning.
- Advanced reporting dashboard.

---

## 👨‍💻 Developer

**Vamsee Krishna**

B.Tech – Computer Science and Engineering

**Technical Interests:** Full-Stack Development | Python | SQL | Web Development

---

## 📄 License

This project is intended for educational and portfolio purposes. You may add an open-source license if you want to permit reuse and redistribution.

---

⭐ **If you find this project useful, consider giving the repository a star!**

**Built with ❤️ using Next.js, TypeScript, Prisma, and PostgreSQL.**
