import builder from "./builder.js";

// Register the DateTime scalar
builder.scalarType("DateTime", {
  serialize: (value) => value.toISOString(),
  parseValue: (value) => new Date(value as string),
});

// Import type/field definitions (side effects register them on the builder)
import "./venue.js";
import "./genre.js";
import "./event.js";

export const schema = builder.toSchema();
