import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    

    html, body, #root {
        min-height: 100%;
    }

    body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

        background-color: #0d2636;
        font-size: 14px;
        -webkit-font-smoothing: antialiased !important;
        color: #222222;
    }

    input, button {
        font: inherit;
        color: inherit;
    }

    button {
        cursor: pointer;
    }

    img {
        max-width: 100%;
        display: block;
    }
`;
