import { countries } from "countries-list";

const countryOptions = Object.entries(countries).map(([code, country]) => ({
  value: country.name,
  label: `${code
    .toUpperCase()
    .replace(/./g, (c) =>
      String.fromCodePoint(127397 + c.charCodeAt(0)),
    )} ${country.name}`,
}));
export default countryOptions;
