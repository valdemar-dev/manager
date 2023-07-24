import crypto from "crypto";

const hashText = (input: string) => {
  const hash = crypto.createHash("sha256");

  hash.update(input);

  return { output: hash.digest("hex") };
};

export default hashText;