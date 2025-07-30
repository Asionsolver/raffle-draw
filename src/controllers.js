const TicketCollection = require("./tickets");

// ticket selling controllers

// Sell single ticket
exports.sellSingleTicket = async (req, res) => {
  const { username, price } = req.body;

  const ticket = TicketCollection.create(username, price);
  res.status(201).json({
    message: "Ticket created successfully 🎫",
    ticket,
  });
};

// Sell multiple tickets
exports.sellMultipleTickets = async (req, res) => {
  const { username, price, quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({
      error: "Quantity must be greater than zero",
    });
  }

  const tickets = TicketCollection.createBulk(username, price, quantity);
  res.status(201).json({
    message: "Tickets created successfully 🎫",
    tickets,
  });
};

// find ticket controllers

exports.findAllTickets = async (req, res) => {
  const tickets = TicketCollection.find();
  console.log("Tickets found:", tickets);
  const total = tickets.length;
  res.status(200).json({
    message: total === 0 ? "No tickets found" : "Tickets found 🎫",
    data: {
      items: tickets,
      total,
    },
  });
};

exports.findTicketById = async (req, res) => {
  const { id } = req.params;
  const ticket = TicketCollection.findTicketById(id);

  if (!ticket) {
    return res.status(404).json({
      error: "Ticket not found",
    });
  }

  res.status(200).json({
    message: "Ticket found 🎫",
    ticket,
  });
};

exports.findTicketByUsername = async (req, res) => {
  const { username } = req.params;
  const tickets = TicketCollection.findTicketByUsername(username);
  const total = tickets.length;

  if (total === 0) {
    return res.status(404).json({
      error: "No tickets found for this user",
    });
  }

  res.status(200).json({
    message: total === 1 ? "Ticket found 🎫" : "Tickets found 🎫",
    data: {
      items: tickets,
      total,
    },
  });
};

// update ticket controllers
exports.updateTicketById = async (req, res) => {
  const { id } = req.params;
  const ticketBody = req.body;
  const ticket = TicketCollection.updateByTicketId(id, ticketBody);
  if (!ticket) {
    return res.status(404).json({
      error: "Ticket not found",
    });
  }

  res.status(200).json({
    message: "Ticket updated successfully 🎫",
    data: ticket,
  });
};

// Bulk update tickets by username
exports.updateTicketsByUsername = async (req, res) => {
  const { username } = req.params;
  const tickets = TicketCollection.updateBulkTicket(username, req.body);
  console.log("Updated tickets:", tickets);
  const total = tickets.length;
  console.log("Total updated tickets:", total);

  if (!tickets) {
    return res.status(404).json({
      error: "No tickets found for this user",
    });
  }

  res.status(200).json({
    message:
      total === 1
        ? "Ticket updated successfully 🎫"
        : "Tickets updated successfully 🎫",
    data: {
      items: tickets,
      total,
    },
  });
};

// delete ticket controllers
exports.deleteTicketById = async (req, res) => {
  const { id } = req.params;
  const isDeleted = TicketCollection.deleteByTicketId(id);
  if (!isDeleted) {
    return res.status(400).json({
      error: "Delete operation failed ❌",
    });
  }

  res.status(204).json({
    message: "Ticket deleted successfully 🎫",
  });
};

exports.deleteTicketsByUsername = async (req, res) => {
  const { username } = req.params;
  const isDeleted = TicketCollection.deleteBulkByUsername(username);
  if (!isDeleted) {
    return res.status(400).json({
      error: "Delete operation failed ❌",
    });
  }

  res.status(204).json({
    message: "Tickets deleted successfully 🎫",
  });
};

// draw winners controller
exports.drawWinners = async (req, res) => {
  const wc = req.query.wc ?? 3;
  const winners = TicketCollection.drawTicket(wc);
  if (!winners) {
    return res.status(404).json({
      error: "No winners found",
    });
  }

  res.status(200).json({
    message: "Winners drawn successfully 🎉",
    data: winners,
  });
};
