const router = require("express").Router();
const {
  sellMultipleTickets,
  sellSingleTicket,
  findAllTickets,
  findTicketById,
  findTicketByUsername,
  updateTicketById,
  updateTicketsByUsername,
  deleteTicketById,
  deleteTicketsByUsername,
  drawWinners,
} = require("./controllers");
// query related routes

// get individual user by id
// router.get("/t/:id");
// // update user by id
// router.put("/t/:id");
// // delete user by id
// router.delete("/t/:id");
router
  .route("/t/:id")
  .get(findTicketById) // get individual ticket by id
  .put(updateTicketById) // update ticket by id
  .delete(deleteTicketById); // delete ticket by id

// get individual user by username
// router.get("/u/:username");
// // update user by username
// router.put("/u/:username");
// // delete user by username
// router.delete("/u/:username");
router
  .route("/u/:username")
  .get(findTicketByUsername) // get individual ticket by username
  .put(updateTicketsByUsername) // update ticket by username
  .delete(deleteTicketsByUsername); // delete ticket by username

// tickets related routes
// create a multiple tickets
router.post("/bulk", sellMultipleTickets);

// draw winners
router.get("/draw", drawWinners);

// // create a single ticket
// router.post("/");
// // get all tickets
// router.get("/");

router
  .route("/")
  .post(sellSingleTicket) // create a single ticket
  .get(findAllTickets); // get all tickets

module.exports = router;
