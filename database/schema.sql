-- Reference relational schema draft kept for documentation purposes.
-- Main application storage currently uses MongoDB.

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE batches (
  id SERIAL PRIMARY KEY,
  batch_code VARCHAR(100) UNIQUE NOT NULL,
  herb_name VARCHAR(120) NOT NULL,
  botanical_name VARCHAR(160) NOT NULL,
  region VARCHAR(160) NOT NULL
);
