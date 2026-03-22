# 💜 Backend Hack4Her 💜

Backend service for the Hack4Her event webpage — built to power registrations, participant management, schedules, and more.

This API serves as the backbone of the Hack4Her platform, supporting organizers and participants throughout the event lifecycle.

## 💻 Tech Stack

[![Tech](https://skillicons.dev/icons?i=ts,nextjs,postgres,nodejs&theme=dark)](https://skillicons.dev)

## Getting Started

1️⃣ **Clone the repository**

```
git clone https://github.com/WIT-MTY/backend_h4h.git
cd backend_h4h
```

2️⃣ **Install dependencies**

```
npm install
```

3️⃣ **Setup environment variables** \
 Create a .env file in the root directory

4️⃣ **Run the development server**

```
npm run dev
```

## 📂 Project Structure

```
backend_h4h/
│
├── Database/
│
├── src/
│   ├── config/  # Configuración global (Supabase client, env vars)
│   ├── controllers/  # Manejo de peticiones HTTP (req, res)
│   ├── dtos/  # Data Transfer Objects (validación de entrada)
│   ├── middleware/  # Guardianes de rutas (auth, validación de JWT)
│   ├── routes/  # Definición de end-points
│   ├── services/ # Lógica
│   ├── types/ # Definiciones de TypeScript e interfaces
│   └── server.ts  # Punto de entrada de la aplicación
│
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

## 👩‍💻👩🏼‍💻👩🏿‍💻 Contributors

Thanks to all the amazing people who have contributed to this project: \
<a href="https://github.com/WIT-MTY/backend_h4h/graphs/contributors"> <img src="https://contrib.rocks/image?repo=WIT-MTY/backend_h4h" /></a>

## 📜 License

This project is licensed under the MIT License.
