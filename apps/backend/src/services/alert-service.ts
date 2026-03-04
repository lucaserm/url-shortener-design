export interface Property {
  name: string;
  value: string | number | boolean;
  inline?: boolean;
}

export interface LogProps {
  occurredAt?: Date;
  title: string;
  description?: string;
  properties?: Property[];
}

export interface WarnProps {
  occurredAt?: Date;
  title: string;
  description?: string;
  properties?: Property[];
  needsAttention?: boolean;
}

export interface AlertService {
  log: (props: LogProps) => Promise<void>;
  warn: (props: WarnProps) => Promise<void>;
}
