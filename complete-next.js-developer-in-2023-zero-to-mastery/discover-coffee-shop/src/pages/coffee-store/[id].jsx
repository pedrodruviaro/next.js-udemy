import data from "../../data/coffee-stores.json";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";
import places from "../../../public/static/icons/places.svg";
import nearMe from "../../../public/static/icons/nearMe.svg";
import star from "../../../public/static/icons/star.svg";
import { useRouter } from "next/router";

import { getCoffeeStores } from "../../../lib/coffee-stores";

export default function CoffeeStore({ coffeeStore }) {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    // https://location.foursquare.com/developer/reference/place-search
    // fsq3rhCSto8dbCnoEUAGAbjSfi4/5WuQCNkJSpQSD2ZBu1U=
    // uso -> latitue e longitude do google maps

    function handleUpvoteButton() {}

    return (
        <>
            <Head>
                <title>{coffeeStore?.name} | CoffeeStores</title>
            </Head>
            <div className={styles.layout}>
                <div className={styles.container}>
                    <div className={styles.col1}>
                        <div className={styles.backToHomeLink}>
                            <Link href="/">← Back to home</Link>
                        </div>
                        <div className={styles.nameWrapper}>
                            <h1 className={styles.name}>{coffeeStore?.name}</h1>
                        </div>
                        <Image
                            src={
                                coffeeStore.imgUrl ||
                                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                            }
                            width={600}
                            height={360}
                            alt={coffeeStore.name}
                            className={styles.storeImg}
                        />
                    </div>

                    <div className={cls("glass", styles.col2)}>
                        {coffeeStore.address && (
                            <div className={styles.iconWrapper}>
                                <Image
                                    src={places}
                                    width={24}
                                    height={24}
                                    alt=""
                                />
                                <p className={styles.text}>
                                    {coffeeStore?.address}
                                </p>
                            </div>
                        )}

                        {coffeeStore.cross_street && (
                            <div className={styles.iconWrapper}>
                                <Image
                                    src={nearMe}
                                    width={24}
                                    height={24}
                                    alt=""
                                />
                                <p className={styles.text}>
                                    {coffeeStore?.cross_street}
                                </p>
                            </div>
                        )}

                        <div className={styles.iconWrapper}>
                            <Image src={star} width={24} height={24} alt="" />
                            <p className={styles.text}>10</p>
                        </div>

                        <button
                            className={styles.upvoteButton}
                            onClick={handleUpvoteButton}
                        >
                            Up vote!
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getStaticPaths() {
    const coffeeStores = await getCoffeeStores();

    return {
        paths: coffeeStores.map((store) => {
            return {
                params: {
                    id: String(store.id),
                },
            };
        }),
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    const coffeeStores = await getCoffeeStores();

    const id = params.id;

    return {
        props: {
            coffeeStore: coffeeStores.find(
                (store) => String(store.id) === String(id)
            ),
        },
    };
}
