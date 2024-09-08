// just a demo of a function that returns a complicated type w/o an explicit return type annotation
import { helpInfer } from "./help-infer";
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
        firstName: "John" as string,
        lastName: "Doe",
      },
    },
  ]);
}
