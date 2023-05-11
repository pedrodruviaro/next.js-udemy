import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Textarea from "@/src/components/Textarea";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { getSession } from "next-auth/react";
import { db } from "@/src/services/firebaseConnection";
import {
    addDoc,
    deleteDoc,
    doc,
    collection,
    query,
    orderBy,
    where,
    onSnapshot,
} from "firebase/firestore";
import Link from "next/link";

interface HomeProps {
    user: {
        email: string;
    };
}

interface TaskProps {
    id: string;
    created: Date;
    public: boolean;
    tarefa: string;
    user: string;
}

export default function Dashboard({ user }: HomeProps) {
    const [input, setInput] = useState("");
    const [publicTask, setPublicTask] = useState(false);
    const [tasks, setTasks] = useState<TaskProps[]>([]);

    useEffect(() => {
        async function loadTarefas() {
            const terafasRef = collection(db, "tarefas");
            const q = query(
                terafasRef,
                orderBy("created", "desc"),
                where("user", "==", user?.email)
            );

            onSnapshot(q, (snapshot) => {
                const lista = [] as TaskProps[];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        tarefa: doc.data().tarefa,
                        created: doc.data().created,
                        user: doc.data().user,
                        public: doc.data().public,
                    });
                });

                setTasks(lista);
            });
        }

        loadTarefas();
    }, [user?.email]);

    function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
        setPublicTask((prev) => !prev);
    }

    async function handleRegisterTask(event: FormEvent) {
        event.preventDefault();

        if (input.trim() === "") return;

        try {
            await addDoc(collection(db, "tarefas"), {
                tarefa: input,
                created: new Date(),
                user: user?.email,
                public: publicTask,
            });

            setInput("");
            setPublicTask(false);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleShare(id: string) {
        await navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_URL}/task/${id}`
        );
    }

    async function handleDeleteTask(id: string) {
        const docRef = doc(db, "tarefas", id);

        await deleteDoc(docRef);
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>

            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual sua tarefa?</h1>
                        <form onSubmit={handleRegisterTask}>
                            <Textarea
                                value={input}
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>
                                ) => setInput(event.target.value)}
                                placeholder="Digite qual é sua tarefa"
                                required
                            />
                            <div className={styles.checkboxArea}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={publicTask}
                                    onChange={handleChangePublic}
                                />
                                <label>Deixar tarefa pública</label>
                            </div>
                            <button type="submit" className={styles.button}>
                                Registrar
                            </button>
                        </form>
                    </div>
                </section>

                <section className={styles.taskContainer}>
                    <h1>Minhas tarefas</h1>
                    {tasks.map((task) => (
                        <article className={styles.task} key={task.id}>
                            {task.public && (
                                <div className={styles.tagContainer}>
                                    <label className={styles.tag}>
                                        PUBLICA
                                    </label>
                                    <button
                                        className={styles.shareButton}
                                        onClick={() => handleShare(task.id)}
                                    >
                                        <FiShare2 size={22} color="#3183ff" />
                                    </button>
                                </div>
                            )}

                            <div className={styles.taskContent}>
                                {task.public ? (
                                    <Link href={`/task/${task.id}`}>
                                        <p>{task.tarefa}</p>
                                    </Link>
                                ) : (
                                    <p>ads</p>
                                )}

                                <button
                                    className={styles.trashButton}
                                    onClick={() => handleDeleteTask(task.id)}
                                >
                                    <FaTrash size={24} color="#ea3140" />
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });

    if (!session?.user) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {
            user: {
                email: session?.user?.email,
            },
        },
    };
};
