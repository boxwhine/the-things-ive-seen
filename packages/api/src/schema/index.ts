import builder from "./builder.js";

// Register the DateTime scalar
builder.scalarType("DateTime", {
  serialize: (value) => value.toISOString(),
  parseValue: (value) => {
    if (typeof value !== "string" && typeof value !== "number") {
      throw new TypeError("DateTime must be a string or number");
    }
    return new Date(value);
  },
});

// Import type/field definitions (side effects register them on the builder)
import "./venue.js";
import "./genre.js";
import "./event.js";

export const schema = builder.toSchema();
