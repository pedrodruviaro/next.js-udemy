import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";
import * as S from "./styles";

export default function Repositorio({ match }) {
    const nomeRepo = decodeURIComponent(match.params.repositorio);

    const [repositorio, setRepositorio] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const [filters] = useState([
        {
            state: "all",
            label: "Todas",
            active: true,
        },
        {
            state: "open",
            label: "Abertas",
            active: false,
        },
        {
            state: "closed",
            label: "Fechadas",
            active: false,
        },
    ]);
    const [filterIndex, setFilterIndex] = useState(0);

    function handleFilter(index) {
        setFilterIndex(index);
    }

    useEffect(() => {
        async function loadIssue() {
            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: filters[filterIndex].state,
                    page: page,
                    per_page: 5,
                },
            });

            setIssues(response.data);
        }

        loadIssue();
    }, [filterIndex, filters, nomeRepo, page]);

    function handlePage(action) {
        setPage(action === "back" ? page - 1 : page + 1);
    }

    useEffect(() => {
        async function loadRepo() {
            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: filters.find((f) => f.active).state,
                        per_page: 5,
                    },
                }),
            ]);

            setRepositorio(repositorioData.data);

            if (issuesData.data) {
                setIssues(issuesData.data);
            }

            setLoading(false);
        }

        loadRepo();
    }, [nomeRepo, filters]);

    if (loading) {
        return (
            <S.Loading>
                <h1>Carregando...</h1>
            </S.Loading>
        );
    }

    return (
        <S.Container>
            <S.BackButton to="/">
                <FaArrowLeft color="#000" size={30} />
            </S.BackButton>

            <S.Owner>
                <img
                    src={repositorio.owner.avatar_url}
                    alt={repositorio.owner.login}
                />
                <h1>{repositorio.name}</h1>
                <p>{repositorio.description}</p>
            </S.Owner>

            <S.FilterList active={filterIndex}>
                {filters.map((button, index) => (
                    <button
                        type="button"
                        key={button.label}
                        onClick={() => handleFilter(index)}
                    >
                        {button.label}
                    </button>
                ))}
            </S.FilterList>

            <S.IssuesList>
                {issues.map((issue) => (
                    <li key={String(issue.id)}>
                        <img
                            src={issue.user.avatar_url}
                            alt={issue.user.login}
                        />

                        <div>
                            <strong>
                                <a
                                    href={issue.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {issue.title}
                                </a>

                                {issue.labels.map((label) => (
                                    <span key={String(label.id)}>
                                        {label.name}
                                    </span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </S.IssuesList>

            <S.PageActions>
                <button
                    type="button"
                    onClick={() => handlePage("back")}
                    disabled={page < 2}
                >
                    Voltar
                </button>
                <button type="button" onClick={() => handlePage("next")}>
                    Próxima
                </button>
            </S.PageActions>
        </S.Container>
    );
}
