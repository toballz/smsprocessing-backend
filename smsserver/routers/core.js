import express from 'express';
import { sessions } from '../global/functions.js';
import crypto from 'crypto';

import getMessagesLists from './core/getMessagesLists.js';
import pushConversation from './core/pushMessagesIds.js';
import pushNewMessage from './core/pushNewMessage.js';

const core_router = express.Router();
core_router.post('/:action', async (req, res) => {
    const SESSION_ENCRYPT_HASH = process.env.SESSION_ENCRYPT_HASH ?? 'default_secret';

    const { action } = req.params;
    const headers = req.headers;
    const auth_token = headers['x-omi-auth'];
    const auth_hash = headers['x-omi-hash'];
    const sessionHash_validate = sessions.verifySessionHash(auth_token);
    if (!SESSION_ENCRYPT_HASH) {
        //return res.status(500).json({ code: 500, message: "Unable to verify session#" });
    }

    const session_hash = crypto.createHash('sha256').update(SESSION_ENCRYPT_HASH + auth_token + SESSION_ENCRYPT_HASH).digest('hex');
    if (!action) {
        //return res.status(201).json({ code: 201, message: "no action" });
    }
    else if (!sessionHash_validate || (auth_hash !== session_hash)) {
        //return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    switch (action) {
        case 'getMessagesLists':
            const limit = req.body?.limit;

            const messages = await getMessagesLists(limit);
            return res.json(messages);


        case 'pushaddNewMessage':
            const phonenumber = req.body?.phonenumber;
            const country = req.body?.country;
            const shortcountry = req.body?.shortcountry;
            const countryphonecode = req.body?.countryphonecode;
            const message = req.body?.message;
            const adt = await pushNewMessage(phonenumber, country, shortcountry, countryphonecode, message);
            return res.json(adt);
        case 'pushUpdateSent':
            const aids = req.body?.aids;
            const status = req.body?.status;
            const uconvo = await pushConversation(aids, status);
            return res.json(uconvo);


        default:
            return res.status(400).json({ code: 400, message: "unresolved use case" });
    }
});
export default core_router;
