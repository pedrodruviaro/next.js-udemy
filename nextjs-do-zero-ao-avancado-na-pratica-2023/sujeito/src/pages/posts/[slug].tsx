import React from "react";
import Head from "next/head";
import styles from "./post.module.scss";
import Prismic from "@prismicio/client";
import { GetServerSideProps } from "next";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom";
import Image from "next/image";

interface SinglePostProps {
    post: {
        slug: string;
        title: string;
        description: string;
        cover: string;
        updatedAt: string;
    };
}

export default function SinglePost({ post }: SinglePostProps) {
    return (
        <>
            <Head>
                <title>{post.title} | Sujeito Programador</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <Image
                        src={post.cover}
                        width={720}
                        height={410}
                        alt={post.title}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                        quality={100}
                    />

                    <h1>{post.title}</h1>

                    <time>{post.updatedAt}</time>

                    <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.description }}></div>
                </article>
            </main>
        </>
    );
}

// Req ony in serverSideProps
export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const prismic = getPrismicClient(req);

    const response = await prismic.getByUID("post", String(params.slug), {});

    if (!response) {
        return {
            redirect: {
                destination: "/posts",
                permanent: false,
            },
        };
    }

    const post = {
        slug: params.slug,
        title: RichText.asText(response.data.title),
        description: RichText.asHtml(response.data.description),
        cover: response.data.cover.url,
        updatedAt: new Date(response.last_publication_date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }),
    };

    return {
        props: {
            slug: params.slug,
            post: post,
        },
    };
};
