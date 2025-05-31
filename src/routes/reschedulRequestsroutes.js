const { createRescheduleRequest , getRescheduleRequests , respondToRescheduleRequest } = require('../controllers/reschedulRequestscontrollers');
const express = require('express');
const RescheduleRouter = express.Router();
const { Auth } = require('../middleware/Auth');


RescheduleRouter.post('/', Auth, createRescheduleRequest);
RescheduleRouter.get('/', Auth, getRescheduleRequests);
RescheduleRouter.put('/:id', Auth, respondToRescheduleRequest);

module.exports = RescheduleRouter;
