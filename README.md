# Northcoders News API

## Summary

Northcoders News API is my *first* backend development project. The intention here is to mimic the construction of a real-world backend service (e.g. Reddit), which provides application data to the front end architecture.

The database is PSQL, and interactions with the database will be handled via node-postgres.

## Live Demo

You can access the live demo of the project [here](postgres://khgpmtkp:rPedU8wcCotDKKIZzOG79Y2nfk7BuKpj@trumpet.db.elephantsql.com/khgpmtkp).

## Getting Started

To configure this project locally, please follow these steps:

### Prerequisites

- Node.js (minimum version: 14.6.4)
- PostgreSQL (minimum version: 14.0.0)

### Installation

1. Clone the repository:

```
git clone https://github.com/euandecoup/nc-news
```

2. Install dependencies:

```
cd nc-news
npm install
```

3. Environment files:
    * Create two environment files: '.env.test' and '.env.development'. 
    * Add the following line to each file: 'PGDATABASE=<database_name>.
    * N.B. Replace <database.name> with correct database name for each environment (see /db/setup.sql).
    * Add both environment files to the .gitignore file.

4. Seed the local database:

```
npm run seed
```

### Testing

To run the test suite:

```
npm test
```
