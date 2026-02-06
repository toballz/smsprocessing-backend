import db_pool from "../../global/database.js";

// @ts-ignore
export default async function pushConversation(id_ai="0", status="0") {
    const response = {
        code: 404,
        message: "no message sent.",
    };

    try {
        if ((id_ai ?? 0) === 0 || status.length <= 3) {
            response.code = 201;
            response.message = "Invalid or empty id or status.";
            return response;
        }

        const sql = `UPDATE textmessages SET status=$1, updated_on = NOW() WHERE id_ai = $2;`;
        await db_pool.query(sql, [status, id_ai]);
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
