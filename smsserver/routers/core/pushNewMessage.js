import db_pool from "../../global/database.js";
import { parsePhoneNumberFromString } from 'libphonenumber-js'

function acceptOnlyCountryCodes(numberCode) {
    const validCodes = ['1'] // US and Canada
    return validCodes.includes(numberCode)
}




export default async function pushNewMessage(
    phoneNumberInput,
    country,
    shortcountry,
    countryphonecode,
    message
) {
    const response = { code: 200, message: "Message sent." }

    try {
        const trimMessage = String(message || "").trim()
        const pregNumber = String(phoneNumberInput || "").replace(/\D/g, '')
        const pregNumberCode = String(countryphonecode || "").replace(/\D/g, '')
        const trimCountry = String(country || "").trim()
        const trimShortCountry = String(shortcountry || "").trim()

        // 1. Validate message
        if (!trimMessage) {
            response.code = 400
            response.message = "Message is empty"
            return response
        }

        // 2. 
        if (pregNumber.length <= 7) {
            response.code = 400
            response.message = "Invalid phone number"
            return response
        }

        // 3. accept only country codes we support
        let fullNumber;
        if (acceptOnlyCountryCodes(pregNumberCode)) {
            fullNumber = `+${pregNumberCode}${pregNumber}`
        } else {
            response.code = 400
            response.message = `We do not support that country code`
            return response
        }

        // 4. Parse and validate
        const parsed = parsePhoneNumberFromString(fullNumber, 'US')
        if (!parsed?.isValid() ) {
            response.code = 400
            response.message = "Parse error: Invalid phone number format"
            return response
        }



        // 6. Insert into DB
        await db_pool.query(
            `INSERT INTO textmessages (phonenumber, country, shortcountry, countryphonecode, message)
             VALUES ($1, $2, $3, $4, $5)`,
            [pregNumber, trimCountry, trimShortCountry, pregNumberCode, trimMessage]
        )

        response.message = `Message queued for ${fullNumber}`

    } catch (err) {
        console.error(err)
        response.code = 500
        response.message = "Server error"
    }

    return response
}