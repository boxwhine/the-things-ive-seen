import builder from "./builder";

// Register the DateTime scalar
builder.scalarType("DateTime", {
  serialize: (value) => value.toISOString(),
  parseValue: (value) => new Date(value as string),
});

// Import type/field definitions (side effects register them on the builder)
import "./venue";
import "./genre";
import "./event";

export const schema = builder.toSchema();
