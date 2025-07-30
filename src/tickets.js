const Ticket = require("./model/Ticket");
const { readFile, writeFile } = require("./utils");

const tickets = Symbol("tickets");

class TicketCollection {
  constructor() {
    (async function () {
      const data = await readFile();
      // console.log("data", data, typeof data);
      this[tickets] = data;
      // console.log("Tickets loaded from file:", this[tickets]);
    }).call(this);
  }

  /**
   * Create and save a new ticket
   * @param {string} username
   * @param {number} price
   * @returns {Ticket} The created ticket
   */

  create(username, price) {
    const ticket = new Ticket(username, price);
    this[tickets].push(ticket);
    writeFile(this[tickets]);
    return ticket;
  }

  /**
   *
   * @param {string} username
   * @param {number} price
   * @param {number} quantity
   * @returns {Ticket[]} An array of created tickets
   */
  createBulk(username, price, quantity) {
    const newTickets = [];
    for (let i = 0; i < quantity; i++) {
      const ticket = this.create(username, price);
      newTickets.push(ticket);
    }
    writeFile(this[tickets]);
    // console.log(`Created ${quantity} tickets for ${username}`);
    // console.log("Bulk Tickets:", newTickets);
    return newTickets;
  }

  /**
   * Get all tickets
   * @returns {Ticket[]} An array of all tickets
   */
  find() {
    return this[tickets];
  }

  /**
   * Find a ticket by its ID
   * @param {string} id
   * @returns {Ticket|null} The found ticket or null if not found
   */
  findTicketById(id) {
    const ticket = this[tickets].find(
      /**
       * @param {Ticket} ticket
       */
      (ticket) => ticket.id === id
    );
    return ticket || null;
  }

  /**
   * Find a ticket by its username
   * @param {string} username
   * @returns {Ticket[]|null} The found ticket or null if not found
   */
  findTicketByUsername(username) {
    const userTickets = this[tickets].filter(
      /**
       * @param {Ticket} ticket
       */
      (ticket) => ticket.username === username
    );
    return userTickets.length > 0 ? userTickets : null;
  }

  /**
   * Update a ticket by its ID
   * @param {string} ticketId
   * @param {{username: string, price: number}} ticketBody
   * @returns {Ticket|null} The updated ticket or null if not found
   */
  updateByTicketId(ticketId, ticketBody) {
    const ticket = this.findTicketById(ticketId);

    // console.log("Updating ticket:", ticket);

    if (!ticket) {
      console.log(`Ticket with ID ${ticketId} not found`);
      return null;
    }
    if (ticket) {
      // console.log("Before username", ticket);
      ticket.username = ticketBody.username ?? ticket.username;

      ticket.price = ticketBody.price ?? ticket.price;
    }
    // writeFile(this[tickets]);
    // console.log("Updated ticket:", ticket);
    return ticket || null;
  }

  /**
   * Bulk update tickets by their username
   * @param {string} username
   * @param {{username: string, price: number}} ticketBody
   * @returns {Ticket[]|null} An array of updated tickets or null if none found
   */
  updateBulkTicket(username, ticketBody) {
    const userTickets = this.findTicketByUsername(username);
    if (!userTickets) return null;

    const updatedBulkTickets = userTickets.map(
      /**
       * @param {Ticket} ticket
       */
      (ticket) => this.updateByTicketId(ticket.id, ticketBody)
    );
    writeFile(this[tickets]);
    // console.log("Updated Bulk Tickets:", updatedBulkTickets);
    return updatedBulkTickets;
  }

  /**
   * Delete a ticket by its ID
   * @param {string} ticketId
   * @returns {boolean} True if the ticket was deleted, false otherwise
   */

  deleteByTicketId(ticketId) {
    const index = this[tickets].findIndex(
      /**
       * @param {Ticket} ticket
       */
      (ticket) => ticket.id === ticketId
    );

    if (index !== -1) {
      this[tickets].splice(index, 1);
      writeFile(this[tickets]);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Bulk delete tickets by their username
   * @param {string} username
   * @returns {boolean} True if tickets were deleted, false otherwise
   */
  deleteBulkByUsername(username) {
    const userTickets = this.findTicketByUsername(username);
    if (!userTickets) return false;

    const deletedTickets = userTickets.map(
      /**
       * @param {Ticket} ticket
       */
      (ticket) => this.deleteByTicketId(ticket.id)
    );
    // console.log("Deleted tickets:", deletedTickets);
    writeFile(this[tickets]);
    // console.log(`Deleted tickets for username: ${username}`);
    return deletedTickets;
  }

  /**
   *
   * @param {number} winnerCount
   * @returns {Ticket[]} An array of winning tickets
   */
  drawTicket(winnerCount) {
    const winnerIndexes = new Array(winnerCount);
    let winnerIndex = 0;
    while (winnerIndex < winnerCount) {
      let ticketIndex = Math.floor(Math.random() * this[tickets].length);
      if (!winnerIndexes.includes(ticketIndex)) {
        winnerIndexes[winnerIndex++] = ticketIndex;
        continue;
      }
    }

    const winners = winnerIndexes.map(
      /**
       * @param {number} index
       */
      (index) => this[tickets][index]
    );
    return winners;
  }
}

const ticketsCollection = new TicketCollection();
module.exports = ticketsCollection;
