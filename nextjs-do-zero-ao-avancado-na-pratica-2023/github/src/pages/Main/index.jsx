import React, { useState, useCallback, useEffect } from "react";
import api from "../../services/api.js";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import * as S from "./styles.jsx";

export default function Main() {
    const [newRepo, setNewRepo] = useState("");
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // Did mount
    useEffect(() => {
        const reposStorage = localStorage.getItem("repos");

        if (reposStorage) {
            setRepositorios(JSON.parse(reposStorage));
        }
    }, []);

    // Did update
    useEffect(() => {
        localStorage.setItem("repos", JSON.stringify(repositorios));
    }, [repositorios]);

    const handleInputChange = (e) => {
        setNewRepo(e.target.value);
        setAlert(null);
    };

    const handleDeleteRepo = useCallback(
        (repo) => {
            const remainingRepos = repositorios.filter((r) => r !== repo);

            setRepositorios(remainingRepos);
        },
        [repositorios]
    );

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            async function submit() {
                setLoading(true);
                setAlert(null);

                try {
                    if (newRepo.trim() === "") {
                        throw new Error("Indique um repositório");
                    }

                    const {
                        data: { full_name },
                    } = await api.get(`repos/${newRepo}`);

                    const hasRepo = repositorios.find(
                        (repo) => repo === full_name
                    );

                    if (hasRepo) {
                        throw new Error("Repositório duplicado");
                    }

                    setRepositorios([...repositorios, full_name]);

                    setNewRepo("");
                } catch (error) {
                    console.error(error);
                    setAlert(true);
                } finally {
                    setLoading(false);
                }
            }

            submit();
        },
        [newRepo, repositorios]
    );

    return (
        <S.Container>
            <h1>
                <FaGithub size={25} />
                Meus repositórios
            </h1>

            <S.Form onSubmit={handleSubmit} error={alert}>
                <input
                    type="text"
                    placeholder="Adicionar repositório"
                    value={newRepo}
                    onChange={handleInputChange}
                />

                <S.SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#ffffff" size={14} />
                    ) : (
                        <FaPlus color="#ffffff" size={14} />
                    )}
                </S.SubmitButton>
            </S.Form>

            <S.List>
                {repositorios.map((repo) => (
                    <li key={repo}>
                        <span>
                            <S.DeleteButton
                                onClick={() => handleDeleteRepo(repo)}
                            >
                                <FaTrash size={14} />
                            </S.DeleteButton>
                            {repo}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repo)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </S.List>
        </S.Container>
    );
}
