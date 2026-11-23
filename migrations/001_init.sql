create table if not exists products (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text not null default '',
  price_cents integer not null check (price_cents >= 0 and price_cents <= 10000000),
  featured boolean not null default false,
  published boolean not null default false,
  images_json text not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_published_idx on products (published);
create index if not exists products_featured_idx on products (featured);

create table if not exists variants (
  id text primary key,
  product_id text not null references products (id) on delete cascade,
  color text,
  size text,
  sku text,
  stock integer,
  sort_order integer not null default 0
);

create index if not exists variants_product_idx on variants (product_id);

create table if not exists orders (
  id text primary key,
  provider text not null,
  stripe_session_id text unique,
  paypal_order_id text unique,
  email text,
  status text not null default 'pending',
  total_cents integer not null default 0 check (total_cents >= 0),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists orders_status_idx on orders (status);
create index if not exists orders_created_idx on orders (created_at desc);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders (id) on delete cascade,
  product_id text,
  product_name text not null,
  variant_id text,
  variant_label text,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0)
);

create index if not exists order_items_order_idx on order_items (order_id);

create table if not exists contact_messages (
  id text primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
