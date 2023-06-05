import { Instructions } from "../types";

export const translate = (instructions: Instructions) => {
  return instructions
    .map((instruction) => {
      switch (instruction) {
        case "Forward":
          return "روبه‌رو";
        case "Right":
          return "راست";
        case "Left":
          return "چپ";
        case "Down":
          return "پایین";
        case "Up":
          return "بالا";

        default:
          return "روبه‌رو";
      }
    })
    .join(" >  ");
};
