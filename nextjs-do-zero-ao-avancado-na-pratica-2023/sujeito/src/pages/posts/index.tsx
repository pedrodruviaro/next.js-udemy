import { useState } from "react";
import styles from "./styles.module.scss";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import thumb from "../../../public/images/thumb.png";

import { FiChevronsRight, FiChevronRight, FiChevronLeft, FiChevronsLeft } from "react-icons/fi";
import { GetStaticProps } from "next";

import { getPrismicClient } from "../../services/prismic";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

type Post = {
    slug: string;
    title: string;
    cover: string;
    description: string;
    updatedAt: string;
};

interface PostsProps {
    posts: Post[];
    page: string;
    totalPages: string;
}

export default function Posts({ posts: blogPosts, page, totalPages }: PostsProps) {
    const [currentPage, setCurrentPage] = useState(Number(page));
    const [posts, setPosts] = useState(blogPosts || []);

    // Search new posts
    async function getPostsPagination(pageNumber: number) {
        const prismic = getPrismicClient();

        const response = await prismic.query([Prismic.Predicates.at("document.type", "post")], {
            orderings: "[document.last_publication_date desc]",
            fetch: ["post.title", "post.description", "post.cover"],
            pageSize: 2,
            page: String(pageNumber),
        });

        return response;
    }

    async function handleNavigatePage(pageNumber: number) {
        const response = await getPostsPagination(pageNumber);

        console.log(response);

        if (response.results.length === 0) {
            return;
        }

        const newPosts = response.results.map((post) => {
            return {
                slug: post.uid,
                title: RichText.asText(post.data.title),
                description: post.data.description.find((content) => content.type === "paragraph")?.text ?? "",
                cover: post.data.cover.url,
                updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }),
            };
        });

        setCurrentPage(pageNumber);
        setPosts(newPosts);
    }

    return (
        <>
            <Head>
                <title>Confira nossos conteúdos exclusivo - Sujeito Programador</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map((post) => (
                        <Link href={`/posts/${post.slug}`} key={post.slug}>
                            <Image
                                src={post.cover}
                                alt="Um alt text legal aqui"
                                width={720}
                                height={410}
                                quality={70}
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                            />

                            <h3>{post.title}</h3>
                            <time>{post.updatedAt}</time>
                            <p>{post.description}</p>
                        </Link>
                    ))}

                    <div className={styles.buttonNavigate}>
                        {Number(currentPage) >= 2 && (
                            <div>
                                <button onClick={() => handleNavigatePage(1)}>
                                    <FiChevronsLeft size={25} color="#ffffff" />
                                </button>
                                <button onClick={() => handleNavigatePage(Number(currentPage - 1))}>
                                    <FiChevronLeft size={25} color="#ffffff" />
                                </button>
                            </div>
                        )}

                        {Number(currentPage) < Number(totalPages) && (
                            <div>
                                <button onClick={() => handleNavigatePage(Number(currentPage + 1))}>
                                    <FiChevronsRight size={25} color="#ffffff" />
                                </button>
                                <button onClick={() => handleNavigatePage(Number(totalPages))}>
                                    <FiChevronRight size={25} color="#ffffff" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();

    const response = await prismic.query([Prismic.Predicates.at("document.type", "post")], {
        orderings: "[document.last_publication_date desc]",
        fetch: ["post.title", "post.description", "post.cover"],
        pageSize: 2,
    });

    const posts = response.results.map((post) => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            description: post.data.description.find((content) => content.type === "paragraph")?.text ?? "",
            cover: post.data.cover.url,
            updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
        };
    });

    return {
        props: {
            posts,
            page: response.page,
            totalPages: response.total_pages,
        },
        revalidate: 60 * 30,
    };
};
