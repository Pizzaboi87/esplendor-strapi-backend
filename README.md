### Esplend'or Rings Backend

This repository contains the **Strapi** backend for the [Esplend'or Rings](https://esplendor-rings.vercel.app) website. It is responsible for managing the CMS, user authentication, GraphQL API, and all server-side logic.

#### Features

- **GraphQL API**: Supports efficient and structured data queries.
- **User Authentication**: Role-based access control with Strapi’s Users & Permissions plugin.
- **Cloudinary Integration**: For media storage and management.
- **SendGrid Integration**: For email communication (e.g., order confirmations, promotions).
- **Custom Privacy Handlers**:
  - Users can only access their own data.
  - Field-level access restrictions for sensitive information.
- **Database**: PostgreSQL hosted on [Aiven](https://aiven.io/).
- **Custom Controllers**: Extends Strapi's default functionalities for enhanced customization.

#### Tech Stack

- **CMS**: [Strapi](https://strapi.io/) (v5.4.0)
- **Database**: PostgreSQL
- **Media Storage**: [Cloudinary](https://cloudinary.com/)
- **Email Provider**: [SendGrid](https://sendgrid.com/)
- **GraphQL Plugin**: Enables seamless frontend integration.

#### Project Structure

##### Scripts

The backend can be managed using the following commands:

```bash
# Start the development server
npm run develop

# Build for production
npm run build

# Start the production server
npm run start

# Deploy the application
npm run deploy
```

##### Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Pizzaboi87/esplendor-strapi-backend.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables: Create a .env file at the root of the project and configure the following variables:

   ```bash
   # Server
   HOST=<your_host>
   PORT=<your_port>

   # Secrets
   APP_KEYS=<your_app_keys>
   API_TOKEN_SALT=<your_api_token_salt>
   ADMIN_JWT_SECRET=<your_admin_jwt_secret>
   TRANSFER_TOKEN_SALT=<your_transfer_token_salt>

   # Database
   DATABASE_URL_NEON=<your_database_url_neon>
   DATABASE_CLIENT=postgres
   DATABASE_HOST=<your_database_host>
   DATABASE_PORT=<your_database_port>
   DATABASE_NAME=<your_database_name>
   DATABASE_USERNAME=<your_database_username>
   DATABASE_PASSWORD=<your_database_password>
   DATABASE_SSL=true
   DATABASE_SSL_REJECT_UNAUTHORIZED=false

   JWT_SECRET=<your_jwt_secret>

   # Cloudinary
   CLOUDINARY_NAME=<your_cloudinary_name>
   CLOUDINARY_KEY=<your_cloudinary_key>
   CLOUDINARY_SECRET=<your_cloudinary_secret>

   # Email Providers
   SENDGRID_API_KEY=<your_sendgrid_api_key>
   RESEND_API_KEY=<your_resend_api_key>
   ```

4. Start the development server:

   ```bash
   npm run develop
   ```

5. To build and start in production mode:
   ```bash
   npm run build
   npm run start
   ```

#### API Documentation

The backend exposes a GraphQL API for interacting with the frontend. For detailed schema and queries, refer to the GraphQL playground (available in development mode).

#### Live Environment

This backend powers the live [Esplend'or Rings](https://esplendor-rings.vercel.app) website. Ensure that all deployments are tested in a staging environment before moving to production.

#### Contribution

Contributions are welcome! If you'd like to improve this backend or report a bug, please submit a pull request or open an issue.
