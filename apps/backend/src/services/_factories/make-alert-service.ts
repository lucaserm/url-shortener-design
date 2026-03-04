import { FakeAlertService } from "@/services/fake/fake-alert-service";

export function makeAlertService() {
  return new FakeAlertService();
}
