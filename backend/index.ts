import { initDatabase } from "./src/config/db";
import express from "express";
import { config } from "./src/config/enviroment.config";
import MiddlwareConfig from "./src/config/middlware.config";
import router from "./src/routes";

const app = express();
app.use(express.json());

const PORT = config.PORT;

MiddlwareConfig.config(app);
app.use('/', router);


initDatabase()
    .then((connected) => {
        if (connected) {
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        } else {
            console.error("No se pudo inicializar la base de datos");
            process.exit(1);
        }
    })
    .catch((error) => {
        console.error("Error de inicialización:", error);
        process.exit(1);
    });
