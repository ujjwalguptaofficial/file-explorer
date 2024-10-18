import { DefaultController } from "@/controllers/default_controller";
import { IControllerRoute } from "fortjs";
import { FileController } from "./controllers/file_controller";

export const routes: IControllerRoute[] = [{
    path: "/*",
    controller: DefaultController
},
{
    path: '/file',
    controller: FileController
}
];
