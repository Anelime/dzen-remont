import ServiceLanding, {
  serviceMetadata,
} from "../components/ServiceLanding";
import { getService } from "../site-data";

const service = getService("remont-kvartir-v-novostroyke-spb");
export const metadata = serviceMetadata(service);

export default function Page() {
  return <ServiceLanding service={service} />;
}
