import {initServer} from "./app"

async function init() {
    const app = await initServer();
    app.listen(process.env.PORT || 3000, () => console.log(`Server Started at PORT: ${process.env.PORT}`))
};

init();