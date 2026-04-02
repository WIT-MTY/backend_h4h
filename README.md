# 💜 Backend Hack4Her 💜

Backend service for the Hack4Her event webpage — built to power registrations, participant management, schedules, and more.

This API serves as the backbone of the Hack4Her platform, supporting organizers and participants throughout the event lifecycle.

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
│   ├── routes/  # Definición de end-points, exporta al Router de Express
│   ├── services/ # Consultas a DB
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

## Endpoints

### Salud del servicio

| Método | Endpoint | Descripción                                              | Auth |
| ------ | -------- | -------------------------------------------------------- | ---- |
| GET    | `/`      | Verifica que la API esté activa. Responde `API Running`. | No   |

### Autenticación

| Método | Endpoint       | Descripción                                                               | Auth                |
| ------ | -------------- | ------------------------------------------------------------------------- | ------------------- |
| POST   | `/auth/signup` | Registra una participante y crea su perfil. Acepta `multipart/form-data`. | No                  |
| POST   | `/auth/login`  | Inicia sesión de usuaria y devuelve la sesión/token.                      | No                  |
| POST   | `/auth/logout` | Cierra la sesión actual en Supabase.                                      | No                  |
| DELETE | `/auth/delete` | Elimina un usuario (el propio usuario o un admin).                        | Sí (`Bearer token`) |

Campos esperados para `POST /auth/signup`:

- `email` (string, requerido)
- `password` (string, requerido)
- `cv_file` (archivo, requerido)
- `permiso_file` (archivo, opcional)
- Resto de campos de registro del perfil (según formulario del frontend)

Body esperado para `DELETE /auth/delete`:

```json
{
  "userId": "<uuid-del-usuario>"
}
```

### Catálogos

Endpoints para poblar selects del frontend.

| Método | Endpoint                | Descripción              | Auth |
| ------ | ----------------------- | ------------------------ | ---- |
| GET    | `/catalogo/pais`        | Lista países.            | No   |
| GET    | `/catalogo/estado`      | Lista estados.           | No   |
| GET    | `/catalogo/universidad` | Lista universidades.     | No   |
| GET    | `/catalogo/genero`      | Lista géneros.           | No   |
| GET    | `/catalogo/talla`       | Lista tallas de playera. | No   |
| GET    | `/catalogo/carrera`     | Lista carreras.          | No   |
| GET    | `/catalogo/semestre`    | Lista semestres.         | No   |

### Participantes

| Método | Endpoint                                  | Descripción                                                                                                | Auth |
| ------ | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---- |
| PATCH  | `/participantes/:usuario_base_id/estatus`              | Actualiza el estatus de una participante por ID. Valores permitidos: 1, 2, 3. | No   |
| GET    | `/participantes/:usuario_base_id`         | Obtiene el perfil completo de una participante.                                                            | No   |
| GET    | `/participantes/estado/:estadoId`         | Obtiene participantes filtradas por estado.                                                                | No   |
| GET    | `/participantes/estatus/:usuario_base_id` | Obtiene únicamente el estatus de una participante.                                                         | No   |


Body esperado para `PATCH /participantes/:usuario_base_id/estatus`:

```json
{
  "estatus": 1
}
```

## Equipos
| Método | Endpoint                                  | Descripción                                                                                                | Auth |
| ------ | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---- |
| GET    | `/equipos/:equipoId`                    | Obtiene la información de un equipo por ID.                                                                | No   |

## 💻 Tech Stack

[![Tech](https://skillicons.dev/icons?i=ts,nextjs,postgres,nodejs&theme=dark)](https://skillicons.dev)

## 👩‍💻👩🏼‍💻👩🏿‍💻 Contributors

<a href="https://github.com/WIT-MTY/backend_h4h/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=WIT-MTY/backend_h4h" />
</a>

## 📜 License

This project is licensed under the MIT License.
