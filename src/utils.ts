import { wordlists } from "bip39";
import crypto from "crypto";
import BigNumber from "bignumber.js";

type ValidWordCount = 12 | 15 | 18 | 21 | 24;

/**
 * Converts the given entropy length to a hexadecimal string representation of random bytes.
 * @param entropyLength The length of the entropy in bits.
 * @returns A hexadecimal string representation of random bytes.
 */
export function entropyLengthToEntropyHex(entropyLength: number): string {
  return crypto.randomBytes(entropyLength / 8).toString("hex");
}

/**
 * Calculates the number of entropy bits based on the number of words in a seed phrase.
 * @param wordCount The number of words in the seed phrase.
 * @returns The number of entropy bits.
 */
export function wordCountToTotalBits(wordCount: ValidWordCount): number {
  return wordCount * 11 - wordCount / 3;
}

/**
 * Converts a hexadecimal string to a binary string.
 * @param hexString The hexadecimal string to convert.
 * @returns The binary string.
 */
export function hexToBinary(hexString: string) {
  return hexString
    .split("")
    .map((hexDigit) => {
      return parseInt(hexDigit, 16).toString(2).padStart(4, "0");
    })
    .join("");
}

export function wordsToBits(words: string[]) {
  return words.map((word) => {
    const index = wordlists.english.indexOf(word);
    const binaryStr = index.toString(2).padStart(11, "0"); // Convert to binary and pad to 11 bits
    return binaryStr;
  });
}

export const funFactsByWordCount = {
  12: `A 12-word seed phrase offers about 5.44 x 10^39 combinations. That's like choosing a single atom from a sphere of the Earth's size filled with tiny particles.`,
  15: `With a 15-word seed phrase, the combinations jump to approximately 1.41 x 10^50. You could cover the entire surface of the Earth with layers of paper stacks, each as tall as the Empire State Building, and have each stack represent a unique combination.`,
  18: `An 18-word seed phrase has around 3.67 x 10^60 combinations. That's more than all the visible stars in the universe, which are estimated to be around 7 x 10^22 stars.`,
  21: `For a 21-word seed phrase, you get about 9.56 x 10^70 combinations. This number is so large that if every star in the universe had its own universe inside it, with just as many stars, the total stars still wouldn't come close to this number.`,
  24: `A 24-word seed phrase has a mind-boggling 2.48 x 10^81 combinations. That's akin to the number of fundamental particles in the observable universe, which is estimated to be between 10^78 to 10^82 particles.`,
};

/**
 * Calculate the checksum for a given entropy.
 * @param entropyHex The entropy in hexadecimal format.
 * @returns The checksum as a binary string.
 */
export function calculateChecksum(entropyHex: string): string {
  // Convert the entropy to a buffer
  const entropyBuffer = Buffer.from(entropyHex, "hex");

  // Hash the entropy buffer using SHA-256
  const hash = crypto.createHash("sha256").update(entropyBuffer).digest("hex");

  // Calculate the number of bits of entropy (4 bits per hex digit)
  const entropyBits = entropyHex.length * 4;

  // Calculate the checksum length (1 bit for every 32 bits of entropy)
  const checksumLength = Math.floor(entropyBits / 32);

  // Convert the hash to a binary string and get the first 'checksumLength' bits
  const hashBinary = hash
    .split("")
    .map((hexDigit) => parseInt(hexDigit, 16).toString(2).padStart(4, "0"))
    .join("");

  return hashBinary.slice(0, checksumLength);
}

/**
 * Converts a mnemonic phrase to its binary representation.
 * @param mnemonic The mnemonic phrase to convert.
 * @returns The binary representation of the mnemonic phrase.
 * @throws An error if a word in the mnemonic phrase is not found in the wordlist.
 */
export function mnemonicToBits(mnemonic: string): string {
  // Split the mnemonic into words
  const words = mnemonic.split(" ");
  console.log(words);

  // Convert each word to its binary representation
  const bitsArray = words.map((word) => {
    const index = wordlists.english.indexOf(word);
    if (index === -1) {
      throw new Error(`Word not found in wordlist: ${word}`);
    }
    return index.toString(2).padStart(11, "0"); // Convert to 11-bit binary
  });

  // Concatenate all binary strings
  return bitsArray.join("");
}

// Function to convert a binary string to a decimal number
export function binaryToDecimal(binaryString: string): string {
  // Create a BigNumber object from the binary string
  const bigBinary = new BigNumber(binaryString, 2);

  // Convert the BigNumber to a decimal string
  const decimalString = bigBinary.toString(10);

  return decimalString;
}
