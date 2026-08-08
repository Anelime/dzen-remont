import ServiceLanding, {
  serviceMetadata,
} from "../components/ServiceLanding";
import { services } from "../site-data";

const service = services[0];
export const metadata = serviceMetadata(service);

export default function Page() {
  return <ServiceLanding service={service} />;
}

