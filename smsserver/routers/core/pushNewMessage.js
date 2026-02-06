import db_pool from "../../global/database.js";

// @ts-ignore
export default async function pushConversation(phonenumber, country, shortcountry, countryphonecode, message) {
    const response = {
        code: 404,
        message: "no message sent.",
    };

    try {
        const safePhone = String(phonenumber ?? "").trim();
        const safeMessage = String(message ?? "").trim();

        if (safePhone.length < 4 || safeMessage.length === 0) {
            response.code = 201;
            response.message = "Invalid or empty phone number or message.";
            return response;
        }

        const sql = `INSERT INTO textmessages (phonenumber, country, shortcountry, countryphonecode, message)
        VALUES ($1, $2, $3, $4, $5);`;
        await db_pool.query(sql, [safePhone, country, shortcountry, countryphonecode, safeMessage]);
        response.code = 200;
        response.message = "Messages pushed successfully.";
    }
    catch (err) {
        console.error("Push conversation error:", err);
        response.code = 500;
        // @ts-ignore
        response.message = err.message || "There has been an unrecognized error.";
    }
    return response;
}
