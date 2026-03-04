import chalk from "chalk";

import type { AlertService, LogProps, WarnProps } from "../alert-service";

export class FakeAlertService implements AlertService {
  async log({
    title,
    description,
    properties,
    occurredAt = new Date(),
  }: LogProps) {
    console.log("==========+ LOG +==========");
    console.log(chalk.bold(title));
    if (description) {
      console.log(description);
    }
    for (const prop of properties ?? []) {
      let displayValue = String(prop.value);

      if (typeof prop.value === "boolean") {
        displayValue = prop.value ? "✅" : "❌";
      }

      console.log(`  · ${chalk.bold(prop.name)}: ${displayValue}`);
    }
    console.log(chalk.dim(occurredAt.toISOString()));
    console.log("===========================");
  }
  async warn({
    title,
    description,
    properties,
    needsAttention = false,
    occurredAt = new Date(),
  }: WarnProps) {
    const log = needsAttention ? console.error : console.warn;

    log(chalk.red(`==========+ ${chalk.bgRed.white(" WARN ")} +==========`));
    log(chalk.bold(title));
    if (description) {
      log(description);
    }
    log();
    for (const prop of properties ?? []) {
      let displayValue = String(prop.value);

      if (typeof prop.value === "boolean") {
        displayValue = prop.value ? "✅" : "❌";
      }

      log(`  · ${chalk.bold(prop.name)}: ${displayValue}`);
    }

    log();
    log(chalk.dim(occurredAt.toISOString()));
    log(chalk.red("=============================="));
  }
}
