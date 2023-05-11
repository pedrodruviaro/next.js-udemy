import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Head from "next/head";
import Textarea from "@/src/components/Textarea";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { db } from "../../services/firebaseConnection";
import { FaTrash } from "react-icons/fa";
import {
    doc,
    collection,
    query,
    where,
    getDoc,
    getDocs,
    addDoc,
    deleteDoc,
} from "firebase/firestore";

interface TaskProps {
    task: {
        tarefa: string;
        public: boolean;
        created: string;
        user: string;
        taskId: string;
    };
    allComments: CommentProps[];
}

interface CommentProps {
    id: string;
    comment: string;
    taskId: string;
    user: string;
    name: string;
}

export default function Task({ task, allComments }: TaskProps) {
    const { data: session } = useSession();
    const [input, setInput] = useState("");
    const [comments, setComments] = useState<CommentProps[]>(allComments || []);

    async function handleComment(event: FormEvent) {
        event?.preventDefault();

        if (input.trim() === "") return;

        if (!session?.user?.email || !session?.user?.name) return;

        try {
            const docRef = await addDoc(collection(db, "comments"), {
                comment: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: task?.taskId,
            });

            const data = {
                id: docRef.id,
                comment: input,
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: task.taskId,
            };

            setComments((prev) => [...prev, data]);

            setInput("");
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteComment(id: string) {
        try {
            const docRef = doc(db, "comments", id);
            await deleteDoc(docRef);

            const filteredComments = comments.filter((item) => {
                return item.id !== id;
            });

            setComments(filteredComments);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Head>
                <title>Tarefa - Detalhes da tarefa</title>
            </Head>
            <div className={styles.container}>
                <main className={styles.main}>
                    <h1>Tarefa</h1>
                    <article className={styles.task}>
                        <p>{task?.tarefa}</p>
                    </article>
                </main>

                <section className={styles.commentsContainer}>
                    <h2>Deixar comentário</h2>
                    <form onSubmit={handleComment}>
                        <Textarea
                            placeholder="Digite seu comentário"
                            value={input}
                            onChange={(
                                event: ChangeEvent<HTMLTextAreaElement>
                            ) => setInput(event?.target.value)}
                        />
                        <button
                            type="submit"
                            className={styles.button}
                            disabled={!session?.user}
                        >
                            Enviar comentário
                        </button>
                    </form>
                </section>

                <section className={styles.commentsContainer}>
                    <h2>Todos os comentários</h2>
                    {comments.length === 0 && (
                        <span>Nenhum comentário foi encontrado</span>
                    )}

                    {comments &&
                        comments.map((item) => (
                            <article className={styles.comment} key={item.id}>
                                <div className={styles.headComment}>
                                    <label className={styles.commentsLabel}>
                                        {item.name}
                                    </label>
                                    {item.user === session?.user?.email && (
                                        <button
                                            className={styles.buttonTrash}
                                            onClick={() =>
                                                handleDeleteComment(item.id)
                                            }
                                        >
                                            <FaTrash
                                                size={18}
                                                color="#ea3140"
                                            />
                                        </button>
                                    )}
                                </div>
                                <p>{item.comment}</p>
                            </article>
                        ))}
                </section>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const id = params?.id as string;

    const docRef = doc(db, "tarefas", id);

    // Coments
    const q = query(collection(db, "comments"), where("taskId", "==", id));
    const snapshotComments = await getDocs(q);

    let allComments: CommentProps[] = [];

    snapshotComments.forEach((doc) => {
        allComments.push({
            id: doc.id,
            comment: doc.data()?.comment,
            user: doc.data()?.user,
            name: doc.data()?.name,
            taskId: doc.data()?.taskId,
        });
    });

    console.log(allComments);

    // Tasks
    const snapshot = await getDoc(docRef);

    if (snapshot.data() === undefined) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    if (!snapshot.data()?.public) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    const miliseconds = snapshot.data()?.created?.seconds * 1000;

    const task = {
        tarefa: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id,
    };

    return {
        props: {
            task,
            allComments,
        },
    };
};
