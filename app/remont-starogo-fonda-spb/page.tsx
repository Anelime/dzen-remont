import ServiceLanding, {
  serviceMetadata,
} from "../components/ServiceLanding";
import { getService } from "../site-data";

const service = getService("remont-starogo-fonda-spb");
export const metadata = serviceMetadata(service);

export default function Page() {
  return <ServiceLanding service={service} />;
}
