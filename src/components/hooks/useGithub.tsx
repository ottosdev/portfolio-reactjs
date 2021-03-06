import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../../service/api";
import { retornar } from "../../utils/retonar";

interface ProjectsProps {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  languageFormatted: string | undefined;
}

interface UserProps {
  avatar_url: string;
  bio: string;
  location: string;
  login: string;
  name: string;
  html_url: string;
}

interface GitHubContextProviderProps {
  children: ReactNode;
}

interface GitHubContextProps {
  projects: ProjectsProps[];
  user: UserProps;
}

// Context responsavel por falar quais os dados ele tem disponveis
// Provider responsavel por prover os dados para aplicacao
export const GitHubContext = createContext({} as GitHubContextProps);

export function GitHubContextProvider({
  children,
}: GitHubContextProviderProps) {
  const [projects, setProjects] = useState<ProjectsProps[]>([]);
  const [user, setUser] = useState<UserProps>({} as UserProps);

  useEffect(() => {
    api.get("/ottosdev").then((response) => {
      setUser(response.data);
    });
  }, []);

  useEffect(() => {
    const laodData = () => {
      api.get<ProjectsProps[]>("/ottosdev/repos").then((response) => {
        const projectsFormatted = response.data.map(
          (project: ProjectsProps) => ({
            ...project,
            languageFormatted: retornar(project.name.split("-"))
              ? retornar(project.name.split("-"))
              : "Sem tipo",
            description: project.description
              ? project.description
              : "Sem descricao",
          })
        );

        setProjects(projectsFormatted);
      });
    };

    laodData();
  }, []);

  return (
    <GitHubContext.Provider value={{ projects, user }}>
      {children}
    </GitHubContext.Provider>
  );
}

export function useGithub() {
  const context = useContext(GitHubContext);
  return context;
}
