import { faker } from "@faker-js/faker";

import type { Shorten } from "@/schemas/shorten";

export function makeShorten(override?: Partial<Shorten>): Shorten {
  return {
    short_code: faker.string.alphanumeric(9),
    long_url: faker.internet.url(),
    created_at: faker.date.past(),
    expires_at: faker.date.future(),
    click_count: 0,
    last_accessed_at: null,
    ...override,
  };
}
