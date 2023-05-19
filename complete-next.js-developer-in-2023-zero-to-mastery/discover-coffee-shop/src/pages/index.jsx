import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Banner from "../components/Banner";
import heroImage from "../../public/static/hero-image.png";
import Card from "../components/Card";
import { getCoffeeStores } from "../../lib/coffee-stores";
import useTrackLocation from "../hooks/useTrackLocation";
import { useEffect } from "react";

export default function Home({ coffeeStores }) {
  const { handleTrackLocation, latLong, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const handleOnBannerClick = (event) => {
    handleTrackLocation();
  };

  useEffect(() => {
    console.log("effect");

    async function handleEffect() {
      if (latLong) {
        try {
          const fetchedCoffeeStores = await getCoffeeStores(latLong, 6);
          console.log({ fetchedCoffeeStores });
          //set coffee stores
        } catch (error) {
          //set error
          console.log("Error", { error });
        }
      }
    }

    handleEffect();
  }, [latLong]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          handleOnClick={handleOnBannerClick}
          buttonText={isFindingLocation ? "Location..." : "View stores nearby"}
        />

        {locationErrorMsg && <p>Somethin went wrong: {locationErrorMsg}</p>}

        <div className={styles.heroImage}>
          <Image src={heroImage} alt="Hero image" width={700} height={400} />
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto Coffee Stores</h2>

            <div className={styles.cardLayout}>
              {coffeeStores?.map((item) => (
                <Card
                  key={item.id}
                  name={item.name}
                  image={
                    item.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${item.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const coffeeStores = await getCoffeeStores();

  return {
    props: {
      coffeeStores,
    },
  };
}
