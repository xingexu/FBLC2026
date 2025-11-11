/**
 * Overpass API query template
 * Fetches shops and amenities from OpenStreetMap
 * Template uses {{placeholders}} for bounding box coordinates
 */
export const OVERPASS_QUERY_TEMPLATE = `[out:json][timeout:25];
(
  node["shop"]({{south}},{{west}},{{north}},{{east}});
  node["amenity"~"restaurant|cafe|bar|fast_food|pub|bistro|bakery|hairdresser|pharmacy|clinic|bicycle_repair_station|bicycle_rental|bookstore|coworking_space|ice_cream"]({{south}},{{west}},{{north}},{{east}});
);
out body;
>;
out skel qt;`

/**
 * Brand exclusion list for filtering out chain stores
 * These brands are excluded to focus on small local businesses
 */
export const EXCLUDE_BRAND_LIST = [
  "Starbucks",
  "McDonald's",
  "Subway",
  "Walmart",
  "Costco",
  "Tim Hortons",
  "Taco Bell",
  "KFC",
  "Burger King",
  "Shoppers Drug Mart",
  "Rexall",
  "LCBO",
]

/**
 * Replace placeholders in query template with actual coordinates
 * @param south South latitude
 * @param west West longitude
 * @param north North latitude
 * @param east East longitude
 * @returns Complete Overpass query string
 */
export function buildOverpassQuery(
  south: number,
  west: number,
  north: number,
  east: number
): string {
  return OVERPASS_QUERY_TEMPLATE
    .replace(/\{\{south\}\}/g, south.toString())
    .replace(/\{\{west\}\}/g, west.toString())
    .replace(/\{\{north\}\}/g, north.toString())
    .replace(/\{\{east\}\}/g, east.toString())
}

