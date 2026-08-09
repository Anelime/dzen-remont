import ProjectCasePage, { projectMetadata } from "../../components/ProjectCasePage";
import { getCase } from "../../site-data";

const project = getCase("salon-karpovka");

export const metadata = projectMetadata(project);

export default function Page() {
  return <ProjectCasePage project={project} />;
}
