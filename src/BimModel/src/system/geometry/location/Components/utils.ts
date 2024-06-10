import isNaN from "lodash/isNaN";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";

export function parseText(text: string) {
  if (isNumber(text)) return text;

  if (isString(text)) {
    text = text.trim();

    if (!text) return "";
    const num = parseFloat(text);

    if (!isNaN(num)) {
      return num;
    }
  }

  return "";
}
