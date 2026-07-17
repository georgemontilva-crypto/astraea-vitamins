import {
  mysqlTable,
  varchar,
  int,
  boolean,
  decimal,
  json,
  timestamp,
  mysqlEnum,
  text,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// ---- Users (customers + admins — same table, distinguished by role) ----
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 191 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 191 }),
  role: mysqlEnum("role", ["customer", "admin"]).notNull().default("customer"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---- Categories (admin-managed — replaces the old fixed enum so new
// categories can be added without a schema change) ----
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(), // "Core", "On-the-Go", "Gummy", ...
  line: mysqlEnum("line", ["Wellness", "Sport", "Both"]).notNull().default("Both"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---- Site images (hero art, category headers, etc. — not tied to a product) ----
export const siteImages = mysqlTable("site_images", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 500 }).notNull(), // R2 object key
  url: varchar("url", { length: 500 }).notNull(),
  label: varchar("label", { length: 191 }), // "Home hero background", "Wellness category header"...
  createdAt: timestamp("created_at").defaultNow(),
});

// ---- Products (37 SKUs: 26 core + 5 On-the-Go + 6 gummies) ----
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  handle: varchar("handle", { length: 191 }).notNull().unique(), // e.g. "ashwagandha-ksm-66"
  sku: varchar("sku", { length: 32 }).notNull().unique(), // e.g. "AST-05"
  name: varchar("name", { length: 191 }).notNull(),
  line: mysqlEnum("line", ["Wellness", "Sport"]).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // matches categories.name
  format: mysqlEnum("format", ["capsule", "tablet", "powder", "stick", "gummy"]).notNull(),
  servingSupply: varchar("serving_supply", { length: 191 }), // "2 tablets · 28-day"
  headline: varchar("headline", { length: 255 }),
  blurb: text("blurb"),
  whyThisForm: text("why_this_form"),
  freeFromTags: varchar("free_from_tags", { length: 500 }), // pipe-separated
  supplementFacts: json("supplement_facts"), // array of {name, amount, unit, dv}
  otherIngredients: text("other_ingredients"),
  suggestedUse: text("suggested_use"),
  priceOneTime: decimal("price_one_time", { precision: 10, scale: 2 }),
  priceSubscribe: decimal("price_subscribe", { precision: 10, scale: 2 }), // 15% off
  stock: int("stock").default(0),
  imageUrl: varchar("image_url", { length: 500 }), // Cloudflare R2 URL
  labelPdfUrl: varchar("label_pdf_url", { length: 500 }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ---- Batches (the fixed-QR -> Lab Tests -> batch dropdown system) ----
export const batches = mysqlTable("batches", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("product_id").notNull(),
  lot: varchar("lot", { length: 32 }).notNull(), // "26-0114"
  manufacturedAt: varchar("manufactured_at", { length: 32 }),
  testedAt: varchar("tested_at", { length: 32 }),
  bestBy: varchar("best_by", { length: 32 }),
  pass: boolean("pass").notNull().default(true),
  labName: varchar("lab_name", { length: 191 }),
  reportNumber: varchar("report_number", { length: 64 }),
  panels: json("panels"), // array of {panel, claimLimit, tested, status}
  coaPdfUrl: varchar("coa_pdf_url", { length: 500 }), // R2 url
  supplierCoaUrl: varchar("supplier_coa_url", { length: 500 }),
  published: boolean("published").default(false), // SOP: only publish after PASS
  createdAt: timestamp("created_at").defaultNow(),
});

export const productsRelations = relations(products, ({ many }) => ({
  batches: many(batches),
}));

export const batchesRelations = relations(batches, ({ one }) => ({
  product: one(products, {
    fields: [batches.productId],
    references: [products.id],
  }),
}));

// ---- Orders (minimal — extend per checkout/subscription provider chosen later) ----
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"), // nullable — guest checkout allowed
  email: varchar("email", { length: 191 }).notNull(),
  items: json("items"), // [{productId, qty, mode: 'subscribe'|'one_time', priceAtPurchase}]
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }),
  status: mysqlEnum("status", ["pending", "paid", "fulfilled", "cancelled"]).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

// ---- Waitlist / email capture (Phase 1 launch campaign) ----
export const waitlist = mysqlTable("waitlist", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 191 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});
