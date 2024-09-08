A POC exploration in...

- Extracting a type definition from a function without an explicit return type annotation
- Using that type definition to generate a Zod schema

**Potential applications:**

- Varied :)

**Usage:**

- `npm i`
- `npm run generate`

A `test-file.zod.ts` file should be generated in the `demo/out` directory.

**Example:**

Running the generate script on this `test-file.ts` file:

```ts
import y from "./test-import";

type Coordinate = {
  x: number;
  y: number;
};

type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  coordinate: Coordinate;
};

function x() {
  return {
    last4: "1234",
    expiration: "12/25",
    cvv: y(),
    zip: "12345",
    address: null as unknown as Address,
  };
}

// returns a pretty complicated object w/ no return annotation
export default function fetchCardInfo() {
  return helpInfer([
    {
      ...x(),
      cardHolder: {
        firstName: "John",
        lastName: "Doe",
      },
    },
  ]);
}
```

Should yield a `test-file.zod.ts` file containing:

```ts
import { z } from "zod";

export const resultSchema = z.array(
  z.object({
    cardHolder: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    last4: z.string(),
    expiration: z.string(),
    cvv: z.union([z.string(), z.number()]),
    zip: z.string(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      coordinate: z.object({
        x: z.number(),
        y: z.number(),
      }),
    }),
  })
);
```
