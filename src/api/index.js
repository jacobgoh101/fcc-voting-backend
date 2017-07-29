import { version } from "../../package.json";
import { Router } from "express";
import facets from "./facets";
import auth from "./auth";
import poll from "./poll";
import pollOption from "./pollOption";

export default ({ config, db }) => {
  let api = Router();

  // mount the facets resource
  api.use("/facets", facets({ config, db }));

  api.use("/auth", auth({ config, db }));

  api.use("/poll", poll({ config, db }));

  api.use("/pollOption", pollOption({ config, db }));

  // perhaps expose some API metadata at the root
  api.get("/", (req, res) => {
    res.json({ version });
  });

  return api;
};
