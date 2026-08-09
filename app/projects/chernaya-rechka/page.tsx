import ProjectCasePage, { projectMetadata } from "../../components/ProjectCasePage";
import { getCase } from "../../site-data";

const project = getCase("chernaya-rechka");

export const metadata = projectMetadata(project);

export default function Page() {
  return <ProjectCasePage project={project} />;
}
