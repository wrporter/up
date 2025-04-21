import express from "express";

import type { Contact } from "./contact.repo.js";
import { create, deleteById, getById, list } from "./contact.service.js";

export const contactRouter = express();

contactRouter.get("/v1/contacts", (_, res, next) => {
  res.status(200).json({ contacts: list() });
});

contactRouter.get("/v1/contacts/:id", (req, res, next) => {
  const contact = getById(req.params.id);
  if (contact) {
    res.json(contact);
  }
  res
    .status(404)
    .json({ message: "Contact not found", contactId: req.params.id });
});

contactRouter.post("/v1/contacts", (req, res, next) => {
  console.log(req.body);
  const contact = create(req.body as Contact);
  res.status(201).json(contact);
});

contactRouter.delete("/v1/contacts/:id", (req, res, next) => {
  deleteById(req.params.id);
  res.status(204).send();
});
