import { AsyncStatus } from "@/components/ui/AsyncStatus";
import { paymentStageLabel } from "@/lib/payments/checkoutFlow";

export function PaymentStatus({ stage }) {
  const label = paymentStageLabel(stage);
  return <AsyncStatus>{label}</AsyncStatus>;
}
