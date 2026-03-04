import type { Property } from "@/services/alert-service";

/**
 * Converts `AppError` metadata into an array of `AlertService` properties
 */
export function metadataToProperties(
  metadata: Record<string, unknown>,
): Property[] {
  const result: Property[] = [];

  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === "object" && value !== null) {
      result.push({
        name: key,
        value: `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``,
        inline: true,
      });
    } else {
      result.push({
        name: key,
        value: String(value),
        inline: true,
      });
    }
  }

  return result;
}
