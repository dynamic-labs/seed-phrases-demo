import React, { useState } from "react";
import { wordlists } from "bip39";
import crypto from "crypto";

import "./CheckSumValidation.css";

type ChecksumValidatorProps = {
  mnemonic: string;
};

const ChecksumValidator = ({ mnemonic }: ChecksumValidatorProps) => {
  const [validationSteps, setValidationSteps] = useState<any>([]);

  const getBinaryRepresentation = (mnemonic: string): string => {
    return mnemonic
      .split(" ")
      .map((word) => {
        const index = wordlists.english.indexOf(word);
        if (index === -1) {
          throw new Error(`Word '${word}' is not in the BIP-39 word list.`);
        }
        return index.toString(2).padStart(11, "0");
      })
      .join("");
  };

  const validateChecksum = () => {
    try {
      const binary = getBinaryRepresentation(mnemonic);
      const entropyBits = binary.slice(0, -binary.length / 33);
      const checksumBits = binary.slice(-binary.length / 33);

      const binaryChunks = binary.match(/.{8}/g);

      if (binaryChunks === null) {
        return;
      }

      // Convert each 8-bit chunk to a hexadecimal byte
      const hexBytes = binaryChunks.map((chunk) => {
        const decimalValue = parseInt(chunk, 2); // Convert binary to decimal
        return decimalValue.toString(16).padStart(2, "0"); // Convert decimal to hexadecimal
      });

      // Concatenate the hexadecimal bytes to form the final hexadecimal string
      const entropyHex = hexBytes.join("");

      const entropy = Buffer.from(entropyHex, "hex");

      const hash = crypto.createHash("sha256").update(entropy).digest("hex");
      const hashBits = parseInt(hash, 16).toString(2).padStart(256, "0");
      const recalculatedChecksum = hashBits.slice(0, checksumBits.length);

      setValidationSteps([
        <div className="validation-step-block">
          <p className="validation-step-title">Binary representation:</p>
          <p>{binary}</p>
        </div>,
        <div className="validation-step-block">
          <p className="validation-step-title">Extracted entropy</p>
          <p>{entropyBits}</p>
        </div>,
        <div className="validation-step-block">
          <p className="validation-step-title">Extracted checksum:</p>
          <p>{checksumBits}</p>
        </div>,
      ]);

      setValidationSteps((prev: any) => [
        ...prev,
        <div className="validation-step-block">
          <p className="validation-step-title">hex of the entropy:</p>
          <p>{entropyHex}</p>
        </div>,
        <div className="validation-step-block">
          <p className="validation-step-title">SHA-256 hash of entropy:</p>
          <p>{hash}</p>
        </div>,
        <div className="validation-step-block">
          <p className="validation-step-title">Recalculated checksum:</p>
          <p>{recalculatedChecksum}</p>
        </div>,
        <div className="validation-step-block">
          <p className="validation-step-title">
            Checksum is{" "}
            {recalculatedChecksum === checksumBits ? "valid" : "invalid"}
          </p>
        </div>,
      ]);
    } catch (error) {
      setValidationSteps([`Error: ${error}`]);
    }
  };

  return (
    <div className="checksum-container">
      <button className="validate-button" onClick={validateChecksum}>
        Validate Checksum
      </button>
      <div className="validation-steps">
        {validationSteps.map((step: any, index: number) => (
          <div key={index} className="step">
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChecksumValidator;
