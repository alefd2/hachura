import HachuraController from "./controllers/HachuraController.js";
import HachuraModel from "./models/HachuraModel.js";
import HachuraService from "./services/HachuraService.js";
import HachuraView from "./views/HachuraView.js";

const model = new HachuraModel();
const view = new HachuraView();
const service = new HachuraService();
const controller = new HachuraController(service, model, view);

controller.loadImages();
