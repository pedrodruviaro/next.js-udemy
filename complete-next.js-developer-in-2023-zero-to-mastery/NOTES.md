-   Fullstack framework
-   render content on the server

-   code splitting
-   performance

-   hydration -> ocorre depois do HTML exibido (antes do load do JS até a interação do usuário)
    -   pre-render -> user recebe html -> hydration

## getStaticProps

-   only runs at build time
-   only runs on server side
-   won't be included in client bundle
-   on DEV, runs on client and server side
