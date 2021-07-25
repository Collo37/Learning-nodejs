const express = require("express");
const fs = require("fs");
const app = express();

// MIDDLEWARES
app.use(express.json());

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

// ROUTE HANDLERS
const getTour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({ status: "fail", message: "invalid id" });
  }
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  //   console.log(req.body);
  const newId = tours.length;
  console.log(newId);
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: "success", data: { tour: newTour } });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: "fail", message: "invalid id" });
  }
  res.status(200).json({ status: "success", data: { tour: "<updated tour>" } });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({ status: "failed", message: "invalid id" });
  }
  res.status(204).json({ status: "success", data: null });
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
};
const createUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "this route is not yet defined" });
};
const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "this route is not yet defined" });
};
const deleteUser = (req, res) => {
  res.status(204).json({ status: "error", data: null });
};
const getUser = (req, res) => {
  const user = users.find((el) => el.name === req.params.name);
  if (!user) {
    res.status(404).json({ status: "not found", message: "User not found" });
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

// ROUTES

app.route("/api/v1/tours").get(getAllTours).post(createTour);
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route("/api/v1/users").get(getAllUsers).post(createUser);
app
  .route("/api/v1/users/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);
// START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
